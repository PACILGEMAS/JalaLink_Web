import type { RangeTestValidation } from "@app/validation/moduleConfig/rangeTest.tsx";
import { create } from "@bufbuild/protobuf";
import { DynamicForm } from "@components/Form/DynamicForm.tsx";
import { useDevice } from "@core/stores/deviceStore.ts";
import { Protobuf } from "@meshtastic/core";

export const RangeTest = () => {
  const { moduleConfig, setWorkingModuleConfig } = useDevice();

  const onSubmit = (data: RangeTestValidation) => {
    setWorkingModuleConfig(
      create(Protobuf.ModuleConfig.ModuleConfigSchema, {
        payloadVariant: {
          case: "rangeTest",
          value: data,
        },
      }),
    );
  };

  return (
    <DynamicForm<RangeTestValidation>
      onSubmit={onSubmit}
      defaultValues={moduleConfig.rangeTest}
      fieldGroups={[
        {
          label: "Pengaturan Uji Jarak",
          description: "Pengaturan untuk modul uji jarak",
          fields: [
            {
              type: "toggle",
              name: "enabled",
              label: "Modul Diaktifkan",
              description: "Aktifkan uji jarak",
            },
            {
              type: "number",
              name: "sender",
              label: "Interval Pesan",
              description: "Durasi jeda antar pengiriman paket uji",
              properties: {
                suffix: "Detik",
              },
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "toggle",
              name: "save",
              label: "Simpan CSV ke penyimpanan",
              description: "Hanya untuk ESP32",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
          ],
        },
      ]}
    />
  );
};
