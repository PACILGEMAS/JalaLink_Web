import type { LoRaValidation } from "@app/validation/config/lora.tsx";
import { create } from "@bufbuild/protobuf";
import { DynamicForm } from "@components/Form/DynamicForm.tsx";
import { useDevice } from "@core/stores/deviceStore.ts";
import { Protobuf } from "@meshtastic/core";

export const LoRa = () => {
  const { config, setWorkingConfig } = useDevice();

  const onSubmit = (data: LoRaValidation) => {
    setWorkingConfig(
      create(Protobuf.Config.ConfigSchema, {
        payloadVariant: {
          case: "lora",
          value: data,
        },
      }),
    );
  };

  return (
    <DynamicForm<LoRaValidation>
      onSubmit={onSubmit}
      defaultValues={config.lora}
      fieldGroups={[
        {
          label: "Pengaturan Mesh",
          description: "Pengaturan untuk mesh LoRa",
          fields: [
            {
              type: "select",
              name: "region",
              label: "Wilayah",
              description: "Menetapkan wilayah untuk node Anda",
              properties: {
                enumValue: Protobuf.Config.Config_LoRaConfig_RegionCode,
              },
            },
            {
              type: "select",
              name: "hopLimit",
              label: "Batas Lompatan",
              description: "Jumlah lompatan maksimum",
              properties: {
                enumValue: { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7 },
              },
            },
            {
              type: "number",
              name: "channelNum",
              label: "Slot Frekuensi",
              description: "Nomor kanal frekuensi LoRa",
            },
            {
              type: "toggle",
              name: "ignoreMqtt",
              label: "Abaikan MQTT",
              description: "Jangan teruskan pesan MQTT melalui mesh",
            },
            {
              type: "toggle",
              name: "configOkToMqtt",
              label: "OK ke MQTT",
              description:
                "Jika diaktifkan, konfigurasi ini menandakan pengguna menyetujui paket diunggah ke MQTT. Jika dinonaktifkan, node lain diminta untuk tidak meneruskan paket ke MQTT",
            },
          ],
        },
        {
          label: "Pengaturan Gelombang",
          description: "Pengaturan untuk gelombang LoRa",
          fields: [
            {
              type: "toggle",
              name: "usePreset",
              label: "Gunakan Prasetel",
              description: "Gunakan salah satu prasetel modem bawaan",
            },
            {
              type: "select",
              name: "modemPreset",
              label: "Prasetel Modem",
              description: "Prasetel modem yang digunakan",
              disabledBy: [
                {
                  fieldName: "usePreset",
                },
              ],
              properties: {
                enumValue: Protobuf.Config.Config_LoRaConfig_ModemPreset,
                formatEnumName: true,
              },
            },
            {
              type: "number",
              name: "bandwidth",
              label: "Lebar Pita",
              description: "Lebar pita kanal dalam MHz",
              disabledBy: [
                {
                  fieldName: "usePreset",
                  invert: true,
                },
              ],
              properties: {
                suffix: "MHz",
              },
            },
            {
              type: "number",
              name: "spreadFactor",
              label: "Faktor Penyebaran",
              description: "Menunjukkan jumlah chirp per simbol",

              disabledBy: [
                {
                  fieldName: "usePreset",
                  invert: true,
                },
              ],
              properties: {
                suffix: "CPS",
              },
            },
            {
              type: "number",
              name: "codingRate",
              label: "Laju Pengkodean",
              description: "Penyebut laju pengkodean",
              disabledBy: [
                {
                  fieldName: "usePreset",
                  invert: true,
                },
              ],
            },
          ],
        },
        {
          label: "Pengaturan Radio",
          description: "Pengaturan untuk radio LoRa",
          fields: [
            {
              type: "toggle",
              name: "txEnabled",
              label: "Transmit Diaktifkan",
              description: "Aktifkan/nonaktifkan transmisi (TX) dari radio LoRa",
            },
            {
              type: "number",
              name: "txPower",
              label: "Daya Transmisi",
              description: "Daya transmisi maksimum",
              properties: {
                suffix: "dBm",
              },
            },
            {
              type: "toggle",
              name: "overrideDutyCycle",
              label: "Override Siklus Tugas",
              description: "Override siklus tugas",
            },
            {
              type: "number",
              name: "frequencyOffset",
              label: "Ofset Frekuensi",
              description:
                "Ofset frekuensi untuk mengoreksi kesalahan kalibrasi kristal",
              properties: {
                suffix: "Hz",
              },
            },
            {
              type: "toggle",
              name: "sx126xRxBoostedGain",
              label: "Gain RX Ditingkatkan",
              description: "Gain RX yang ditingkatkan",
            },
            {
              type: "number",
              name: "overrideFrequency",
              label: "Override Frekuensi",
              description: "Override frekuensi",
              properties: {
                suffix: "MHz",
                step: 0.001,
              },
            },
          ],
        },
      ]}
    />
  );
};
