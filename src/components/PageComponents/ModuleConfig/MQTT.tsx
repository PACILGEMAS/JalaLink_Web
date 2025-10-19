import { useDevice } from "@core/stores/deviceStore.ts";
import type { MqttValidation } from "@app/validation/moduleConfig/mqtt.tsx";
import { create } from "@bufbuild/protobuf";
import { DynamicForm } from "@components/Form/DynamicForm.tsx";
import { Protobuf } from "@meshtastic/core";

export const MQTT = () => {
  const { config, moduleConfig, setWorkingModuleConfig } = useDevice();

  const onSubmit = (data: MqttValidation) => {
    setWorkingModuleConfig(
      create(Protobuf.ModuleConfig.ModuleConfigSchema, {
        payloadVariant: {
          case: "mqtt",
          value: {
            ...data,
            mapReportSettings: create(
              Protobuf.ModuleConfig.ModuleConfig_MapReportSettingsSchema,
              data.mapReportSettings,
            ),
          },
        },
      }),
    );
  };

  return (
    <DynamicForm<MqttValidation>
      onSubmit={onSubmit}
      defaultValues={moduleConfig.mqtt}
      fieldGroups={[
        {
          label: "Pengaturan MQTT",
          description: "Pengaturan untuk modul MQTT",
          fields: [
            {
              type: "toggle",
              name: "enabled",
              label: "Diaktifkan",
              description: "Aktifkan atau nonaktifkan MQTT",
            },
            {
              type: "text",
              name: "address",
              label: "Alamat Server MQTT",
              description:
                "Alamat server MQTT untuk server bawaan atau kustom",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "text",
              name: "username",
              label: "Nama Pengguna MQTT",
              description: "Nama pengguna MQTT untuk server bawaan atau kustom",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "password",
              name: "password",
              label: "Kata Sandi MQTT",
              description: "Kata sandi MQTT untuk server bawaan atau kustom",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "toggle",
              name: "encryptionEnabled",
              label: "Enkripsi Diaktifkan",
              description:
                "Aktifkan atau nonaktifkan enkripsi MQTT. Catatan: Semua pesan dikirim ke broker MQTT tanpa enkripsi jika opsi ini tidak diaktifkan, bahkan ketika kanal uplink Anda memiliki kunci enkripsi. Ini termasuk data posisi.",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "toggle",
              name: "jsonEnabled",
              label: "JSON Diaktifkan",
              description: "Apakah mengirim/menerima paket JSON di MQTT",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "toggle",
              name: "tlsEnabled",
              label: "TLS Diaktifkan",
              description: "Aktifkan atau nonaktifkan TLS",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "text",
              name: "root",
              label: "Topik Root",
              description: "Topik root MQTT untuk server bawaan atau kustom",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "toggle",
              name: "proxyToClientEnabled",
              label: "Proxy ke Klien Diaktifkan",
              description:
                "Gunakan koneksi internet klien untuk MQTT (fitur hanya aktif di aplikasi seluler)",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "toggle",
              name: "mapReportingEnabled",
              label: "Pelaporan Peta Diaktifkan",
              description: "Aktifkan atau nonaktifkan pelaporan peta",
              disabledBy: [
                {
                  fieldName: "enabled",
                },
              ],
            },
            {
              type: "number",
              name: "mapReportSettings.publishIntervalSecs",
              label: "Interval Publikasi Laporan Peta (detik)",
              description: "Interval dalam detik untuk menerbitkan laporan peta",
              properties: {
                suffix: "Detik",
              },
              disabledBy: [
                {
                  fieldName: "enabled",
                },
                {
                  fieldName: "mapReportingEnabled",
                },
              ],
            },
            {
              type: "select",
              name: "mapReportSettings.positionPrecision",
              label: "Perkiraan Lokasi",
              description:
                "Posisi yang dibagikan akan akurat dalam jarak ini",
              properties: {
                enumValue: config.display?.units === 0
                  ? {
                    "Dalam 23 km": 10,
                    "Dalam 12 km": 11,
                    "Dalam 5,8 km": 12,
                    "Dalam 2,9 km": 13,
                    "Dalam 1,5 km": 14,
                    "Dalam 700 m": 15,
                    "Dalam 350 m": 16,
                    "Dalam 200 m": 17,
                    "Dalam 90 m": 18,
                    "Dalam 50 m": 19,
                  }
                  : {
                    "Dalam 15 mil": 10,
                    "Dalam 7,3 mil": 11,
                    "Dalam 3,6 mil": 12,
                    "Dalam 1,8 mil": 13,
                    "Dalam 0,9 mil": 14,
                    "Dalam 0,5 mil": 15,
                    "Dalam 0,2 mil": 16,
                    "Dalam 600 kaki": 17,
                    "Dalam 300 kaki": 18,
                    "Dalam 150 kaki": 19,
                  },
              },
              disabledBy: [
                {
                  fieldName: "enabled",
                },
                {
                  fieldName: "mapReportingEnabled",
                },
              ],
            },
          ],
        },
      ]}
    />
  );
};
