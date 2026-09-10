import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useChannelContext } from "../../hooks/channel/useChannelContext";
import { useGetChannelMembers } from "../../hooks/members/useGetChannelMembers";
import { useGetProfile } from "../../hooks/profile/useGetProfile";
import { useSocket } from "../../contexts/socketContext";
import { presenceLabel } from "../../lib/presence";
import { withHash } from "../../lib/invite";
import { IconButtonClass, SectionLabelClass } from "../../styles";
import Avatar from "../ui/avatar";

export default function InfoBlock({
  openModal,
  handleDeleteClick,
  onCopyInvite,
  onClose,
}) {
  const { activeChannel } = useChannelContext();
  const { data } = useGetChannelMembers();
  const { data: profileData } = useGetProfile();
  const { onlineUserIds, isConnected } = useSocket();

  if (!activeChannel) return null;

  const isAdmin = activeChannel.role === "admin";
  const members = data?.members ?? [];
  const myId = profileData?.user?.id ? String(profileData.user.id) : null;

  // The server broadcasts "offline" for a user id as soon as ANY of their
  // sockets disconnects, without checking whether another tab is still
  // connected — so closing a second tab marked you offline to yourself.
  // Our own connection is something we know for certain.
  const isOnline = (memberId) => {
    const id = String(memberId);
    if (myId && id === myId) return isConnected;
    return onlineUserIds.has(id);
  };

  return (
    <div className="flex h-full w-[86vw] max-w-[284px] flex-col border-l border-line bg-panel lg:w-[284px]">
      <div className="relative px-[18px] pt-[22px] pb-4 text-center">
        <button
          onClick={onClose}
          aria-label="Close details"
          className={`${IconButtonClass} absolute top-3.5 left-3.5 h-[30px] w-[30px] lg:hidden`}
        >
          <X className="h-4 w-4" />
        </button>
        {isAdmin && (
          <button
            onClick={() => openModal("edit")}
            aria-label="Edit channel"
            className={`${IconButtonClass} absolute top-3.5 right-3.5 h-[30px] w-[30px]`}
          >
            <Pencil className="h-[15px] w-[15px]" />
          </button>
        )}

        <div className="flex justify-center">
          <Avatar
            name={activeChannel.name}
            src={activeChannel.avatar_url}
            size={68}
            radius="22px"
          />
        </div>
        <div className="mt-3 text-[15.5px] font-semibold break-words">
          {activeChannel.name}
        </div>
        <div className="mt-1 text-[12.5px] text-muted text-pretty">
          {activeChannel.description || "No description"}
        </div>
      </div>

      {isAdmin && (
        <div className="mx-3.5 mb-3.5 rounded-xl border border-line bg-field px-[13px] py-[11px]">
          <div className="flex items-center justify-between gap-2">
            <span className={SectionLabelClass}>Invite code</span>
            <span className="text-[10.5px] text-faint">admin only</span>
          </div>
          <div className="mt-[7px] flex items-center gap-2">
            <code className="flex-1 font-mono text-[15px] tracking-[.12em] text-ink">
              {withHash(activeChannel.admin_code)}
            </code>
            <button
              onClick={onCopyInvite}
              className="h-7 cursor-pointer rounded-lg border border-line-btn bg-[#181d27] px-2.5 text-[11.5px] font-semibold text-ink-2 transition-colors hover:bg-[#212836] hover:text-ink"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-[18px] pt-1 pb-2">
        <span className={SectionLabelClass}>Members — {members.length}</span>
        {isAdmin && (
          <button
            onClick={() => openModal("add_member")}
            aria-label="Add member"
            className="grid h-6 w-6 cursor-pointer place-items-center rounded-lg border border-line-btn bg-raised text-ink-2 transition-colors hover:bg-hover-btn hover:text-ink"
          >
            <Plus className="h-[13px] w-[13px]" strokeWidth={2.4} />
          </button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
        {members.map((member) => {
          const memberIsAdmin = member.role === "admin";
          const online = isOnline(member.id);
          return (
            <div
              key={member.id}
              className="group flex items-center gap-2.5 rounded-[11px] px-2 py-[7px] transition-colors hover:bg-hover-row"
            >
              <div className="relative flex-none">
                <Avatar
                  name={member.nickname}
                  src={member.avatar_url}
                  size={30}
                  dimmed={!online}
                />
                <span
                  className={`absolute right-[-1px] bottom-[-1px] h-2.5 w-2.5 rounded-full border-[2.5px] border-panel ${
                    online ? "bg-online" : "bg-offline"
                  }`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div
                  className={`truncate text-[13px] font-medium ${
                    online ? "text-ink" : "text-[#a2abb8]"
                  }`}
                >
                  {member.nickname}
                </div>
                <div className="truncate text-[11px] text-faint">
                  {presenceLabel(online, member.last_seen)}
                </div>
              </div>
              {memberIsAdmin && (
                <span className="flex-none rounded-md bg-accent-soft px-1.5 py-0.5 text-[9.5px] font-bold tracking-[.06em] text-accent-ink">
                  ADMIN
                </span>
              )}
              {isAdmin && !memberIsAdmin && (
                <button
                  onClick={() => handleDeleteClick(member)}
                  aria-label={`Remove ${member.nickname}`}
                  className="grid h-6 w-6 flex-none cursor-pointer place-items-center rounded-[7px] bg-transparent text-faint transition-colors hover:bg-danger-line hover:text-danger-ink"
                >
                  <X className="h-[13px] w-[13px]" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {isAdmin && (
        <div className="border-t border-line px-3.5 pt-3 pb-4">
          <button
            onClick={() => openModal("delete_channel")}
            className="flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] border border-danger-line bg-danger-bg text-[12.5px] font-semibold text-danger-ink transition-colors hover:border-[#4d242b] hover:bg-danger-hover"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete channel
          </button>
        </div>
      )}
    </div>
  );
}
