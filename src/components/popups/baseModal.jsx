import { X } from "lucide-react";
import { Box, Modal } from "@mui/material";
import { ModalBackdropStyle, ModalStyle } from "../../styles";
import AlertBanner from "../ui/alertBanner";
import Spinner from "../ui/spinner";

// One shell for all seven dialogs, per the modal spec: 400px card, title plus
// one line of context, body, then secondary-left / primary-right footer.
// MUI's Modal is kept only for the portal, focus trap, Esc and scroll lock —
// everything visible here is the design's own.
export const BaseModal = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  error,
  onDismissError,
  cancelLabel = "Close",
  confirmLabel,
  onConfirm,
  busy = false,
  danger = false,
  confirmDisabled = false,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    slotProps={{ backdrop: { sx: ModalBackdropStyle } }}
  >
    <Box sx={ModalStyle} tabIndex={-1} className="animate-az-pop">
      <div className="flex items-start gap-3 p-5 pb-0">
        <div className="min-w-0 flex-1">
          <div className="text-[16.5px] font-bold tracking-[-0.2px] text-ink">
            {title}
          </div>
          {subtitle && (
            <div className="mt-[3px] text-[12.5px] text-muted text-pretty">
              {subtitle}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="grid h-7 w-7 flex-none cursor-pointer place-items-center rounded-lg bg-transparent text-muted transition-colors hover:bg-hover-icon hover:text-ink"
        >
          <X className="h-[15px] w-[15px]" />
        </button>
      </div>

      <div className="flex flex-col gap-3.5 px-5 pt-[18px] pb-1">
        <AlertBanner message={error} onDismiss={onDismissError} />
        {children}
      </div>

      <div className="flex gap-2.5 p-5 pt-[18px]">
        <button
          onClick={onClose}
          className="h-10 flex-1 cursor-pointer rounded-[11px] border border-line-btn bg-raised text-[13.5px] font-semibold text-ink-2 transition-colors hover:bg-hover-btn hover:text-ink"
        >
          {cancelLabel}
        </button>
        {confirmLabel && (
          <button
            onClick={onConfirm}
            disabled={busy || confirmDisabled}
            className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-[11px] text-[13.5px] font-semibold text-white transition-colors ${
              confirmDisabled && !busy
                ? "cursor-default bg-[#1b2029] text-placeholder"
                : danger
                  ? "cursor-pointer bg-danger hover:bg-[#d0453a]"
                  : "cursor-pointer bg-accent hover:bg-accent-hover"
            } ${busy ? "cursor-default opacity-75" : ""}`}
          >
            {busy && <Spinner />}
            {confirmLabel}
          </button>
        )}
      </div>
    </Box>
  </Modal>
);
