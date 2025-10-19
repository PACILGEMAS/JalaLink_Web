import type { PowerValidation } from "@app/validation/config/power.tsx";
import { create } from "@bufbuild/protobuf";
import { DynamicForm } from "@components/Form/DynamicForm.tsx";
import { useDevice } from "@core/stores/deviceStore.ts";
import { Protobuf } from "@meshtastic/core";

export const Power = () => {
  const { config, setWorkingConfig } = useDevice();

  const onSubmit = (data: PowerValidation) => {
    setWorkingConfig(
      create(Protobuf.Config.ConfigSchema, {
        payloadVariant: {
          case: "power",
          value: data,
        },
      }),
    );
  };

  return (
    <DynamicForm<PowerValidation>
      onSubmit={onSubmit}
      defaultValues={config.power}
      fieldGroups={[
        {
          label: "Konfigurasi Daya",
          description: "Pengaturan untuk modul daya",
          fields: [
            {
              type: "toggle",
              name: "isPowerSaving",
              label: "Aktifkan mode hemat daya",
              description:
                "Pilih jika menggunakan sumber arus rendah (mis. surya) untuk meminimalkan konsumsi daya.",
            },
            {
              type: "number",
              name: "onBatteryShutdownAfterSecs",
              label: "Penundaan mati saat baterai",
              description:
                "Matikan node secara otomatis setelah durasi ini ketika menggunakan baterai, 0 untuk tidak terbatas",
              properties: {
                suffix: "Detik",
              },
            },
            {
              type: "number",
              name: "adcMultiplierOverride",
              label: "Rasio Override Pengali ADC",
              description: "Digunakan untuk menyesuaikan pembacaan tegangan baterai",
              properties: {
                step: 0.0001,
              },
            },
            {
              type: "number",
              name: "waitBluetoothSecs",
              label: "Matikan Bluetooth jika tidak ada koneksi",
              description:
                "Jika perangkat tidak menerima koneksi Bluetooth, radio BLE akan dinonaktifkan setelah durasi ini",
              properties: {
                suffix: "Detik",
              },
            },
            {
              type: "number",
              name: "deviceBatteryInaAddress",
              label: "Alamat INA219",
              description: "Alamat pemantau baterai INA219",
            },
          ],
        },
        {
          label: "Pengaturan Tidur",
          description: "Pengaturan tidur untuk modul daya",
          fields: [
            {
              type: "number",
              name: "sdsSecs",
              label: "Durasi Tidur Super Dalam",
              description:
                "Lama perangkat berada pada kondisi tidur super dalam",
              properties: {
                suffix: "Detik",
              },
            },
            {
              type: "number",
              name: "lsSecs",
              label: "Durasi Tidur Ringan",
              description: "Lama perangkat berada pada kondisi tidur ringan",
              properties: {
                suffix: "Detik",
              },
            },
            {
              type: "number",
              name: "minWakeSecs",
              label: "Waktu Bangun Minimum",
              description:
                "Durasi minimum perangkat tetap menyala setelah menerima paket",
              properties: {
                suffix: "Detik",
              },
            },
          ],
        },
      ]}
    />
  );
};
