import type { DisplayValidation } from "@app/validation/config/display.tsx";
import { create } from "@bufbuild/protobuf";
import { DynamicForm } from "@components/Form/DynamicForm.tsx";
import { useDevice } from "@core/stores/deviceStore.ts";
import { Protobuf } from "@meshtastic/core";

export const Display = () => {
  const { config, setWorkingConfig } = useDevice();

  const onSubmit = (data: DisplayValidation) => {
    setWorkingConfig(
      create(Protobuf.Config.ConfigSchema, {
        payloadVariant: {
          case: "display",
          value: data,
        },
      }),
    );
  };

  return (
    <DynamicForm<DisplayValidation>
      onSubmit={onSubmit}
      defaultValues={config.display}
      fieldGroups={[
        {
          label: "Pengaturan Tampilan",
          description: "Pengaturan untuk tampilan perangkat",
          fields: [
            {
              type: "number",
              name: "screenOnSecs",
              label: "Waktu tunggu layar",
              description: "Matikan layar setelah durasi ini",
              properties: {
                suffix: "Detik",
              },
            },
            {
              type: "select",
              name: "gpsFormat",
              label: "Satuan tampilan GPS",
              description: "Format tampilan koordinat",
              properties: {
                enumValue:
                  Protobuf.Config.Config_DisplayConfig_GpsCoordinateFormat,
              },
            },
            {
              type: "number",
              name: "autoScreenCarouselSecs",
              label: "Jeda karusel",
              description: "Kecepatan pergantian jendela",
              properties: {
                suffix: "Detik",
              },
            },
            {
              type: "toggle",
              name: "compassNorthTop",
              label: "Kompas Utara di Atas",
              description: "Tetapkan arah utara di bagian atas kompas",
            },
            {
              type: "toggle",
              name: "flipScreen",
              label: "Balik Layar",
              description: "Balik tampilan 180 derajat",
            },
            {
              type: "select",
              name: "units",
              label: "Satuan Tampilan",
              description: "Tampilkan satuan metrik atau imperial",
              properties: {
                enumValue: Protobuf.Config.Config_DisplayConfig_DisplayUnits,
                formatEnumName: true,
              },
            },
            {
              type: "select",
              name: "oled",
              label: "Jenis OLED",
              description: "Jenis layar OLED pada perangkat",
              properties: {
                enumValue: Protobuf.Config.Config_DisplayConfig_OledType,
              },
            },
            {
              type: "select",
              name: "displaymode",
              label: "Mode Tampilan",
              description: "Variasi tata letak layar",
              properties: {
                enumValue: Protobuf.Config.Config_DisplayConfig_DisplayMode,
                formatEnumName: true,
              },
            },
            {
              type: "toggle",
              name: "headingBold",
              label: "Judul Tebal",
              description: "Tebalkan teks judul",
            },
            {
              type: "toggle",
              name: "wakeOnTapOrMotion",
              label: "Bangun saat Ketuk atau Gerakan",
              description: "Bangunkan perangkat ketika diketuk atau digerakkan",
            },
          ],
        },
      ]}
    />
  );
};
