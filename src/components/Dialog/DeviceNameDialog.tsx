import { useDevice } from "@core/stores/deviceStore.ts";
import { create } from "@bufbuild/protobuf";
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
import { Input } from "@components/UI/Input.tsx";
import { Label } from "@components/UI/Label.tsx";
import { Protobuf } from "@meshtastic/core";
import { useForm } from "react-hook-form";

export interface User {
  longName: string;
  shortName: string;
}

export interface DeviceNameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeviceNameDialog = ({
  open,
  onOpenChange,
}: DeviceNameDialogProps) => {
  const { hardware, nodes, connection } = useDevice();

  const myNode = nodes.get(hardware.myNodeNum);

  const { register, handleSubmit } = useForm<User>({
    values: {
      longName: myNode?.user?.longName ?? "Tidak diketahui",
      shortName: myNode?.user?.shortName ?? "Tidak diketahui",
    },
  });

  const onSubmit = handleSubmit((data) => {
    connection?.setOwner(
      create(Protobuf.Mesh.UserSchema, {
        ...myNode?.user,
        ...data,
      }),
    );
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose />
        <DialogHeader>
          <DialogTitle>Ubah Nama Perangkat</DialogTitle>
          <DialogDescription>
            Perangkat akan memulai ulang setelah konfigurasi disimpan.
          </DialogDescription>
        </DialogHeader>
        <div className="gap-4">
          <form onSubmit={onSubmit}>
            <Label>Nama Panjang</Label>
            <Input className="dark:text-slte-900" {...register("longName")} />
            <Label>Nama Pendek</Label>
            <Input
              className="dark:text-slte-900"
              maxLength={4}
              {...register("shortName")}
            />
          </form>
        </div>
        <DialogFooter>
          <Button onClick={() => onSubmit()}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
