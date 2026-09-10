import { Menu, Plus } from "lucide-react";
import { useChannelContext } from "../../hooks/channel/useChannelContext";

const HINTS = [
  {
    title: "Create a channel",
    body: "You become admin and get an invite code to share.",
  },
  {
    title: "Join with a code",
    body: "Six characters from an admin — like SCA22B.",
  },
  {
    title: "Everything is live",
    body: "Messages, members and typing arrive without reload.",
  },
];

// This is the first screen a new account sees, so it doubles as onboarding:
// it says what to do next instead of just "select a channel".
export default function NoChat({ onOpenSidebar, openModal }) {
  const { channels } = useChannelContext();
  const hasChannels = channels.length > 0;

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center p-10 text-center">
      <button
        onClick={onOpenSidebar}
        aria-label="Open channels"
        className="absolute top-4 left-4 grid h-9 w-9 cursor-pointer place-items-center rounded-[10px] text-ink-2 transition-colors hover:bg-hover-icon hover:text-ink lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="grid h-16 w-16 place-items-center rounded-[20px] border border-[#232a36] bg-[linear-gradient(150deg,#1b2130,#12161e)] font-mono text-[26px] text-accent-ink">
        #
      </div>
      <h1 className="mt-5 text-[26px] font-bold tracking-[-0.5px]">
        {hasChannels
          ? "Pick a channel to start reading"
          : "Nothing here yet — that's fixable"}
      </h1>
      <p className="mt-[9px] max-w-[400px] text-[14.5px] text-muted text-pretty">
        {hasChannels
          ? "Your channels are on the left. Or start a new one and invite people with a code."
          : "Create your first channel, or join an existing one with a 6-character invite code."}
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
        <button
          onClick={() => openModal("group")}
          className="flex h-10 cursor-pointer items-center gap-2 rounded-[11px] bg-accent px-[18px] text-[13.5px] font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          <Plus className="h-4 w-4" strokeWidth={2.2} />
          Create a channel
        </button>
        <button
          onClick={() => openModal("code")}
          className="flex h-10 cursor-pointer items-center gap-2 rounded-[11px] border border-line-btn bg-raised px-[18px] text-[13.5px] font-semibold text-ink transition-colors hover:bg-hover-btn"
        >
          <span className="font-mono text-muted">#</span> Join with a code
        </button>
      </div>

      <div className="mt-[34px] flex max-w-[620px] flex-wrap justify-center gap-2.5">
        {HINTS.map((hint) => (
          <div
            key={hint.title}
            className="min-w-[170px] flex-[1_1_180px] rounded-[13px] border border-line bg-inset px-[15px] py-[13px] text-left"
          >
            <div className="text-[12.5px] font-semibold">{hint.title}</div>
            <div className="mt-1 text-[12px] text-muted text-pretty">
              {hint.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
