import { useState } from "react";
import { LogOut, Plus, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../contexts/socketContext";
import { useChannelContext } from "../../hooks/channel/useChannelContext";
import { useGetProfile } from "../../hooks/profile/useGetProfile";
import { useSearchUsers } from "../../hooks/useSearchUsers";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { queryClient } from "../../lib/queryClient";
import { useAuthStore } from "../../store/useAuthStore";
import { toast } from "../../store/useToastStore";
import { IconButtonClass, SectionLabelClass } from "../../styles";
import Avatar from "../ui/avatar";

export default function SideBar({ openModal, closeSidebar }) {
  const { channels, activeChannel, setActiveChannel, isLoading, error, refetchChannels } =
    useChannelContext();
  const { data: profileData } = useGetProfile();
  const profile = profileData?.user ?? {};
  const { isConnected } = useSocket();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const term = query.trim().toLowerCase();
  const debouncedQuery = useDebouncedValue(query.trim(), 300);
  const { data: peopleData } = useSearchUsers(debouncedQuery);

  const visibleChannels = term
    ? channels.filter(
        (c) =>
          c.name?.toLowerCase().includes(term) ||
          c.description?.toLowerCase().includes(term)
      )
    : channels;

  // People only show up while searching — there are no direct messages, so
  // these rows are informational: they tell an admin who exists to invite.
  const people = term ? (peopleData?.users ?? []) : [];

  const logOut = () => {
    useAuthStore.getState().logOut();
    sessionStorage.clear();
    queryClient.clear();
    navigate("/", { replace: true });
    toast.warn("Signed out", "See you soon");
  };

  const handleChannelClick = (channel) => {
    setActiveChannel(channel);
    closeSidebar?.();
  };

  const listState = isLoading
    ? "loading"
    : error
      ? "error"
      : channels.length === 0
        ? "empty"
        : visibleChannels.length === 0 && people.length === 0
          ? "no-match"
          : "ok";

  return (
    <div className="flex h-full w-[86vw] max-w-[328px] flex-col border-r border-line bg-panel lg:w-[328px]">
      <div className="flex items-center justify-between px-[18px] pt-4 pb-3.5">
        <div className="flex items-center gap-[9px]">
          <div className="h-[22px] w-[22px] rounded-[7px] bg-[linear-gradient(140deg,#5b83ff,#3ad0b0)]" />
          <span className="text-[15px] font-bold tracking-[-0.2px]">
            AzhChat
          </span>
        </div>
        <span className="hidden font-mono text-[10px] tracking-[.08em] text-placeholder uppercase lg:inline">
          beta
        </span>
        <button
          onClick={closeSidebar}
          aria-label="Close menu"
          className={`${IconButtonClass} h-8 w-8 lg:hidden`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div
        onClick={() => openModal("profile")}
        className="mx-3 mb-3 flex cursor-pointer items-center gap-[11px] rounded-xl border border-line bg-field px-2.5 py-[9px] transition-colors hover:border-line-btn hover:bg-[#191e28]"
      >
        <div className="relative flex-none">
          <Avatar name={profile.nickname} src={profile.avatar_url} size={34} />
          {/* Your own dot follows the socket, so it stops lying when the
              connection drops. */}
          <span
            className={`absolute right-[-1px] bottom-[-1px] h-[11px] w-[11px] rounded-full border-[2.5px] border-field ${
              isConnected ? "bg-online" : "bg-offline"
            }`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13.5px] font-semibold">
            {profile.nickname ?? "…"}
          </div>
          <div className="truncate text-[11.5px] text-muted">
            {profile.email ?? ""}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            logOut();
          }}
          title="Log out"
          aria-label="Log out"
          className={`${IconButtonClass} h-[30px] w-[30px] flex-none`}
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      <div className="px-3 pb-3">
        <div className="flex h-[38px] items-center gap-2 rounded-[11px] border border-line bg-field px-[11px] transition-colors focus-within:border-accent">
          <Search className="h-[15px] w-[15px] flex-none text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search channels and people"
            className="min-w-0 flex-1 border-none bg-transparent text-[13px] text-ink outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="grid cursor-pointer place-items-center p-0.5 text-faint transition-colors hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="mt-2.5 flex gap-2">
          <button
            onClick={() => openModal("group")}
            className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-[7px] rounded-[10px] bg-accent text-[13px] font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            <Plus className="h-[15px] w-[15px]" strokeWidth={2.2} />
            New channel
          </button>
          <button
            onClick={() => openModal("code")}
            className="flex h-9 w-[118px] flex-none cursor-pointer items-center justify-center gap-[7px] rounded-[10px] border border-line-btn bg-raised text-[13px] font-semibold text-ink-2 transition-colors hover:bg-hover-btn hover:text-ink"
          >
            <span className="font-mono text-faint">#</span> Join
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-5 pt-1.5 pb-2">
        <span className={SectionLabelClass}>
          Channels {listState === "ok" ? `(${visibleChannels.length})` : ""}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3.5">
        {listState === "loading" && (
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{ animationDelay: `${i * 0.15}s` }}
                className="h-[58px] rounded-xl bg-field animate-az-pulse"
              />
            ))}
          </div>
        )}

        {listState === "error" && (
          <div className="mt-[18px] rounded-2xl border border-danger-line-2 bg-danger-bg-2 px-4 py-[18px] text-center">
            <div className="text-[13.5px] font-semibold text-danger-ink">
              Couldn't load channels
            </div>
            <div className="mt-[5px] text-[12.5px] text-muted text-pretty">
              The server didn't answer. Check the connection and try again.
            </div>
            <button
              onClick={() => refetchChannels()}
              className="mt-3 h-8 cursor-pointer rounded-[9px] border border-line-btn bg-raised px-3.5 text-[12.5px] font-semibold text-ink transition-colors hover:bg-hover-btn"
            >
              Retry
            </button>
          </div>
        )}

        {listState === "empty" && (
          <div className="mt-[18px] rounded-2xl border border-dashed border-line-btn bg-inset px-4 py-5 text-center">
            <div className="mx-auto mb-2.5 grid h-9 w-9 place-items-center rounded-[11px] bg-elevated font-mono text-base text-muted">
              #
            </div>
            <div className="text-[13.5px] font-semibold">No channels yet</div>
            <div className="mt-[5px] text-[12.5px] text-muted text-pretty">
              Create your first channel or join one with a 6-character invite
              code.
            </div>
          </div>
        )}

        {listState === "no-match" && (
          <div className="mt-[18px] text-center text-[12.5px] text-muted">
            Nothing matches “{query}”
          </div>
        )}

        {visibleChannels.length > 0 && (
          <div className="flex flex-col gap-[3px]">
            {visibleChannels.map((channel) => {
              const isActive = activeChannel?.id === channel.id;
              return (
                <div
                  key={channel.id}
                  onClick={() => handleChannelClick(channel)}
                  className={`flex cursor-pointer items-center gap-[11px] rounded-xl border px-2.5 py-[9px] transition-colors ${
                    isActive
                      ? "border-row-active-line bg-row-active"
                      : "border-transparent hover:bg-hover-row"
                  }`}
                >
                  <Avatar
                    name={channel.name}
                    src={channel.avatar_url}
                    size={36}
                    radius="11px"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`truncate text-[13.5px] font-semibold ${
                          isActive ? "text-ink" : "text-ink-2"
                        }`}
                      >
                        {channel.name}
                      </span>
                      {channel.role === "admin" && (
                        <span className="ml-auto flex-none rounded-md bg-accent-soft px-1.5 py-px text-[9.5px] font-bold tracking-[.06em] text-accent-ink">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 truncate text-[12.5px] text-muted-2">
                      {channel.description || "No description"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {people.length > 0 && (
          <div className="mt-4">
            <div className={`${SectionLabelClass} px-2 pb-2`}>People</div>
            {people.map((person) => (
              <div
                key={person.id}
                className="flex items-center gap-[11px] rounded-xl px-2.5 py-2"
              >
                <Avatar
                  name={person.nickname}
                  src={person.avatar_url}
                  size={30}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium">
                    {person.nickname}
                  </div>
                  <div className="truncate text-[11.5px] text-faint">
                    {person.email}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
