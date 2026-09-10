import { Copy, Menu, Users } from "lucide-react";
import { useChannelContext } from "../../hooks/channel/useChannelContext";
import { useGetChannelMembers } from "../../hooks/members/useGetChannelMembers";
import { useSocket } from "../../contexts/socketContext";
import { ChipButtonClass } from "../../styles";

export default function Header({ onOpenSidebar, onToggleInfo, onCopyInvite }) {
  const { isConnected } = useSocket();
  const { activeChannel } = useChannelContext();
  const { data } = useGetChannelMembers();
  const memberCount = data?.count ?? 0;

  return (
    <header className="flex h-[60px] flex-none items-center gap-3 border-b border-line bg-panel-head px-4 lg:px-5">
      <button
        onClick={onOpenSidebar}
        aria-label="Open channels"
        className="grid h-9 w-9 flex-none cursor-pointer place-items-center rounded-[10px] text-ink-2 transition-colors hover:bg-hover-icon hover:text-ink lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <span className="hidden font-mono text-[17px] text-faint sm:inline">
        #
      </span>

      <div className="min-w-0">
        <div className="flex items-center gap-[9px]">
          <span className="max-w-[340px] truncate text-[15px] font-semibold">
            {activeChannel.name}
          </span>
          {!isConnected && (
            <span className="inline-flex h-[22px] flex-none items-center gap-1.5 rounded-[7px] border border-[#46232a] bg-[#2a1519] px-[9px] text-[11.5px] font-semibold text-danger-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff6a5e]" />
              <span className="hidden sm:inline">Reconnecting</span>
            </span>
          )}
        </div>
        <div className="truncate text-[12px] text-muted">
          {memberCount} {memberCount === 1 ? "member" : "members"}
          {activeChannel.description ? ` · ${activeChannel.description}` : ""}
        </div>
      </div>

      <div className="ml-auto flex flex-none items-center gap-2">
        <button onClick={onCopyInvite} className={ChipButtonClass}>
          <Copy className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Invite</span>
        </button>
        <button
          onClick={onToggleInfo}
          aria-label="Channel details"
          className={`${ChipButtonClass} w-[34px] justify-center px-0`}
        >
          <Users className="h-[15px] w-[15px]" />
        </button>
      </div>
    </header>
  );
}
