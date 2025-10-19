import { AmbientLighting } from "@components/PageComponents/ModuleConfig/AmbientLighting.tsx";
import { DetectionSensor } from "@components/PageComponents/ModuleConfig/DetectionSensor.tsx";
import { NeighborInfo } from "@components/PageComponents/ModuleConfig/NeighborInfo.tsx";
import { Audio } from "@components/PageComponents/ModuleConfig/Audio.tsx";
import { CannedMessage } from "@components/PageComponents/ModuleConfig/CannedMessage.tsx";
import { ExternalNotification } from "@components/PageComponents/ModuleConfig/ExternalNotification.tsx";
import { MQTT } from "@components/PageComponents/ModuleConfig/MQTT.tsx";
import { Paxcounter } from "@components/PageComponents/ModuleConfig/Paxcounter.tsx";
import { RangeTest } from "@components/PageComponents/ModuleConfig/RangeTest.tsx";
import { Serial } from "@components/PageComponents/ModuleConfig/Serial.tsx";
import { StoreForward } from "@components/PageComponents/ModuleConfig/StoreForward.tsx";
import { Telemetry } from "@components/PageComponents/ModuleConfig/Telemetry.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@components/UI/Tabs.tsx";

export const ModuleConfig = () => {
  const tabs = [
    {
      label: "MQTT",
      element: MQTT,
    },
    {
      label: "Serial",
      element: Serial,
    },
    {
      label: "Notifikasi Eksternal",
      element: ExternalNotification,
    },
    {
      label: "Simpan & Teruskan",
      element: StoreForward,
    },
    {
      label: "Uji Jarak",
      element: RangeTest,
    },
    {
      label: "Telemetri",
      element: Telemetry,
    },
    {
      label: "Pesan Siap Pakai",
      element: CannedMessage,
    },
    {
      label: "Audio",
      element: Audio,
    },
    {
      label: "Info Tetangga",
      element: NeighborInfo,
    },
    {
      label: "Pencahayaan Sekitar",
      element: AmbientLighting,
    },
    {
      label: "Sensor Deteksi",
      element: DetectionSensor,
    },
    {
      label: "Paxcounter",
      element: Paxcounter,
    },
  ];

  return (
    <Tabs defaultValue={tabs[0]?.label ?? "MQTT"}>
      <TabsList className="dark:bg-slate-800">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.label}
            value={tab.label}
            className="dark:text-white"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.label} value={tab.label}>
          <tab.element />
        </TabsContent>
      ))}
    </Tabs>
  );
};
