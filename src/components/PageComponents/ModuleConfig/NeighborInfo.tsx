import { useDevice } from "@core/stores/deviceStore.ts";
import type { NeighborInfoValidation } from "@app/validation/moduleConfig/neighborInfo.tsx";
import { create } from "@bufbuild/protobuf";
import { DynamicForm } from "@components/Form/DynamicForm.tsx";
import { Protobuf } from "@meshtastic/core";

export const NeighborInfo = () => {
  const { moduleConfig, setWorkingModuleConfig } = useDevice();

  const onSubmit = (data: NeighborInfoValidation) => {
    setWorkingModuleConfig(
      create(Protobuf.ModuleConfig.ModuleConfigSchema, {
        payloadVariant: {
          case: "neighborInfo",
          value: data,
        },
      }),
    );
  };

  return (
    <DynamicForm<NeighborInfoValidation>
      onSubmit={onSubmit}
      defaultValues={moduleConfig.neighborInfo}
      fieldGroups={[
        {
          label: "Pengaturan Info Tetangga",
          description: "Pengaturan untuk modul info tetangga",
          fields: [
            {
              type: "toggle",
              name: "enabled",
              label: "Diaktifkan",
              description: "Aktifkan atau nonaktifkan modul info tetangga",
            },
            {
              type: "number",
              name: "updateInterval",
              label: "Interval Pembaruan",
              description:
                "Interval dalam detik seberapa sering info tetangga dikirim ke mesh",
              properties: {
                suffix: "Detik",
              },
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
