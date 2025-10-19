import {
  type FlagName,
  usePositionFlags,
} from "../../../core/hooks/usePositionFlags.ts";
import type { PositionValidation } from "@app/validation/config/position.tsx";
import { create } from "@bufbuild/protobuf";
import { DynamicForm } from "@components/Form/DynamicForm.tsx";
import { useDevice } from "@core/stores/deviceStore.ts";
import { Protobuf } from "@meshtastic/core";
import { useCallback } from "react";

export const Position = () => {
  const { config, setWorkingConfig } = useDevice();
  const { flagsValue, activeFlags, toggleFlag, getAllFlags } = usePositionFlags(
    config?.position.positionFlags ?? 0,
  );

  const onSubmit = (data: PositionValidation) => {
    return setWorkingConfig(
      create(Protobuf.Config.ConfigSchema, {
        payloadVariant: {
          case: "position",
          value: { ...data, positionFlags: flagsValue },
        },
      }),
    );
  };

  const onPositonFlagChange = useCallback(
    (name: string) => {
      return toggleFlag(name as FlagName);
    },
    [toggleFlag],
  );

  return (
    <DynamicForm<PositionValidation>
      onSubmit={(data) => {
        data.positionFlags = flagsValue;
        return onSubmit(data);
      }}
      defaultValues={config.position}
      fieldGroups={[
        {
          label: "Pengaturan Posisi",
          description: "Pengaturan untuk modul posisi",
          fields: [
            {
              type: "toggle",
              name: "positionBroadcastSmartEnabled",
              label: "Aktifkan Posisi Cerdas",
              description:
                "Hanya kirim posisi ketika terdapat perubahan lokasi yang signifikan",
            },
            {
              type: "select",
              name: "gpsMode",
              label: "Mode GPS",
              description:
                "Atur apakah GPS perangkat Diaktifkan, Dinonaktifkan, atau Tidak Ada",
              properties: {
                enumValue: Protobuf.Config.Config_PositionConfig_GpsMode,
              },
            },
            {
              type: "toggle",
              name: "fixedPosition",
              label: "Posisi Tetap",
              description:
                "Jangan laporkan posisi GPS, gunakan posisi yang ditentukan manual",
            },
            {
              type: "multiSelect",
              name: "positionFlags",
              value: activeFlags,
              isChecked: (name: string) =>
                activeFlags.includes(name as FlagName),
              onValueChange: onPositonFlagChange,
              label: "Flag Posisi",
              placeholder: "Pilih flag posisi...",
              description:
                "Bidang opsional yang disertakan saat menyusun pesan posisi. Semakin banyak bidang dipilih, semakin besar pesan sehingga durasi airtime lebih panjang dan risiko kehilangan paket meningkat.",
              properties: {
                enumValue: getAllFlags(),
              },
            },
            {
              type: "number",
              name: "rxGpio",
              label: "Pin Terima",
              description: "Override pin RX modul GPS",
            },
            {
              type: "number",
              name: "txGpio",
              label: "Pin Transmisi",
              description: "Override pin TX modul GPS",
            },
            {
              type: "number",
              name: "gpsEnGpio",
              label: "Pin Aktif",
              description: "Override pin enable modul GPS",
            },
          ],
        },
        {
          label: "Interval",
          description: "Seberapa sering mengirim pembaruan posisi",
          fields: [
            {
              type: "number",
              name: "positionBroadcastSecs",
              label: "Interval Siaran",
              description: "Seberapa sering posisi Anda dikirim melalui mesh",
              properties: {
                suffix: "Detik",
              },
            },
            {
              type: "number",
              name: "gpsUpdateInterval",
              label: "Interval Pembaruan GPS",
              description: "Seberapa sering perbaikan GPS diambil",
              properties: {
                suffix: "Detik",
              },
            },
            {
              type: "number",
              name: "broadcastSmartMinimumDistance",
              label: "Jarak Minimum Posisi Cerdas",
              description:
                "Jarak minimum (dalam meter) yang harus ditempuh sebelum pembaruan posisi dikirim",
              disabledBy: [
                {
                  fieldName: "positionBroadcastSmartEnabled",
                },
              ],
            },
            {
              type: "number",
              name: "broadcastSmartMinimumIntervalSecs",
              label: "Interval Minimum Posisi Cerdas",
              description:
                "Interval minimum (dalam detik) yang harus berlalu sebelum pembaruan posisi dikirim",
              disabledBy: [
                {
                  fieldName: "positionBroadcastSmartEnabled",
                },
              ],
            },
          ],
        },
      ]}
    />
  );
};
