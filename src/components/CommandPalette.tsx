import { Avatar } from "./UI/Avatar.tsx";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@components/UI/Command.tsx";
import { useAppStore } from "@core/stores/appStore.ts";
import { useDevice, useDeviceStore } from "@core/stores/deviceStore.ts";
import { useCommandState } from "cmdk";
import {
  ArrowLeftRightIcon,
  BoxSelectIcon,
  BugIcon,
  EraserIcon,
  FactoryIcon,
  FishIcon,
  LayersIcon,
  LinkIcon,
  type LucideIcon,
  MapIcon,
  MessageSquareIcon,
  PlusIcon,
  PowerIcon,
  QrCodeIcon,
  RefreshCwIcon,
  SettingsIcon,
  SmartphoneIcon,
  TrashIcon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react";
import { useEffect } from "react";

export interface Group {
  label: string;
  icon: LucideIcon;
  commands: Command[];
}
export interface Command {
  label: string;
  icon: LucideIcon;
  action?: () => void;
  subItems?: SubItem[];
  tags?: string[];
}

export interface SubItem {
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setSelectedDevice,
    removeDevice,
    selectedDevice,
  } = useAppStore();
  const { getDevices } = useDeviceStore();
  const { setDialogOpen, setActivePage, connection } = useDevice();

  const groups: Group[] = [
    {
      label: "Buka",
      icon: LinkIcon,
      commands: [
        {
          label: "Pesan",
          icon: MessageSquareIcon,
          action() {
            setActivePage("messages");
          },
        },
        {
          label: "Peta",
          icon: MapIcon,
          action() {
            setActivePage("map");
          },
        },
        {
          label: "Data Ikan",
          icon: FishIcon,
          action() {
            setActivePage("fishData");
          },
        },
        {
          label: "Konfigurasi",
          icon: SettingsIcon,
          action() {
            setActivePage("config");
          },
          tags: ["settings"],
        },
        {
          label: "Kanal",
          icon: LayersIcon,
          action() {
            setActivePage("channels");
          },
        },
        {
          label: "Nelayan",
          icon: UsersIcon,
          action() {
            setActivePage("nodes");
          },
        },
      ],
    },
    {
      label: "Kelola",
      icon: SmartphoneIcon,
      commands: [
        {
          label: "Ganti Nelayan",
          icon: ArrowLeftRightIcon,
          subItems: getDevices().map((device) => {
            return {
              label:
                device.nodes.get(device.hardware.myNodeNum)?.user?.longName ??
                  device.hardware.myNodeNum.toString(),
              icon: (
                <Avatar
                  text={device.nodes.get(device.hardware.myNodeNum)?.user
                    ?.shortName ?? device.hardware.myNodeNum.toString()}
                />
              ),
              action() {
                setSelectedDevice(device.id);
              },
            };
          }),
        },
        {
          label: "Hubungkan Nelayan Baru",
          icon: PlusIcon,
          action() {
            setSelectedDevice(0);
          },
        },
      ],
    },
    {
      label: "Kontekstual",
      icon: BoxSelectIcon,
      commands: [
        {
          label: "Kode QR",
          icon: QrCodeIcon,
          subItems: [
            {
              label: "Pembuat",
              icon: <QrCodeIcon size={16} />,
              action() {
                setDialogOpen("QR", true);
              },
            },
            {
              label: "Impor",
              icon: <QrCodeIcon size={16} />,
              action() {
                setDialogOpen("import", true);
              },
            },
          ],
        },
        {
          label: "Putuskan Koneksi",
          icon: XCircleIcon,
          action() {
            void connection?.disconnect();
            setSelectedDevice(0);
            removeDevice(selectedDevice ?? 0);
          },
        },
        {
          label: "Jadwalkan Matikan",
          icon: PowerIcon,
          action() {
            setDialogOpen("shutdown", true);
          },
        },
        {
          label: "Jadwalkan Mulai Ulang",
          icon: RefreshCwIcon,
          action() {
            setDialogOpen("reboot", true);
          },
        },
        {
          label: "Setel Ulang Nelayan",
          icon: TrashIcon,
          action() {
            connection?.resetNodes();
          },
        },
        {
          label: "Reset Pabrik Perangkat",
          icon: FactoryIcon,
          action() {
            connection?.factoryResetDevice();
          },
        },
        {
          label: "Reset Pabrik Konfigurasi",
          icon: FactoryIcon,
          action() {
            connection?.factoryResetConfig();
          },
        },
      ],
    },
    {
      label: "Debug",
      icon: BugIcon,
      commands: [
        {
          label: "Konfigurasi Ulang",
          icon: RefreshCwIcon,
          action() {
            void connection?.configure();
          },
        },
        {
          label: "[WIP] Hapus Pesan",
          icon: EraserIcon,
          action() {
            alert("Fitur ini belum tersedia");
          },
        },
      ],
    },
  ];

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    globalThis.addEventListener("keydown", handleKeydown);
    return () => globalThis.removeEventListener("keydown", handleKeydown);
  }, [setCommandPaletteOpen]);

  return (
    <CommandDialog
      open={commandPaletteOpen}
      onOpenChange={setCommandPaletteOpen}
    >
      <CommandInput placeholder="Ketik perintah atau cari..." />
      <CommandList>
        <CommandEmpty>Tidak ada hasil.</CommandEmpty>
        {groups.map((group) => (
          <CommandGroup key={group.label} heading={group.label}>
            {group.commands.map((command) => (
              <div key={command.label}>
                <CommandItem
                  onSelect={() => {
                    command.action?.();
                    setCommandPaletteOpen(false);
                  }}
                >
                  <command.icon size={16} className="mr-2" />
                  {command.label}
                </CommandItem>
                {command.subItems?.map((subItem) => (
                  <SubItem
                    key={subItem.label}
                    label={subItem.label}
                    icon={subItem.icon}
                    action={subItem.action}
                  />
                ))}
              </div>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
};

const SubItem = ({
  label,
  icon,
  action,
}: {
  label: string;
  icon: React.ReactNode;
  action: () => void;
}) => {
  const search = useCommandState((state) => state.search);
  if (!search) return null;

  return (
    <CommandItem onSelect={action}>
      {icon}
      {label}
    </CommandItem>
  );
};
