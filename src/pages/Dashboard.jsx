import { useState, useEffect, useMemo } from "react";
import { useChannelContext } from "../hooks/channel/useChannelContext";
import { useChannelMessages } from "../hooks/message/useChannelMessages";
import { useGetChannelMessagesHistory } from "../hooks/message/useGetChannelMessagesHistory";
import { useGetProfile } from "../hooks/profile/useGetProfile";
import { normalizeMessage } from "../lib/message";
import { buildFeed } from "../lib/feed";
import { withHash } from "../lib/invite";
import { toast } from "../store/useToastStore";

import SideBar from "../components/common/sideBar";
import InfoBlock from "../components/common/infoBlock";
import InputBlock from "../components/common/inputBlock";
import MessageArea from "../components/common/messageArea";
import Header from "../components/common/header";
import NoChat from "../components/common/noChat";

import { CreateGroupModal } from "../components/popups/createGroupModal";
import { EditGroupModal } from "../components/popups/editGroupModal";
import { EditProfileModal } from "../components/popups/editProfileModal";
import EnterCodeModal from "../components/popups/enterCodeModal";
import AddMember from "../components/popups/addMember";
import DeleteMember from "../components/popups/deleteMember";
import DeleteChannel from "../components/popups/deleteChannel";

export function Dashboard() {
  // The draft is stamped with the channel it was typed in. Keeping a bare
  // string carried a half-written message into the next channel, where it
  // could be sent to the wrong people.
  const [draft, setDraft] = useState({ channelId: null, text: "" });
  const [modal, setModal] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  // The details panel is docked on desktop and a drawer on mobile, so it
  // starts open only when there is room for it.
  const [showInfo, setShowInfo] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024
  );

  const { activeChannel } = useChannelContext();
  const { data: profileData } = useGetProfile();
  const { data: historyData, isPending: historyLoading } =
    useGetChannelMessagesHistory();
  const {
    messages: liveMessages,
    typingUsers,
    sendMessage,
    notifyTyping,
    isConnected,
  } = useChannelMessages();

  const currentUserId = profileData?.user?.id
    ? String(profileData.user.id)
    : null;

  const message = draft.channelId === activeChannel?.id ? draft.text : "";

  const feed = useMemo(() => {
    const history = (historyData?.messages ?? []).map(normalizeMessage);
    const seen = new Set();
    const merged = [...history, ...liveMessages]
      .filter((m) => {
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return true;
      })
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return buildFeed(merged, currentUserId);
  }, [historyData, liveMessages, currentUserId]);

  useEffect(() => {
    const locked = showSidebar || showInfo;
    if (!locked) return;
    // Only the drawers need this, and only below lg — desktop panels are docked.
    if (window.innerWidth >= 1024) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showSidebar, showInfo]);

  const openModal = (type) => setModal(type);
  const closeModal = () => {
    setModal(null);
    setSelectedMember(null);
  };

  const handleDeleteClick = (member) => {
    setSelectedMember(member);
    openModal("delete_member");
  };

  const handleSendMessage = () => {
    if (!message.trim() || !isConnected) return;
    sendMessage(message);
    setDraft({ channelId: activeChannel?.id ?? null, text: "" });
  };

  const handleDraftChange = (value) => {
    setDraft({ channelId: activeChannel?.id ?? null, text: value });
    notifyTyping();
  };

  const copyInvite = async () => {
    if (!activeChannel) return;
    const code = withHash(activeChannel.admin_code);
    try {
      await navigator.clipboard.writeText(code);
      toast.ok("Invite code copied", `${code} — paste it anywhere`);
    } catch {
      // Clipboard needs a secure context; show the code so it stays usable.
      toast.warn("Couldn't copy automatically", `Invite code: ${code}`);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-canvas text-ink">
      {showSidebar && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SideBar
          openModal={openModal}
          closeSidebar={() => setShowSidebar(false)}
        />
      </div>

      <main className="flex min-w-0 flex-1 flex-col">
        {activeChannel ? (
          <>
            <Header
              onOpenSidebar={() => setShowSidebar(true)}
              onToggleInfo={() => setShowInfo((v) => !v)}
              onCopyInvite={copyInvite}
            />
            {/* Keyed by channel so the scroll position resets when switching. */}
            <MessageArea
              key={activeChannel.id}
              feed={feed}
              isLoading={historyLoading}
              typingUsers={typingUsers}
              channelName={activeChannel.name}
            />
            <InputBlock
              message={message}
              onChange={handleDraftChange}
              onSend={handleSendMessage}
              channelName={activeChannel.name}
              isConnected={isConnected}
            />
          </>
        ) : (
          <NoChat
            onOpenSidebar={() => setShowSidebar(true)}
            openModal={openModal}
          />
        )}
      </main>

      {activeChannel && showInfo && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setShowInfo(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 lg:relative">
            <InfoBlock
              openModal={openModal}
              handleDeleteClick={handleDeleteClick}
              onCopyInvite={copyInvite}
              onClose={() => setShowInfo(false)}
            />
          </div>
        </>
      )}

      {/* Mounted only while open: each dialog seeds its form from current data
          on mount, which is why none of them need a prop-to-state effect. */}
      {modal === "group" && <CreateGroupModal open onClose={closeModal} />}
      {modal === "code" && <EnterCodeModal open onClose={closeModal} />}
      {modal === "profile" && <EditProfileModal open onClose={closeModal} />}
      {modal === "edit" && <EditGroupModal open onClose={closeModal} />}
      {modal === "add_member" && <AddMember open onClose={closeModal} />}
      {modal === "delete_channel" && (
        <DeleteChannel open onClose={closeModal} />
      )}
      {modal === "delete_member" && selectedMember && (
        <DeleteMember open onClose={closeModal} member={selectedMember} />
      )}
    </div>
  );
}
