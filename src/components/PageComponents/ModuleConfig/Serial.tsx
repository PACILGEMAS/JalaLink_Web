import type { SerialValidation } from "@app/validation/moduleConfig/serial.tsx";
import { create } from "@bufbuild/protobuf";
import { DynamicForm } from "@components/Form/DynamicForm.tsx";
import { useDevice } from "@core/stores/deviceStore.ts";
import { Protobuf } from "@meshtastic/core";

export const Serial = () => {
  const { moduleConfig, setWorkingModuleConfig } = useDevice();

  const onSubmit = (data: SerialValidation) => {
    setWorkingModuleConfig(
      create(Protobuf.ModuleConfig.ModuleConfigSchema, {
        payloadVariant: {
          case: "serial",
          value: data,
        },
      }),
    );
  };

  return (
    <DynamicForm<SerialValidation>
      onSubmit={onSubmit}
      defaultValues={moduleConfig.serial}
      fieldGroups={[
        {
          label: "Pengaturan Serial",
          description: "Pengaturan untuk modul serial",
          fields: [
            {
              type: "toggle",
              name: "enabled",
              label: "Modul Diaktifkan",
              description: "Aktifkan keluaran serial",
            },
            {
              type: "toggle",
              name: "echo",
              label: "Echo",
              description:
                "Setiap paket yang Anda kirim akan dikirim balik ke perangkat",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "number",
              name: "rxd",
              label: "Pin Terima",
              description: "Atur pin GPIO sesuai pin RXD yang digunakan.",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "number",
              name: "txd",
              label: "Pin Transmisi",
              description: "Atur pin GPIO sesuai pin TXD yang digunakan.",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "select",
              name: "baud",
              label: "Laju Baud",
              description: "Laju baud serial",

              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
              properties: {
                enumValue:
                  Protobuf.ModuleConfig.ModuleConfig_SerialConfig_Serial_Baud,
              },
            },
            {
              type: "number",
              name: "timeout",
              label: "Batas Waktu",

              description:
                "Waktu tunggu (detik) sebelum paket dianggap selesai",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
              properties: {
                suffix: "Detik",
              },
            },
            {
              type: "select",
              name: "mode",
              label: "Mode",
              description: "Pilih mode",

              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
              properties: {
                enumValue:
                  Protobuf.ModuleConfig.ModuleConfig_SerialConfig_Serial_Mode,
                formatEnumName: true,
              },
            },
            {
              type: "toggle",
              name: "overrideConsoleSerialPort",
              label: "Override Port Serial Konsol",
              description:
                "Jika ada port serial yang terhubung ke konsol, opsi ini akan menimpanya.",
            },
          ],
        },
      ]}
    />
  );
};
