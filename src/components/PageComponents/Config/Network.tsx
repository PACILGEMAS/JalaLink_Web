import type { NetworkValidation } from "@app/validation/config/network.tsx";
import { create } from "@bufbuild/protobuf";
import { DynamicForm } from "@components/Form/DynamicForm.tsx";
import { useDevice } from "@core/stores/deviceStore.ts";
import {
  convertIntToIpAddress,
  convertIpAddressToInt,
} from "@core/utils/ip.ts";
import { Protobuf } from "@meshtastic/core";

export const Network = () => {
  const { config, setWorkingConfig } = useDevice();

  const onSubmit = (data: NetworkValidation) => {
    setWorkingConfig(
      create(Protobuf.Config.ConfigSchema, {
        payloadVariant: {
          case: "network",
          value: {
            ...data,
            ipv4Config: create(
              Protobuf.Config.Config_NetworkConfig_IpV4ConfigSchema,
              {
                ip: convertIpAddressToInt(data.ipv4Config.ip) ?? 0,
                gateway: convertIpAddressToInt(data.ipv4Config.gateway) ?? 0,
                subnet: convertIpAddressToInt(data.ipv4Config.subnet) ?? 0,
                dns: convertIpAddressToInt(data.ipv4Config.dns) ?? 0,
              },
            ),
          },
        },
      }),
    );
  };

  return (
    <DynamicForm<NetworkValidation>
      onSubmit={onSubmit}
      defaultValues={{
        ...config.network,
        ipv4Config: {
          ip: convertIntToIpAddress(config.network?.ipv4Config?.ip ?? 0),
          gateway: convertIntToIpAddress(
            config.network?.ipv4Config?.gateway ?? 0,
          ),
          subnet: convertIntToIpAddress(
            config.network?.ipv4Config?.subnet ?? 0,
          ),
          dns: convertIntToIpAddress(config.network?.ipv4Config?.dns ?? 0),
        },
      }}
      fieldGroups={[
        {
          label: "Konfigurasi WiFi",
          description: "Konfigurasi radio WiFi",
          notes:
            "Catatan: Beberapa perangkat (ESP32) tidak dapat memakai Bluetooth dan WiFi secara bersamaan.",
          fields: [
            {
              type: "toggle",
              name: "wifiEnabled",
              label: "Diaktifkan",
              description: "Aktifkan atau nonaktifkan radio WiFi",
            },
            {
              type: "text",
              name: "wifiSsid",
              label: "SSID",
              description: "Nama jaringan",
              disabledBy: [
                {
                  fieldName: "wifiEnabled",
                },
              ],
            },
            {
              type: "password",
              name: "wifiPsk",
              label: "PSK",
              description: "Kata sandi jaringan",
              disabledBy: [
                {
                  fieldName: "wifiEnabled",
                },
              ],
            },
          ],
        },
        {
          label: "Konfigurasi Ethernet",
          description: "Konfigurasi port Ethernet",
          fields: [
            {
              type: "toggle",
              name: "ethEnabled",
              label: "Diaktifkan",
              description: "Aktifkan atau nonaktifkan port Ethernet",
            },
          ],
        },
        {
          label: "Konfigurasi IP",
          description: "Konfigurasi IP",
          fields: [
            {
              type: "select",
              name: "addressMode",
              label: "Mode Alamat",
              description: "Pilihan penetapan alamat",
              properties: {
                enumValue: Protobuf.Config.Config_NetworkConfig_AddressMode,
              },
            },
            {
              type: "text",
              name: "ipv4Config.ip",
              label: "IP",
              description: "Alamat IP",
              disabledBy: [
                {
                  fieldName: "addressMode",
                  selector:
                    Protobuf.Config.Config_NetworkConfig_AddressMode.DHCP,
                },
              ],
            },
            {
              type: "text",
              name: "ipv4Config.gateway",
              label: "Gateway",
              description: "Gateway utama",
              disabledBy: [
                {
                  fieldName: "addressMode",
                  selector:
                    Protobuf.Config.Config_NetworkConfig_AddressMode.DHCP,
                },
              ],
            },
            {
              type: "text",
              name: "ipv4Config.subnet",
              label: "Subnet",
              description: "Masker subnet",
              disabledBy: [
                {
                  fieldName: "addressMode",
                  selector:
                    Protobuf.Config.Config_NetworkConfig_AddressMode.DHCP,
                },
              ],
            },
            {
              type: "text",
              name: "ipv4Config.dns",
              label: "DNS",
              description: "Server DNS",
              disabledBy: [
                {
                  fieldName: "addressMode",
                  selector:
                    Protobuf.Config.Config_NetworkConfig_AddressMode.DHCP,
                },
              ],
            },
          ],
        },
        {
          label: "Konfigurasi NTP",
          description: "Konfigurasi NTP",
          fields: [
            {
              type: "text",
              name: "ntpServer",
              label: "NTP Server",
            },
          ],
        },
        {
          label: "Konfigurasi Rsyslog",
          description: "Konfigurasi Rsyslog",
          fields: [
            {
              type: "text",
              name: "rsyslogServer",
              label: "Rsyslog Server",
            },
          ],
        },
      ]}
    />
  );
};
