import { useAppStore } from "../../../core/stores/appStore.ts";
import type { BluetoothValidation } from "@app/validation/config/bluetooth.tsx";
import { create } from "@bufbuild/protobuf";
import { DynamicForm } from "@components/Form/DynamicForm.tsx";
import { useDevice } from "@core/stores/deviceStore.ts";
import { Protobuf } from "@meshtastic/core";
import { useState } from "react";

export const Bluetooth = () => {
  const { config, setWorkingConfig } = useDevice();
  const {
    hasErrors,
    getErrorMessage,
    hasFieldError,
    addError,
    removeError,
    clearErrors,
  } = useAppStore();

  const [bluetoothPin, setBluetoothPin] = useState(
    config?.bluetooth?.fixedPin.toString() ?? "",
  );

  const validateBluetoothPin = (pin: string) => {
    // if empty show error they need a pin set
    if (pin === "") {
      return addError("fixedPin", "PIN Bluetooth wajib diisi");
    }

    // clear any existing errors
    clearErrors();

    // if it starts with 0 show error
    if (pin[0] === "0") {
      return addError("fixedPin", "PIN Bluetooth tidak boleh diawali 0");
    }
    // if it's not 6 digits show error
    if (pin.length < 6) {
      return addError("fixedPin", "PIN harus 6 digit");
    }

    removeError("fixedPin");
  };

  const bluetoothPinChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, "").slice(0, 6);
    setBluetoothPin(numericValue);
    validateBluetoothPin(numericValue);
  };

  const onSubmit = (data: BluetoothValidation) => {
    if (hasErrors()) {
      return;
    }

    setWorkingConfig(
      create(Protobuf.Config.ConfigSchema, {
        payloadVariant: {
          case: "bluetooth",
          value: data,
        },
      }),
    );
  };

  return (
    <DynamicForm<BluetoothValidation>
      onSubmit={onSubmit}
      defaultValues={config.bluetooth}
      fieldGroups={[
        {
          label: "Pengaturan Bluetooth",
          description: "Pengaturan untuk modul Bluetooth ",
          notes:
            "Catatan: Beberapa perangkat (ESP32) tidak dapat memakai Bluetooth dan WiFi secara bersamaan.",
          fields: [
            {
              type: "toggle",
              name: "enabled",
              label: "Diaktifkan",
              description: "Aktifkan atau nonaktifkan Bluetooth",
            },
            {
              type: "select",
              name: "mode",
              label: "Mode pemasangan",
              description: "Perilaku pemilihan PIN.",
              selectChange: (e) => {
                if (e !== "1") {
                  setBluetoothPin("");
                  removeError("fixedPin");
                }
              },
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
              properties: {
                enumValue: Protobuf.Config.Config_BluetoothConfig_PairingMode,
                formatEnumName: true,
              },
            },
            {
              type: "number",
              name: "fixedPin",
              label: "PIN",
              description: "PIN yang digunakan saat pemasangan",
              validationText: hasFieldError("fixedPin")
                ? getErrorMessage("fixedPin")
                : "",
              inputChange: bluetoothPinChangeEvent,
              disabledBy: [
                {
                  fieldName: "mode",
                  selector: Protobuf.Config.Config_BluetoothConfig_PairingMode
                    .FIXED_PIN,
                  invert: true,
                },
                {
                  fieldName: "enabled",
                },
              ],
              properties: {
                value: bluetoothPin,
              },
            },
          ],
        },
      ]}
    />
  );
};
