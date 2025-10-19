import { useAppStore } from "@core/stores/appStore.ts";
import { useDevice } from "@core/stores/deviceStore.ts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/UI/Accordion.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/UI/Dialog.tsx";
import { Protobuf } from "@meshtastic/core";
import { numberToHexUnpadded } from "@noble/curves/abstract/utils";
import { DeviceImage } from "@components/generic/DeviceImage.tsx";
import { TimeAgo } from "@components/generic/TimeAgo.tsx";
import { Uptime } from "@components/generic/Uptime.tsx";

export interface NodeDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NodeDetailsDialog = ({
  open,
  onOpenChange,
}: NodeDetailsDialogProps) => {
  const { nodes } = useDevice();
  const { nodeNumDetails } = useAppStore();

  const device = nodes.get(nodeNumDetails);

  if (!device) return null;

  const deviceMetricsMap = [
    {
      key: "airUtilTx",
      label: "Utilisasi TX udara",
      value: device.deviceMetrics?.airUtilTx,
      format: (val: number) => `${val.toFixed(2)}%`,
    },
    {
      key: "channelUtilization",
      label: "Utilisasi kanal",
      value: device.deviceMetrics?.channelUtilization,
      format: (val: number) => `${val.toFixed(2)}%`,
    },
    {
      key: "batteryLevel",
      label: "Tingkat baterai",
      value: device.deviceMetrics?.batteryLevel,
      format: (val: number) => `${val.toFixed(2)}%`,
    },
    {
      key: "voltage",
      label: "Tegangan",
      value: device.deviceMetrics?.voltage,
      format: (val: number) => `${val.toFixed(2)}V`,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent >
        <DialogClose />
        <DialogHeader>
          <DialogTitle>
            Detail Nelayan untuk {device.user?.longName ?? "Tidak diketahui"} (
            {device.user?.shortName ?? "TDKT"})
          </DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <div className="w-full">
            <div className="flex flex-col">
              <DeviceImage
                className="w-32 h-32 mx-auto rounded-lg border-4 border-slate-200 dark:border-slate-800"
                deviceType={
                  Protobuf.Mesh.HardwareModel[device.user?.hwModel ?? 0]
                }
              />
              <div className="bg-slate-100 text-slate-900 dark:text-slate-100 dark:bg-slate-800 p-3 rounded-lg mt-3">
                <p className="text-lg font-semibold">Detail:</p>
                <p>
                  Perangkat keras:{" "}
                  {Protobuf.Mesh.HardwareModel[device.user?.hwModel ?? 0]}
                </p>
                <p>Nomor Nelayan: {device.num}</p>
                <p>Hex Nelayan: !{numberToHexUnpadded(device.num)}</p>
                <p>
                  Peran:{" "}
                  {
                    Protobuf.Config.Config_DeviceConfig_Role[
                    device.user?.role ?? 0
                    ]
                  }
                </p>
                <p>
                  Terakhir terdengar:{" "}
                  {device.lastHeard === 0 ? "Tidak pernah" : <TimeAgo timestamp={device.lastHeard * 1000} />}
                </p>
              </div>

              {device.position && (
                <div className="text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg mt-3">
                  <p className="text-lg font-semibold">Posisi:</p>
                  {device.position.latitudeI && device.position.longitudeI && (
                    <p>
                      Koordinat:{" "}
                      <a
                        className="text-blue-500 dark:text-blue-400"
                        href={`https://www.openstreetmap.org/?mlat=${device.position.latitudeI / 1e7
                          }&mlon=${device.position.longitudeI / 1e7
                          }&layers=N`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {device.position.latitudeI / 1e7},{" "}
                        {device.position.longitudeI / 1e7}
                      </a>
                    </p>
                  )}
                  {device.position.altitude && (
                    <p>Ketinggian: {device.position.altitude}m</p>
                  )}
                </div>
              )}

              {device.deviceMetrics && (
                <div className="text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg mt-3">
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    Metrik perangkat:
                  </p>
                  {deviceMetricsMap.map(
                    (metric) =>
                      metric.value !== undefined && (
                        <p key={metric.key}>
                          {metric.label}: {metric.format(metric.value)}
                        </p>
                      )
                  )}
                  {device.deviceMetrics.uptimeSeconds && (
                    <p>
                      Waktu berjalan:{" "}
                      <Uptime seconds={device.deviceMetrics.uptimeSeconds} />
                    </p>
                  )}
                </div>
              )}

            </div>

            <div className="text-slate-900 dark:text-slate-100 w-full max-w-[464px] bg-slate-100 dark:bg-slate-800 p-3 rounded-lg mt-3">
              <Accordion className="AccordionRoot" type="single" collapsible>
                <AccordionItem className="AccordionItem" value="item-1">
                  <AccordionTrigger>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                      Semua metrik mentah:
                    </p>
                  </AccordionTrigger>
                  <AccordionContent className="overflow-x-scroll">
                    <pre className="text-xs w-full">
                      {JSON.stringify(device, null, 2)}
                    </pre>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
