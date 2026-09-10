import { X, Check, AlertTriangle } from "lucide-react";
import { useToastStore } from "../../store/useToastStore";

const TONES = {
  ok: {
    border: "border-line-strong",
    iconBg: "bg-accent-soft",
    iconFg: "text-accent-ink",
    Icon: Check,
  },
  warn: {
    border: "border-danger-line-2",
    iconBg: "bg-danger-line",
    iconFg: "text-danger-ink",
    Icon: AlertTriangle,
  },
};

export default function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-[22px] bottom-[22px] z-[80] flex flex-col items-end gap-2.5 pointer-events-none">
      {toasts.map((t) => {
        const tone = TONES[t.tone] || TONES.ok;
        const Icon = tone.Icon;
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex min-w-[280px] max-w-[360px] items-start gap-[11px] rounded-[13px] border bg-surface p-[13px] shadow-[0_16px_40px_rgba(0,0,0,.45)] animate-az-toast ${tone.border}`}
          >
            <span
              className={`grid h-[22px] w-[22px] flex-none place-items-center rounded-[7px] ${tone.iconBg} ${tone.iconFg}`}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold text-ink">{t.title}</div>
              {t.body && (
                <div className="mt-0.5 text-[12px] text-ink-3">{t.body}</div>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
              className="grid h-[22px] w-[22px] flex-none cursor-pointer place-items-center rounded-md bg-transparent text-faint transition-colors hover:bg-hover-icon hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
