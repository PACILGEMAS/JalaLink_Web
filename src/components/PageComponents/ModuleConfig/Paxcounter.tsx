import type { PaxcounterValidation } from "@app/validation/moduleConfig/paxcounter.tsx";
import { create } from "@bufbuild/protobuf";
import { DynamicForm } from "@components/Form/DynamicForm.tsx";
import { useDevice } from "@core/stores/deviceStore.ts";
import { Protobuf } from "@meshtastic/core";

export const Paxcounter = () => {
  const { moduleConfig, setWorkingModuleConfig } = useDevice();

  const onSubmit = (data: PaxcounterValidation) => {
    setWorkingModuleConfig(
      create(Protobuf.ModuleConfig.ModuleConfigSchema, {
        payloadVariant: {
          case: "paxcounter",
          value: data,
        },
      }),
    );
  };

  return (
    <DynamicForm<PaxcounterValidation>
      onSubmit={onSubmit}
      defaultValues={moduleConfig.paxcounter}
      fieldGroups={[
        {
          label: "Pengaturan Paxcounter",
          description: "Pengaturan untuk modul Paxcounter",
          fields: [
            {
              type: "toggle",
              name: "enabled",
              label: "Modul Diaktifkan",
              description: "Aktifkan Paxcounter",
            },
            {
              type: "number",
              name: "paxcounterUpdateInterval",
              label: "Interval Pembaruan (detik)",
              description:
                "Durasi jeda antar pengiriman paket paxcounter",
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
