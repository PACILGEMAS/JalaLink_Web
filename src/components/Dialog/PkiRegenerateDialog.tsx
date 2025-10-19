import { Button } from "@components/UI/Button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/UI/Dialog.tsx";

export interface PkiRegenerateDialogProps {
  open: boolean;
  onOpenChange: () => void;
  onSubmit: () => void;
}

export const PkiRegenerateDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: PkiRegenerateDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose />
        <DialogHeader>
          <DialogTitle>Buat ulang pasangan kunci?</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin membuat ulang pasangan kunci?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={() => onSubmit()}>
            Buat ulang
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
