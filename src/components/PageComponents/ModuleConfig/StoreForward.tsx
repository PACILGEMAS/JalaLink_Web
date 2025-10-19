import type { StoreForwardValidation } from "@app/validation/moduleConfig/storeForward.ts";
import { create } from "@bufbuild/protobuf";
import { DynamicForm } from "@components/Form/DynamicForm.tsx";
import { useDevice } from "@core/stores/deviceStore.ts";
import { Protobuf } from "@meshtastic/core";

export const StoreForward = () => {
  const { moduleConfig, setWorkingModuleConfig } = useDevice();

  const onSubmit = (data: StoreForwardValidation) => {
    setWorkingModuleConfig(
      create(Protobuf.ModuleConfig.ModuleConfigSchema, {
        payloadVariant: {
          case: "storeForward",
          value: data,
        },
      }),
    );
  };

  return (
    <DynamicForm<StoreForwardValidation>
      onSubmit={onSubmit}
      defaultValues={moduleConfig.storeForward}
      fieldGroups={[
        {
          label: "Pengaturan Simpan & Teruskan",
          description: "Pengaturan untuk modul Simpan & Teruskan",
          fields: [
            {
              type: "toggle",
              name: "enabled",
              label: "Modul Diaktifkan",
              description: "Aktifkan Simpan & Teruskan",
            },
            {
              type: "toggle",
              name: "heartbeat",
              label: "Detak Diaktifkan",
              description: "Aktifkan heartbeat Simpan & Teruskan",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "number",
              name: "records",
              label: "Jumlah rekaman",
              description: "Jumlah rekaman yang disimpan",

              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
              properties: {
                suffix: "Rekaman",
              },
            },
            {
              type: "number",
              name: "historyReturnMax",
              label: "Maksimum riwayat dikembalikan",
              description: "Jumlah maksimum rekaman yang dikembalikan",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "number",
              name: "historyReturnWindow",
              label: "Jendela pengembalian riwayat",
              description: "Jumlah maksimum rekaman yang dikembalikan",
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
