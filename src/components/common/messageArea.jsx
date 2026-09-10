import { useEffect, useRef } from "react";
import Avatar from "../ui/avatar";

// How close to the bottom still counts as "reading the newest messages".
const STICK_THRESHOLD_PX = 120;

function bubbleRadius(mine, index) {
  if (mine) return index === 0 ? "16px 16px 6px 16px" : "16px 6px 6px 16px";
  return index === 0 ? "16px 16px 16px 6px" : "6px 16px 16px 6px";
}

function TypingIndicator({ users }) {
  if (users.length === 0) return null;

  const text =
    users.length === 1
      ? `${users[0].nickname} is typing…`
      : `${users.length} people are typing…`;

  return (
    <div className="mt-3.5 flex items-center gap-[11px]">
      <Avatar name={users[0].nickname} size={32} />
      <div className="flex items-center gap-[9px] rounded-[14px] rounded-bl-[4px] border border-line-bubble bg-elevated px-3.5 py-2.5">
        <span className="inline-flex gap-1">
          {[0, 0.15, 0.3].map((delay) => (
            <span
              key={delay}
              style={{ animationDelay: `${delay}s` }}
              className="h-[5px] w-[5px] rounded-full bg-ink-3 animate-az-dot"
            />
          ))}
        </span>
        <span className="text-[12.5px] text-muted">{text}</span>
      </div>
    </div>
  );
}

export default function MessageArea({
  feed,
  isLoading,
  typingUsers,
  channelName,
}) {
  const scrollRef = useRef(null);
  const endRef = useRef(null);
  // Only follow new messages while the reader is already at the bottom.
  // Scrolling up to read history used to get yanked back down on every
  // incoming message.
  const stickToBottom = useRef(true);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    stickToBottom.current = distanceFromBottom < STICK_THRESHOLD_PX;
  };

  useEffect(() => {
    if (stickToBottom.current) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [feed.length, typingUsers.length]);

  if (isLoading) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-[22px] pb-2 lg:px-[26px]">
        <div className="mx-auto flex max-w-[900px] flex-col gap-[18px]">
          <div className="h-[52px] w-[46%] rounded-[14px] bg-[#12161e] animate-az-pulse" />
          <div className="ml-auto h-10 w-[32%] rounded-[14px] bg-[#141922] animate-az-pulse [animation-delay:.2s]" />
          <div className="h-16 w-[52%] rounded-[14px] bg-[#12161e] animate-az-pulse [animation-delay:.4s]" />
        </div>
      </div>
    );
  }

  if (feed.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="grid h-[52px] w-[52px] place-items-center rounded-2xl border border-line-bubble bg-[#141922] font-mono text-xl text-faint">
          #
        </div>
        <div className="text-[17px] font-semibold">
          No messages in {channelName} yet
        </div>
        <div className="max-w-[330px] text-[13px] text-muted text-pretty">
          Be the first to write. Everyone in this channel gets it in real time.
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="min-h-0 flex-1 overflow-y-auto px-4 pt-[22px] pb-2 lg:px-[26px]"
    >
      <div className="mx-auto flex max-w-[900px] flex-col gap-1">
        {feed.map((item) => {
          if (item.kind === "day") {
            return (
              <div
                key={item.key}
                className="my-3 flex items-center gap-3.5 first:mt-0"
              >
                <div className="h-px flex-1 bg-line" />
                <span className="text-[11px] font-semibold tracking-[.06em] text-faint uppercase">
                  {item.label}
                </span>
                <div className="h-px flex-1 bg-line" />
              </div>
            );
          }

          return (
            <div
              key={item.key}
              className={`mt-2.5 flex gap-[11px] ${
                item.mine ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Avatar
                name={item.avatarName}
                src={item.avatarUrl}
                size={32}
                className="self-end"
              />
              <div
                className={`flex min-w-0 max-w-[620px] flex-col gap-1 ${
                  item.mine ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-baseline gap-2 px-1">
                  <span
                    className={`text-[12.5px] font-semibold ${
                      item.mine ? "text-accent-ink" : "text-ink"
                    }`}
                  >
                    {item.nick}
                  </span>
                  <span className="text-[11px] text-faint tabular-nums">
                    {item.time}
                  </span>
                </div>

                {item.bubbles.map((bubble, index) => (
                  <div
                    key={bubble.id ?? index}
                    style={{ borderRadius: bubbleRadius(item.mine, index) }}
                    className={`border px-[13px] py-[9px] text-[14px] [overflow-wrap:anywhere] text-pretty ${
                      item.mine
                        ? "border-mine-line bg-mine text-mine-ink"
                        : "border-line-bubble bg-elevated text-[#e3e8ef]"
                    }`}
                  >
                    {bubble.text}
                  </div>
                ))}

                {item.mine && (
                  <span className="px-1 text-[11px] text-faint">Sent</span>
                )}
              </div>
            </div>
          );
        })}

        <TypingIndicator users={typingUsers} />
        <div ref={endRef} />
      </div>
    </div>
  );
}
