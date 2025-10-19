import type { TelemetryValidation } from "@app/validation/moduleConfig/telemetry.tsx";
import { create } from "@bufbuild/protobuf";
import { DynamicForm } from "@components/Form/DynamicForm.tsx";
import { useDevice } from "@core/stores/deviceStore.ts";
import { Protobuf } from "@meshtastic/core";

export const Telemetry = () => {
  const { moduleConfig, setWorkingModuleConfig } = useDevice();

  const onSubmit = (data: TelemetryValidation) => {
    setWorkingModuleConfig(
      create(Protobuf.ModuleConfig.ModuleConfigSchema, {
        payloadVariant: {
          case: "telemetry",
          value: data,
        },
      }),
    );
  };

  return (
    <DynamicForm<TelemetryValidation>
      onSubmit={onSubmit}
      defaultValues={moduleConfig.telemetry}
      fieldGroups={[
        {
          label: "Pengaturan Telemetri",
          description: "Pengaturan untuk modul telemetri",
          fields: [
            {
              type: "number",
              name: "deviceUpdateInterval",
              label: "Interval Permintaan",
              description: "Interval untuk mengambil data telemetri",
              properties: {
                suffix: "Detik",
              },
            },
            {
              type: "number",
              name: "environmentUpdateInterval",
              label: "Interval Pembaruan",
              description: "Seberapa sering mengirim metrik melalui mesh",
              properties: {
                suffix: "Detik",
              },
            },
            {
              type: "toggle",
              name: "environmentMeasurementEnabled",
              label: "Modul Diaktifkan",
              description: "Aktifkan telemetri lingkungan",
            },
            {
              type: "toggle",
              name: "environmentScreenEnabled",
              label: "Tampil di Layar",
              description: "Tampilkan modul telemetri pada OLED",
            },
            {
              type: "toggle",
              name: "environmentDisplayFahrenheit",
              label: "Tampilkan Fahrenheit",
              description: "Tampilkan suhu dalam Fahrenheit",
            },
            {
              type: "toggle",
              name: "airQualityEnabled",
              label: "Telemetri Kualitas Udara Diaktifkan",
              description: "Aktifkan telemetri kualitas udara",
            },
            {
              type: "number",
              name: "airQualityInterval",
              label: "Interval Pembaruan Kualitas Udara",
              description: "Seberapa sering mengirim data kualitas udara melalui mesh",
            },
            {
              type: "toggle",
              name: "powerMeasurementEnabled",
              label: "Telemetri Daya Diaktifkan",
              description: "Aktifkan telemetri pengukuran daya",
            },
            {
              type: "number",
              name: "powerUpdateInterval",
              label: "Interval Pembaruan Daya",
              description: "Seberapa sering mengirim data daya melalui mesh",
            },
            {
              type: "toggle",
              name: "powerScreenEnabled",
              label: "Layar Daya Diaktifkan",
              description: "Aktifkan layar telemetri daya",
            },
          ],
        },
      ]}
    />
  );
};
