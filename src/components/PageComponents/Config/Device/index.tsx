import type { DeviceValidation } from "@app/validation/config/device.ts";
import { create } from "@bufbuild/protobuf";
import { DynamicForm } from "@components/Form/DynamicForm.tsx";
import { useDevice } from "@core/stores/deviceStore.ts";
import { Protobuf } from "@meshtastic/core";
import { useUnsafeRolesDialog } from "@components/Dialog/UnsafeRolesDialog/useUnsafeRolesDialog.ts";

export const Device = () => {
  const { config, setWorkingConfig } = useDevice();
  const { validateRoleSelection } = useUnsafeRolesDialog();

  const onSubmit = (data: DeviceValidation) => {
    setWorkingConfig(
      create(Protobuf.Config.ConfigSchema, {
        payloadVariant: {
          case: "device",
          value: data,
        },
      })
    );
  };
  return (
    <DynamicForm<DeviceValidation>
      onSubmit={onSubmit}
      defaultValues={config.device}
      fieldGroups={[
        {
          label: "Pengaturan Perangkat",
          description: "Pengaturan untuk perangkat",
          fields: [
            {
              type: "select",
              name: "role",
              label: "Peran",
              description: "Peran perangkat pada mesh",
              validate: validateRoleSelection,
              properties: {
                enumValue: Protobuf.Config.Config_DeviceConfig_Role,
                formatEnumName: true,
              },
            },
            {
              type: "number",
              name: "buttonGpio",
              label: "Pin Tombol",
              description: "Override pin tombol",
            },
            {
              type: "number",
              name: "buzzerGpio",
              label: "Pin Buzzer",
              description: "Override pin buzzer",
            },
            {
              type: "select",
              name: "rebroadcastMode",
              label: "Mode Siar Ulang",
              description: "Cara menangani siaran ulang",
              properties: {
                enumValue: Protobuf.Config.Config_DeviceConfig_RebroadcastMode,
                formatEnumName: true,
              },
            },
            {
              type: "number",
              name: "nodeInfoBroadcastSecs",
              label: "Interval Siaran Info Node",
              description: "Seberapa sering menyiarkan info node",
              properties: {
                suffix: "Detik",
              },
            },
            {
              type: "toggle",
              name: "doubleTapAsButtonPress",
              label: "Ketuk Ganda sebagai Tekan Tombol",
              description: "Anggap ketuk ganda sebagai tombol ditekan",
            },
            {
              type: "toggle",
              name: "disableTripleClick",
              label: "Nonaktifkan Klik Tiga Kali",
              description: "Nonaktifkan klik tiga kali",
            },
            {
              type: "toggle",
              name: "ledHeartbeatDisabled",
              label: "Detak LED Dinonaktifkan",
              description: "Nonaktifkan LED berkedip bawaan",
            },
          ],
        },
      ]}
    />
  );
};
