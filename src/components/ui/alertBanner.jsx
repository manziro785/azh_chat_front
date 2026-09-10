import { X } from "lucide-react";

// Server-error banner from the modal spec: dark palette, sits above the form,
// dismissible. This is what replaced the white alert box on a dark page.
export default function AlertBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-danger-line-2 bg-danger-bg-2 px-3 py-[11px]">
      <span className="mt-px grid h-[18px] w-[18px] flex-none place-items-center rounded-full bg-danger-line text-[11px] font-bold text-danger-ink">
        !
      </span>
      <span className="min-w-0 flex-1 text-[12.5px] text-danger-ink-2 text-pretty">
        {message}
      </span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="flex-none cursor-pointer text-danger-ink opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
