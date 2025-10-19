import type { AudioValidation } from "@app/validation/moduleConfig/audio.tsx";
import { create } from "@bufbuild/protobuf";
import { DynamicForm } from "@components/Form/DynamicForm.tsx";
import { useDevice } from "@core/stores/deviceStore.ts";
import { Protobuf } from "@meshtastic/core";

export const Audio = () => {
  const { moduleConfig, setWorkingModuleConfig } = useDevice();

  const onSubmit = (data: AudioValidation) => {
    setWorkingModuleConfig(
      create(Protobuf.ModuleConfig.ModuleConfigSchema, {
        payloadVariant: {
          case: "audio",
          value: data,
        },
      }),
    );
  };

  return (
    <DynamicForm<AudioValidation>
      onSubmit={onSubmit}
      defaultValues={moduleConfig.audio}
      fieldGroups={[
        {
          label: "Pengaturan Audio",
          description: "Pengaturan untuk modul audio",
          fields: [
            {
              type: "toggle",
              name: "codec2Enabled",
              label: "Codec 2 Diaktifkan",
              description: "Aktifkan enkode audio Codec 2",
            },
            {
              type: "number",
              name: "pttPin",
              label: "Pin PTT",
              description: "Pin GPIO yang digunakan untuk PTT",
            },
            {
              type: "select",
              name: "bitrate",
              label: "Bitrate",
              description: "Bitrate untuk enkode audio",
              properties: {
                enumValue:
                  Protobuf.ModuleConfig.ModuleConfig_AudioConfig_Audio_Baud,
              },
            },
            {
              type: "number",
              name: "i2sWs",
              label: "i2S WS",
              description: "Pin GPIO yang digunakan untuk i2S WS",
            },
            {
              type: "number",
              name: "i2sSd",
              label: "i2S SD",
              description: "Pin GPIO yang digunakan untuk i2S SD",
            },
            {
              type: "number",
              name: "i2sDin",
              label: "i2S DIN",
              description: "Pin GPIO yang digunakan untuk i2S DIN",
            },
            {
              type: "number",
              name: "i2sSck",
              label: "i2S SCK",
              description: "Pin GPIO yang digunakan untuk i2S SCK",
            },
          ],
        },
      ]}
    />
  );
};
