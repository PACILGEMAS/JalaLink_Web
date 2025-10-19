import { useDevice } from "@core/stores/deviceStore.ts";
import type { DetectionSensorValidation } from "@app/validation/moduleConfig/detectionSensor.tsx";
import { create } from "@bufbuild/protobuf";
import { DynamicForm } from "@components/Form/DynamicForm.tsx";
import { Protobuf } from "@meshtastic/core";

export const DetectionSensor = () => {
  const { moduleConfig, setWorkingModuleConfig } = useDevice();

  const onSubmit = (data: DetectionSensorValidation) => {
    setWorkingModuleConfig(
      create(Protobuf.ModuleConfig.ModuleConfigSchema, {
        payloadVariant: {
          case: "detectionSensor",
          value: data,
        },
      }),
    );
  };

  return (
    <DynamicForm<DetectionSensorValidation>
      onSubmit={onSubmit}
      defaultValues={moduleConfig.detectionSensor}
      fieldGroups={[
        {
          label: "Pengaturan Sensor Deteksi",
          description: "Pengaturan untuk modul sensor deteksi",
          fields: [
            {
              type: "toggle",
              name: "enabled",
              label: "Diaktifkan",
              description: "Aktifkan atau nonaktifkan modul sensor deteksi",
            },
            {
              type: "number",
              name: "minimumBroadcastSecs",
              label: "Detik Siaran Minimum",
              description:
                "Interval dalam detik seberapa sering pesan dikirim ke mesh ketika perubahan status terdeteksi",
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
              type: "number",
              name: "stateBroadcastSecs",
              label: "Detik Siaran Status",
              description:
                "Interval dalam detik untuk mengirim pesan ke mesh dengan status saat ini terlepas dari perubahan",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "toggle",
              name: "sendBell",
              label: "Send Bell",
              description: "Kirim karakter bel ASCII dengan pesan peringatan",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "text",
              name: "name",
              label: "Nama Tampilan",
              description:
                "Digunakan untuk memformat pesan yang dikirim ke mesh, maksimal 20 karakter",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "number",
              name: "monitorPin",
              label: "Pin Monitor",
              description: "Pin GPIO yang diawasi untuk perubahan status",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "toggle",
              name: "detectionTriggeredHigh",
              label: "Deteksi Dipicu High",
              description:
                "Apakah deteksi status pin GPIO dipicu pada HIGH (1), jika tidak maka LOW (0)",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "toggle",
              name: "usePullup",
              label: "Gunakan Pull-up",
              description: "Gunakan atau tidak mode INPUT_PULLUP untuk pin GPIO",
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
