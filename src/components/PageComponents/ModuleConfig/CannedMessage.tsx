import type { CannedMessageValidation } from "@app/validation/moduleConfig/cannedMessage.tsx";
import { create } from "@bufbuild/protobuf";
import { DynamicForm } from "@components/Form/DynamicForm.tsx";
import { useDevice } from "@core/stores/deviceStore.ts";
import { Protobuf } from "@meshtastic/core";

export const CannedMessage = () => {
  const { moduleConfig, setWorkingModuleConfig } = useDevice();

  const onSubmit = (data: CannedMessageValidation) => {
    setWorkingModuleConfig(
      create(Protobuf.ModuleConfig.ModuleConfigSchema, {
        payloadVariant: {
          case: "cannedMessage",
          value: data,
        },
      }),
    );
  };

  return (
    <DynamicForm<CannedMessageValidation>
      onSubmit={onSubmit}
      defaultValues={moduleConfig.cannedMessage}
      fieldGroups={[
        {
          label: "Pengaturan Pesan Siap Pakai",
          description: "Pengaturan untuk modul pesan siap pakai",
          fields: [
            {
              type: "toggle",
              name: "enabled",
              label: "Modul Diaktifkan",
              description: "Aktifkan Pesan Siap Pakai",
            },
            {
              type: "toggle",
              name: "rotary1Enabled",
              label: "Rotary Encoder #1 Diaktifkan",
              description: "Aktifkan rotary encoder",
            },
            {
              type: "number",
              name: "inputbrokerPinA",
              label: "Pin Encoder A",
              description: "Nilai pin GPIO (1-39) untuk port encoder A",
            },
            {
              type: "number",
              name: "inputbrokerPinB",
              label: "Pin Encoder B",
              description: "Nilai pin GPIO (1-39) untuk port encoder B",
            },
            {
              type: "number",
              name: "inputbrokerPinPress",
              label: "Pin Tekan Encoder",
              description: "Nilai pin GPIO (1-39) untuk tombol encoder",
            },
            {
              type: "select",
              name: "inputbrokerEventCw",
              label: "Peristiwa searah jarum jam",
              description: "Pilih peristiwa masukan.",
              properties: {
                enumValue: Protobuf.ModuleConfig
                  .ModuleConfig_CannedMessageConfig_InputEventChar,
              },
            },
            {
              type: "select",
              name: "inputbrokerEventCcw",
              label: "Peristiwa berlawanan jarum jam",
              description: "Pilih peristiwa masukan.",
              properties: {
                enumValue: Protobuf.ModuleConfig
                  .ModuleConfig_CannedMessageConfig_InputEventChar,
              },
            },
            {
              type: "select",
              name: "inputbrokerEventPress",
              label: "Peristiwa tekan",
              description: "Pilih peristiwa masukan",
              properties: {
                enumValue: Protobuf.ModuleConfig
                  .ModuleConfig_CannedMessageConfig_InputEventChar,
              },
            },
            {
              type: "toggle",
              name: "updown1Enabled",
              label: "Encoder naik turun diaktifkan",
              description: "Aktifkan encoder naik/turun",
            },
            {
              type: "text",
              name: "allowInputSource",
              label: "Sumber Masukan yang Diizinkan",
              description:
                "Pilih dari: '_any', 'rotEnc1', 'upDownEnc1', 'cardkb'",
            },
            {
              type: "toggle",
              name: "sendBell",
              label: "Kirim Bel",
              description: "Kirim karakter bel pada setiap pesan",
            },
          ],
        },
      ]}
    />
  );
};
