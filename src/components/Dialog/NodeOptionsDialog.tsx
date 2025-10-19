import { toast } from "../../core/hooks/useToast.ts";
import { useAppStore } from "../../core/stores/appStore.ts";
import { useDevice } from "../../core/stores/deviceStore.ts";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../UI/Dialog.tsx";
import type { Protobuf } from "@meshtastic/core";
import { numberToHexUnpadded } from "@noble/curves/abstract/utils";
import { TrashIcon } from "lucide-react";

import { Button } from "../UI/Button.tsx";

export interface NodeOptionsDialogProps {
  node: Protobuf.Mesh.NodeInfo | undefined;
  open: boolean;
  onOpenChange: () => void;
}

export const NodeOptionsDialog = ({
  node,
  open,
  onOpenChange,
}: NodeOptionsDialogProps) => {
  const { setDialogOpen, connection, setActivePage } = useDevice();
  const {
    setNodeNumToBeRemoved,
    setNodeNumDetails,
    setChatType,
    setActiveChat,
  } = useAppStore();
  const longName = node?.user?.longName ??
    (node ? `!${numberToHexUnpadded(node?.num)}` : "Tidak diketahui");
  const shortName = node?.user?.shortName ??
    (node ? `${numberToHexUnpadded(node?.num).substring(0, 4)}` : "TDKT");

  function handleDirectMessage() {
    if (!node) return;
    setChatType("direct");
    setActiveChat(node.num);
    setActivePage("messages");
  }

  function handleRequestPosition() {
    if (!node) return;
    toast({
      title: "Meminta posisi, harap tunggu...",
    });
    connection?.requestPosition(node.num).then(() =>
      toast({
        title: "Permintaan posisi dikirim.",
      })
    );
    onOpenChange();
  }

  function handleTraceroute() {
    if (!node) return;
    toast({
      title: "Mengirim traceroute, harap tunggu...",
    });
    connection?.traceRoute(node.num).then(() =>
      toast({
        title: "Traceroute dikirim.",
      })
    );
    onOpenChange();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose />
        <DialogHeader>
          <DialogTitle>{`${longName} (${shortName})`}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-1">
          <div>
            <Button onClick={handleDirectMessage}>Pesan Langsung</Button>
          </div>
          <div>
            <Button onClick={handleRequestPosition}>Minta Posisi</Button>
          </div>
          <div>
            <Button onClick={handleTraceroute}>Lacak Rute</Button>
          </div>
          <div>
            <Button
              key="remove"
              variant="destructive"
              onClick={() => {
                setNodeNumToBeRemoved(node.num);
                setDialogOpen("nodeRemoval", true);
              }}
            >
              <TrashIcon />
              Remove
            </Button>
          </div>
          <div>
            <Button
              onClick={() => {
                setNodeNumDetails(node.num);
                setDialogOpen("nodeDetails", true);
              }}
            >
              Detail Lainnya
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
