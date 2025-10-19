import { PkiRegenerateDialog } from "@components/Dialog/PkiRegenerateDialog.tsx";
import { DynamicForm } from "@components/Form/DynamicForm.tsx";
import { useAppStore } from "@core/stores/appStore.ts";
import {
  getX25519PrivateKey,
  getX25519PublicKey,
} from "@core/utils/x25519.ts";
import type { SecurityValidation } from "@app/validation/config/security.ts";
import { create } from "@bufbuild/protobuf";
import { useDevice } from "@core/stores/deviceStore.ts";
import { Protobuf } from "@meshtastic/core";
import { fromByteArray, toByteArray } from "base64-js";
import { Eye, EyeOff } from "lucide-react";
import { useReducer } from "react";
import { securityReducer } from "@components/PageComponents/Config/Security/securityReducer.tsx";

export const Security = () => {
  const { config, setWorkingConfig, setDialogOpen } = useDevice();
  const {
    hasErrors,
    getErrorMessage,
    hasFieldError,
    addError,
    removeError,
    clearErrors,
  } = useAppStore();

  const [state, dispatch] = useReducer(securityReducer, {
    privateKey: fromByteArray(config.security?.privateKey ?? new Uint8Array(0)),
    privateKeyVisible: false,
    adminKeyVisible: false,
    privateKeyBitCount: config.security?.privateKey?.length ?? 32,
    adminKeyBitCount: config.security?.adminKey?.at(0)?.length ?? 32,
    publicKey: fromByteArray(config.security?.publicKey ?? new Uint8Array(0)),
    adminKey: fromByteArray(
      config.security?.adminKey?.at(0) ?? new Uint8Array(0),
    ),
    privateKeyDialogOpen: false,
  });

  const validateKey = (
    input: string,
    count: number,
    fieldName: "privateKey" | "adminKey",
  ) => {
    try {
      removeError(fieldName);

      if (fieldName === "privateKey" && input === "") {
        addError(fieldName, "Kunci privat wajib diisi");
        return;
      }

      if (fieldName === "adminKey" && input === "") {
        return;
      }

      if (input.length % 4 !== 0) {
        addError(
          fieldName,
          `${fieldName === "privateKey" ? "Kunci privat" : "Kunci admin"
          } harus berupa PSK 256 bit`,
        );
        return;
      }

      const decoded = toByteArray(input);
      if (decoded.length !== count) {
        addError(fieldName, `Masukkan PSK ${count * 8} bit yang valid`);
        return;
      }
    } catch (e) {
      console.error(e);
      addError(
        fieldName,
        `Format ${fieldName === "privateKey" ? "kunci privat" : "kunci admin"
        } tidak valid`,
      );
    }
  };

  const onSubmit = (data: SecurityValidation) => {
    if (hasErrors()) {
      return;
    }
    setWorkingConfig(
      create(Protobuf.Config.ConfigSchema, {
        payloadVariant: {
          case: "security",
          value: {
            ...data,
            adminKey: [new Uint8Array(0)],
            privateKey: toByteArray(state.privateKey),
            publicKey: toByteArray(state.publicKey),
          },
        },
      }),
    );
  };

  const pkiRegenerate = () => {
    clearErrors();
    const privateKey = getX25519PrivateKey();
    const publicKey = getX25519PublicKey(privateKey);

    dispatch({
      type: "REGENERATE_PRIV_PUB_KEY",
      payload: {
        privateKey: fromByteArray(privateKey),
        publicKey: fromByteArray(publicKey),
      },
    });

    validateKey(
      fromByteArray(privateKey),
      state.privateKeyBitCount,
      "privateKey",
    );
  };

  const privateKeyInputChangeEvent = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const privateKeyB64String = e.target.value;
    dispatch({ type: "SET_PRIVATE_KEY", payload: privateKeyB64String });
    validateKey(privateKeyB64String, state.privateKeyBitCount, "privateKey");

    const publicKey = getX25519PublicKey(toByteArray(privateKeyB64String));
    dispatch({ type: "SET_PUBLIC_KEY", payload: fromByteArray(publicKey) });
  };

  const adminKeyInputChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const psk = e.currentTarget?.value;
    dispatch({ type: "SET_ADMIN_KEY", payload: psk });
    validateKey(psk, state.privateKeyBitCount, "adminKey");
  };

  const privateKeySelectChangeEvent = (e: string) => {
    const count = Number.parseInt(e);
    dispatch({ type: "SET_PRIVATE_KEY_BIT_COUNT", payload: count });
    validateKey(state.privateKey, count, "privateKey");
  };

  return (
    <>
      <DynamicForm<SecurityValidation>
        onSubmit={onSubmit}
        submitType="onChange"
        defaultValues={{
          ...config.security,
          ...{
            adminKey: state.adminKey,
            privateKey: state.privateKey,
            publicKey: state.publicKey,
            adminChannelEnabled: config.security?.adminChannelEnabled ?? false,
            isManaged: config.security?.isManaged ?? false,
            debugLogApiEnabled: config.security?.debugLogApiEnabled ?? false,
            serialEnabled: config.security?.serialEnabled ?? false,
          },
        }}
        fieldGroups={[
          {
            label: "Pengaturan Keamanan",
            description: "Pengaturan untuk konfigurasi keamanan",
            fields: [
              {
                type: "passwordGenerator",
                id: "pskInput",
                name: "privateKey",
                label: "Kunci Privat",
                description: "Digunakan untuk membuat kunci bersama dengan perangkat jarak jauh",
                bits: [{ text: "256 bit", value: "32", key: "bit256" }],
                validationText: hasFieldError("privateKey")
                  ? getErrorMessage("privateKey")
                  : "",
                devicePSKBitCount: state.privateKeyBitCount,
                inputChange: privateKeyInputChangeEvent,
                selectChange: privateKeySelectChangeEvent,
                hide: !state.privateKeyVisible,
                actionButtons: [
                  {
                    text: "Buat",
                    onClick: () =>
                      dispatch({
                        type: "SHOW_PRIVATE_KEY_DIALOG",
                        payload: true,
                      }),
                    variant: "success",
                  },
                  {
                    text: "Cadangkan Kunci",
                    onClick: () => setDialogOpen("pkiBackup", true),
                    variant: "subtle",
                  },
                ],
                properties: {
                  value: state.privateKey,
                  action: {
                    icon: state.privateKeyVisible ? EyeOff : Eye,
                    onClick: () =>
                      dispatch({ type: "TOGGLE_PRIVATE_KEY_VISIBILITY" }),
                  },
                },
              },
              {
                type: "text",
                name: "publicKey",
                label: "Kunci Publik",
                disabled: true,
                description:
                  "Dikirim ke node lain pada mesh agar mereka dapat menghitung kunci rahasia bersama",
                properties: {
                  value: state.publicKey,
                },
              },
            ],
          },
          {
            label: "Pengaturan Admin",
            description: "Pengaturan untuk admin",
            fields: [
              {
                type: "toggle",
                name: "adminChannelEnabled",
                label: "Izinkan Admin Lama",
                description:
                  "Izinkan kendali perangkat yang masuk melalui kanal admin lama yang tidak aman",
              },
              {
                type: "toggle",
                name: "isManaged",
                label: "Dikelola",
                description:
                  "Jika diaktifkan, opsi konfigurasi perangkat hanya dapat diubah jarak jauh oleh node Admin Jarak Jauh melalui pesan admin. Jangan aktifkan opsi ini kecuali node Admin Jarak Jauh telah disiapkan dan kunci publiknya disimpan pada kolom di bawah.",
              },
              {
                type: "passwordGenerator",
                name: "adminKey",
                id: "adminKeyInput",
                label: "Kunci Admin",
                description:
                  "Kunci publik yang diizinkan mengirim pesan admin ke node ini",
                validationText: hasFieldError("adminKey")
                  ? getErrorMessage("adminKey")
                  : "",
                inputChange: adminKeyInputChangeEvent,
                selectChange: () => { },
                bits: [{ text: "256 bit", value: "32", key: "bit256" }],
                devicePSKBitCount: state.privateKeyBitCount,
                hide: !state.adminKeyVisible,
                actionButtons: [
                  {
                    text: "Buat",
                    variant: "success",
                    onClick: () => {
                      const adminKey = getX25519PrivateKey();
                      dispatch({
                        type: "REGENERATE_ADMIN_KEY",
                        payload: { adminKey: fromByteArray(adminKey) },
                      });
                      validateKey(
                        fromByteArray(adminKey),
                        state.adminKeyBitCount,
                        "adminKey",
                      );
                    },
                  },
                ],
                disabledBy: [
                  { fieldName: "adminChannelEnabled", invert: true },
                ],
                properties: {
                  value: state.adminKey,
                  action: {
                    icon: state.adminKeyVisible ? EyeOff : Eye,
                    onClick: () =>
                      dispatch({ type: "TOGGLE_ADMIN_KEY_VISIBILITY" }),
                  },
                },
              },
            ],
          },
          {
            label: "Pengaturan Log",
            description: "Pengaturan untuk pencatatan",
            fields: [
              {
                type: "toggle",
                name: "debugLogApiEnabled",
                label: "Aktifkan API Log Debug",
                description:
                  "Keluarkan log debug langsung melalui serial, lihat dan ekspor log perangkat yang disamarkan posisinya lewat Bluetooth",
              },
              {
                type: "toggle",
                name: "serialEnabled",
                label: "Keluaran Serial Diaktifkan",
                description: "Konsol serial melalui Stream API",
              },
            ],
          },
        ]}
      />
      <PkiRegenerateDialog
        open={state.privateKeyDialogOpen}
        onOpenChange={() =>
          dispatch({ type: "SHOW_PRIVATE_KEY_DIALOG", payload: false })}
        onSubmit={pkiRegenerate}
      />
    </>
  );
};
