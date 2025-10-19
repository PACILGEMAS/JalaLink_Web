import { useAppStore } from "../core/stores/appStore.ts";
import { ChannelChat } from "@components/PageComponents/Messages/ChannelChat.tsx";
import { PageLayout } from "@components/PageLayout.tsx";
import { Sidebar } from "@components/Sidebar.tsx";
import { Avatar } from "@components/UI/Avatar.tsx";
import { SidebarSection } from "@components/UI/Sidebar/SidebarSection.tsx";
import { SidebarButton } from "@components/UI/Sidebar/sidebarButton.tsx";
import { useToast } from "@core/hooks/useToast.ts";
import { useDevice } from "@core/stores/deviceStore.ts";
import { Protobuf, Types } from "@meshtastic/core";
import { numberToHexUnpadded } from "@noble/curves/abstract/utils";
import { getChannelName } from "@pages/Channels.tsx";
import { HashIcon, LockIcon, LockOpenIcon, XIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { MessageInput } from "@components/PageComponents/Messages/MessageInput.tsx";
import { cn } from "@core/utils/cn.ts";

export const MessagesPage = () => {
  const {
    channels,
    nodes,
    hardware,
    messages,
    hasNodeError,
    sosAlerts,
    setActivePage,
    removeSosAlert,
  } = useDevice();
  const { activeChat, chatType, setActiveChat, setChatType } = useAppStore();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const filteredNodes = Array.from(nodes.values()).filter((node) => {
    if (node.num === hardware.myNodeNum) return false;
    const nodeName = node.user?.longName ?? `!${numberToHexUnpadded(node.num)}`;
    return nodeName.toLowerCase().includes(searchTerm.toLowerCase());
  });
  const allChannels = Array.from(channels.values());
  const filteredChannels = allChannels.filter(
    (ch) => ch.role !== Protobuf.Channel.Channel_Role.DISABLED,
  );
  const currentChannel = channels.get(activeChat);
  const { toast } = useToast();
  const node = nodes.get(activeChat);
  const nodeHex = node?.num ? numberToHexUnpadded(node.num) : "Tidak diketahui";

  const messageDestination = chatType === "direct" ? activeChat : "broadcast";
  const messageChannel = chatType === "direct"
    ? Types.ChannelNumber.Primary
    : activeChat;

  const displayedAlerts = useMemo(
    () =>
      sosAlerts
        .slice()
        .sort((a, b) => b.receivedAt - a.receivedAt)
        .slice(0, 3),
    [sosAlerts],
  );

  return (
    <>
      <Sidebar>
        <SidebarSection label="Kanal">
          {filteredChannels.map((channel) => (
            <SidebarButton
              key={channel.index}
              label={channel.settings?.name.length
                ? channel.settings?.name
                : channel.index === 0
                  ? "Utama"
                  : `Kanal ${channel.index}`}
              active={activeChat === channel.index && chatType === "broadcast"}
              onClick={() => {
                setChatType("broadcast");
                setActiveChat(channel.index);
              }}
              element={<HashIcon size={16} className="mr-2" />}
            />
          ))}
        </SidebarSection>
        <SidebarSection label="Nelayan">
          <div className="p-4">
            <input
              type="text"
              placeholder="Cari nelayan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-sm bg-white text-slate-900"
            />
          </div>
          <div className="flex flex-col gap-4">
            {filteredNodes.map((node) => (
              <SidebarButton
                key={node.num}
                label={node.user?.longName ??
                  `!${numberToHexUnpadded(node.num)}`}
                active={activeChat === node.num && chatType === "direct"}
                onClick={() => {
                  setChatType("direct");
                  setActiveChat(node.num);
                }}
                element={
                  <Avatar
                    text={node.user?.shortName ?? node.num.toString()}
                    className={cn(hasNodeError(node.num) && "text-red-500")}
                    showError={hasNodeError(node.num)}
                    size="sm"
                  />
                }
              />
            ))}
          </div>
        </SidebarSection>
      </Sidebar>
      <div className="flex flex-col w-full h-full container mx-auto">
        <PageLayout
          className="flex flex-col h-full"
          label={`Pesan: ${chatType === "broadcast" && currentChannel
            ? getChannelName(currentChannel)
            : chatType === "direct" && nodes.get(activeChat)
              ? (nodes.get(activeChat)?.user?.longName ?? nodeHex)
              : "Memuat..."
            }`}
          actions={chatType === "direct"
            ? [
              {
                icon: nodes.get(activeChat)?.user?.publicKey.length
                  ? LockIcon
                  : LockOpenIcon,
                iconClasses: nodes.get(activeChat)?.user?.publicKey.length
                  ? "text-green-600"
                  : "text-yellow-300",
                onClick() {
                  const targetNode = nodes.get(activeChat)?.num;
                  if (targetNode === undefined) return;
                  toast({
                    title: nodes.get(activeChat)?.user?.publicKey.length
                      ? "Obrolan menggunakan enkripsi PKI."
                      : "Obrolan menggunakan enkripsi PSK.",
                  });
                },
              },
            ]
            : []}
        >
          {displayedAlerts.length > 0 && (
            <div className="mb-4 space-y-3">
              {displayedAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="relative rounded-md border border-red-500 bg-red-100 p-4 text-red-900 shadow-sm dark:border-red-700 dark:bg-red-900/30 dark:text-red-100"
                >
                  <button
                    type="button"
                    className="absolute right-2 top-2 inline-flex items-center justify-center rounded-full bg-red-500/80 p-1 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-700"
                    onClick={() => removeSosAlert(alert.id)}
                    aria-label="Tutup peringatan SOS"
                  >
                    <XIcon size={12} />
                  </button>
                  <p className="text-sm font-semibold">
                    SOS dari {alert.nodeName}
                  </p>
                  <p className="text-xs opacity-80">
                    Diterima pada {new Date(alert.receivedAt).toLocaleString()}
                  </p>
                  {alert.location
                    ? (
                      <p className="mt-2 text-sm">
                        Lokasi terakhir:{" "}
                        {alert.location.latitude.toFixed(5)},{" "}
                        {alert.location.longitude.toFixed(5)}
                      </p>
                    )
                    : (
                      <p className="mt-2 text-sm">
                        Lokasi tidak tersedia.
                      </p>
                    )}
                  <p className="mt-2 text-sm">
                    Sedang menghubungi tim penyelamat...
                  </p>
                  {alert.location && (
                    <button
                      type="button"
                      className="mt-3 inline-flex items-center rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-red-700"
                      onClick={() => setActivePage("map")}
                    >
                      Lihat di peta
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="flex-1 overflow-y-auto">
            {chatType === "broadcast" && currentChannel && (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto">
                  <ChannelChat
                    key={currentChannel.index}
                    messages={messages.broadcast.get(currentChannel.index)}
                  />
                </div>
              </div>
            )}

            {chatType === "direct" && node && (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto">
                  <ChannelChat
                    key={node.num}
                    messages={messages.direct.get(node.num)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0 p-4 w-full dark:bg-slate-900">
            <MessageInput
              to={messageDestination}
              channel={messageChannel}
              maxBytes={200}
            />
          </div>
        </PageLayout>
      </div>
    </>
  );
};

export default MessagesPage;
