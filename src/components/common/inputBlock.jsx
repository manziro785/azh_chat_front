import { Send } from "lucide-react";
import Spinner from "../ui/spinner";

export default function InputBlock({
  message,
  onChange,
  onSend,
  channelName,
  isConnected,
}) {
  const canSend = isConnected && message.trim().length > 0;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex-none px-4 pt-2.5 pb-5 lg:px-[26px]">
      <div className="mx-auto max-w-[900px]">
        {!isConnected && (
          <div className="mb-2.5 flex items-center gap-2.5 rounded-[11px] border border-danger-line-2 bg-danger-bg-2 px-[13px] py-[9px] text-[12.5px] text-danger-ink-2">
            <Spinner className="text-[#ff6a5e]" />
            Connection lost — messages can't be sent. Retrying…
          </div>
        )}

        <div className="flex items-end gap-2.5 rounded-2xl border border-line-field bg-field py-2 pr-2 pl-3.5">
          <input
            value={message}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!isConnected}
            placeholder={
              isConnected
                ? `Message #${channelName}`
                : "Reconnecting — sending is paused"
            }
            className="h-[34px] min-w-0 flex-1 border-none bg-transparent text-[14px] text-ink outline-none disabled:cursor-not-allowed"
          />
          <button
            onClick={onSend}
            disabled={!canSend}
            aria-label="Send message"
            className={`grid h-9 w-9 flex-none place-items-center rounded-[11px] transition-colors ${
              canSend
                ? "cursor-pointer bg-accent text-white hover:bg-accent-hover"
                : "cursor-default bg-[#1b2029] text-placeholder"
            }`}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
