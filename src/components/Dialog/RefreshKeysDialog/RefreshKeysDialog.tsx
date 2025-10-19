import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@components/UI/Dialog.tsx";
import { Button } from "@components/UI/Button.tsx";
import { LockKeyholeOpenIcon } from "lucide-react";
import { useRefreshKeysDialog } from "./useRefreshKeysDialog.ts";

export interface RefreshKeysDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RefreshKeysDialog = ({ open, onOpenChange }: RefreshKeysDialogProps) => {

  const { handleCloseDialog, handleNodeRemove } = useRefreshKeysDialog();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-8 flex flex-col gap-2">
        <DialogClose onClick={handleCloseDialog} />
        <DialogHeader>
          <DialogTitle>Kunci tidak cocok</DialogTitle>
        </DialogHeader>
        Nelayan Anda tidak dapat mengirim pesan langsung ke nelayan ini karena kunci publik saat ini di nelayan tujuan tidak cocok dengan kunci yang tersimpan sebelumnya.
        <ul className="mt-2">
          <li className="flex place-items-center gap-2 items-start">
            <div className="p-2 bg-slate-500 rounded-lg mt-1">
              <LockKeyholeOpenIcon size={30} className="text-white justify-center" />
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <p className="font-bold mb-0.5">Terima kunci baru</p>
                <p>
                  Tindakan ini akan menghapus nelayan dari perangkat dan meminta kunci baru.
                </p>
              </div>
              <Button
                variant="default"
                onClick={handleNodeRemove}
                className=""
              >
                Minta kunci baru
              </Button>
              <Button
                variant="outline"
                onClick={handleCloseDialog}
                className=""
              >
                Tutup
              </Button>
            </div>
          </li>
        </ul>
        {/* </DialogDescription> */}
      </DialogContent>
    </Dialog >
  );
};
