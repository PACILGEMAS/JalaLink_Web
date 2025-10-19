import type { ChannelValidation } from "@app/validation/channel.tsx";
import { create } from "@bufbuild/protobuf";
import { DynamicForm } from "@components/Form/DynamicForm.tsx";
import { useToast } from "@core/hooks/useToast.ts";
import { useDevice } from "@core/stores/deviceStore.ts";
import { Protobuf } from "@meshtastic/core";
import { fromByteArray, toByteArray } from "base64-js";
import cryptoRandomString from "crypto-random-string";
import { useState } from "react";
import { PkiRegenerateDialog } from "../Dialog/PkiRegenerateDialog.tsx";

export interface SettingsPanelProps {
  channel: Protobuf.Channel.Channel;
}

export const Channel = ({ channel }: SettingsPanelProps) => {
  const { config, connection, addChannel } = useDevice();
  const { toast } = useToast();

  const [pass, setPass] = useState<string>(
    fromByteArray(channel?.settings?.psk ?? new Uint8Array(0)),
  );
  const [bitCount, setBits] = useState<number>(
    channel?.settings?.psk.length ?? 16,
  );
  const [validationText, setValidationText] = useState<string>();
  const [preSharedDialogOpen, setPreSharedDialogOpen] = useState<boolean>(
    false,
  );

  const onSubmit = (data: ChannelValidation) => {
    const channel = create(Protobuf.Channel.ChannelSchema, {
      ...data,
      settings: {
        ...data.settings,
        psk: toByteArray(pass),
        moduleSettings: {...data.settings.moduleSettings,
          positionPrecision: data.settings.moduleSettings.positionPrecision,
        },
      },
    });
    connection?.setChannel(channel).then(() => {
      toast({
        title: `Kanal disimpan: ${channel.settings?.name}`,
      });
      addChannel(channel);
    });
  };

  const preSharedKeyRegenerate = () => {
    setPass(
      btoa(
        cryptoRandomString({
          length: bitCount ?? 0,
          type: "alphanumeric",
        }),
      ),
    );
    setValidationText(undefined);
    setPreSharedDialogOpen(false);
  };

  const preSharedClickEvent = () => {
    setPreSharedDialogOpen(true);
  };

  const validatePass = (input: string, count: number) => {
    if (input.length % 4 !== 0 || toByteArray(input).length !== count) {
      setValidationText(`Masukkan PSK ${count * 8} bit yang valid.`);
    } else {
      setValidationText(undefined);
    }
  };

  const inputChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const psk = e.currentTarget?.value;
    setPass(psk);
    validatePass(psk, bitCount);
  };

  const selectChangeEvent = (e: string) => {
    const count = Number.parseInt(e);
    setBits(count);
    validatePass(pass, count);
  };

  return (
    <>
      <DynamicForm<ChannelValidation>
        onSubmit={onSubmit}
        submitType="onSubmit"
        hasSubmitButton
        defaultValues={{
          ...channel,
          ...{
            settings: {
              ...channel?.settings,
              psk: pass,
              moduleSettings: {...channel?.settings?.moduleSettings,
                positionPrecision: channel?.settings?.moduleSettings?.positionPrecision === undefined ? 10 : channel?.settings?.moduleSettings?.positionPrecision,
              }
            },
          },
        }}
        fieldGroups={[
          {
            label: "Pengaturan Kanal",
            description: "Pengaturan kripto, MQTT, dan lainnya",
            fields: [
              {
                type: "select",
                name: "role",
                label: "Peran",
                disabled: channel.index === 0,
                description:
                  "Telemetri perangkat dikirim melalui PRIMARY. Hanya satu PRIMARY yang diperbolehkan",
                properties: {
                  enumValue: channel.index === 0
                    ? { PRIMARY: 1 }
                    : { DISABLED: 0, SECONDARY: 2 },
                },
              },
              {
                type: "passwordGenerator",
                name: "settings.psk",
                id: 'channel-psk',
                label: "Kunci Pra-bagi",
                description:
                  "Panjang PSK yang didukung: 256-bit, 128-bit, 8-bit, Kosong (0-bit)",
                validationText: validationText,
                devicePSKBitCount: bitCount ?? 0,
                inputChange: inputChangeEvent,
                selectChange: selectChangeEvent,
                actionButtons: [
                  {
                    text: "Buat",
                    variant: "success",
                    onClick: preSharedClickEvent,
                  },
                ],
                hide: true,
                properties: {
                  value: pass,
                },
              },
              {
                type: "text",
                name: "settings.name",
                label: "Nama",
                description:
                  "Nama unik untuk kanal <12 byte, biarkan kosong untuk bawaan",
              },
              {
                type: "toggle",
                name: "settings.uplinkEnabled",
                label: "Uplink Diaktifkan",
                description: "Kirim pesan dari mesh lokal ke MQTT",
              },
              {
                type: "toggle",
                name: "settings.downlinkEnabled",
                label: "Downlink Diaktifkan",
                description: "Kirim pesan dari MQTT ke mesh lokal",
              },
              {
                type: "select",
                name: "settings.moduleSettings.positionPrecision",
                label: "Lokasi",
                description:
                  "Tingkat ketelitian lokasi yang dibagikan ke kanal. Dapat dinonaktifkan.",
                properties: {
                  enumValue: config.display?.units === 0
                    ? {
                      "Jangan bagikan lokasi": 0,
                      "Dalam 23 kilometer": 10,
                      "Dalam 12 kilometer": 11,
                      "Dalam 5,8 kilometer": 12,
                      "Dalam 2,9 kilometer": 13,
                      "Dalam 1,5 kilometer": 14,
                      "Dalam 700 meter": 15,
                      "Dalam 350 meter": 16,
                      "Dalam 200 meter": 17,
                      "Dalam 90 meter": 18,
                      "Dalam 50 meter": 19,
                      "Lokasi Presisi": 32,
                    }
                    : {
                      "Jangan bagikan lokasi": 0,
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
                      "Lokasi Presisi": 32,
                    },
                },
              },
            ],
          },
        ]}
      />
      <PkiRegenerateDialog
        open={preSharedDialogOpen}
        onOpenChange={() => setPreSharedDialogOpen(false)}
        onSubmit={() => preSharedKeyRegenerate()}
      />
    </>
  );
};
