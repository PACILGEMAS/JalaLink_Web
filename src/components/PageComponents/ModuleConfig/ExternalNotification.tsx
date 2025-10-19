import type { ExternalNotificationValidation } from "@app/validation/moduleConfig/externalNotification.tsx";
import { create } from "@bufbuild/protobuf";
import { DynamicForm } from "@components/Form/DynamicForm.tsx";
import { useDevice } from "@core/stores/deviceStore.ts";
import { Protobuf } from "@meshtastic/core";

export const ExternalNotification = () => {
  const { moduleConfig, setWorkingModuleConfig } = useDevice();

  const onSubmit = (data: ExternalNotificationValidation) => {
    setWorkingModuleConfig(
      create(Protobuf.ModuleConfig.ModuleConfigSchema, {
        payloadVariant: {
          case: "externalNotification",
          value: data,
        },
      }),
    );
  };

  return (
    <DynamicForm<ExternalNotificationValidation>
      onSubmit={onSubmit}
      defaultValues={moduleConfig.externalNotification}
      fieldGroups={[
        {
          label: "Pengaturan Notifikasi Eksternal",
          description: "Konfigurasikan modul notifikasi eksternal",
          fields: [
            {
              type: "toggle",
              name: "enabled",
              label: "Modul Diaktifkan",
              description: "Aktifkan notifikasi eksternal",
            },
            {
              type: "number",
              name: "outputMs",
              label: "Output (ms)",
              description: "Output dalam milidetik",

              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
              properties: {
                suffix: "ms",
              },
            },
            {
              type: "number",
              name: "output",
              label: "Output",
              description: "Nilai output",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "number",
              name: "outputVibra",
              label: "Output Getar",
              description: "Nilai output getar",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "number",
              name: "outputBuzzer",
              label: "Output Buzzer",
              description: "Nilai output buzzer",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "toggle",
              name: "active",
              label: "Aktif",
              description: "Status aktif",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "toggle",
              name: "alertMessage",
              label: "Pesan Peringatan",
              description: "Pesan peringatan",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "toggle",
              name: "alertMessageVibra",
              label: "Pesan Peringatan (Getar)",
              description: "Pesan peringatan dengan getaran",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "toggle",
              name: "alertMessageBuzzer",
              label: "Pesan Peringatan (Buzzer)",
              description: "Pesan peringatan dengan buzzer",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "toggle",
              name: "alertBell",
              label: "Bel Peringatan",
              description:
                "Apakah peringatan harus dipicu ketika menerima bel masuk?",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "toggle",
              name: "alertBellVibra",
              label: "Bel Peringatan (Getar)",
              description: "Bel peringatan dengan getaran",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "toggle",
              name: "alertBellBuzzer",
              label: "Bel Peringatan (Buzzer)",
              description: "Bel peringatan dengan buzzer",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "toggle",
              name: "usePwm",
              label: "Gunakan PWM",
              description: "Gunakan PWM",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "number",
              name: "nagTimeout",
              label: "Batas Waktu Pengingat",
              description: "Durasi pengingat",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "toggle",
              name: "useI2sAsBuzzer",
              label: "Gunakan pin I2S sebagai Buzzer",
              description: "Gunakan pin I2S sebagai output buzzer",
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
