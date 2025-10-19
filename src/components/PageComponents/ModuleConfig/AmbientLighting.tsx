import { useDevice } from "@core/stores/deviceStore.ts";
import type { AmbientLightingValidation } from "@app/validation/moduleConfig/ambientLighting.tsx";
import { create } from "@bufbuild/protobuf";
import { DynamicForm } from "@components/Form/DynamicForm.tsx";
import { Protobuf } from "@meshtastic/core";

export const AmbientLighting = () => {
  const { moduleConfig, setWorkingModuleConfig } = useDevice();

  const onSubmit = (data: AmbientLightingValidation) => {
    setWorkingModuleConfig(
      create(Protobuf.ModuleConfig.ModuleConfigSchema, {
        payloadVariant: {
          case: "ambientLighting",
          value: data,
        },
      }),
    );
  };

  return (
    <DynamicForm<AmbientLightingValidation>
      onSubmit={onSubmit}
      defaultValues={moduleConfig.ambientLighting}
      fieldGroups={[
        {
          label: "Pengaturan Pencahayaan Sekitar",
          description: "Pengaturan untuk modul pencahayaan sekitar",
          fields: [
            {
              type: "toggle",
              name: "ledState",
              label: "Status LED",
              description: "Atur LED aktif atau mati",
            },
            {
              type: "number",
              name: "current",
              label: "Arus",
              description: "Atur arus keluaran LED. Bawaan adalah 10",
            },
            {
              type: "number",
              name: "red",
              label: "Merah",
              description: "Atur level LED merah. Nilai 0-255",
            },
            {
              type: "number",
              name: "green",
              label: "Hijau",
              description: "Atur level LED hijau. Nilai 0-255",
            },
            {
              type: "number",
              name: "blue",
              label: "Biru",
              description: "Atur level LED biru. Nilai 0-255",
            },
          ],
        },
      ]}
    />
  );
};
