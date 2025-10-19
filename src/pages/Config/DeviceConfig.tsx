import { Bluetooth } from "@components/PageComponents/Config/Bluetooth.tsx";
import { Device } from "../../components/PageComponents/Config/Device/index.tsx";
import { Display } from "@components/PageComponents/Config/Display.tsx";
import { LoRa } from "@components/PageComponents/Config/LoRa.tsx";
import { Network } from "@components/PageComponents/Config/Network.tsx";
import { Position } from "@components/PageComponents/Config/Position.tsx";
import { Power } from "@components/PageComponents/Config/Power.tsx";
import { Security } from "../../components/PageComponents/Config/Security/Security.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@components/UI/Tabs.tsx";

export const DeviceConfig = () => {
  const tabs = [
    {
      label: "Perangkat",
      element: Device,
      count: 0,
    },
    {
      label: "Posisi",
      element: Position,
    },
    {
      label: "Daya",
      element: Power,
    },
    {
      label: "Jaringan",
      element: Network,
      // disabled: !metadata.get(0)?.hasWifi,
    },
    {
      label: "Layar",
      element: Display,
    },
    {
      label: "LoRa",
      element: LoRa,
    },
    {
      label: "Bluetooth",
      element: Bluetooth,
    },
    {
      label: "Keamanan",
      element: Security,
    },
  ];

  return (
    <Tabs defaultValue={tabs[0]?.label ?? "Perangkat"}>
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
