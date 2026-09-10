// Shared class strings for the redesign. Values come from the design tokens
// in src/index.css — keep them here so the seven modals stay one system.

// MUI <Modal> only gives us the portal, focus trap and Esc handling.
// Everything visual is the design's card: 400px, 18px radius, dark surface.
export const ModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  maxWidth: "calc(100vw - 32px)",
  bgcolor: "#12161e",
  border: "1px solid #232a36",
  borderRadius: "18px",
  boxShadow: "0 24px 70px rgba(0,0,0,.6)",
  outline: "none",
};

export const ModalBackdropStyle = {
  backgroundColor: "rgba(5,7,10,.72)",
  backdropFilter: "blur(3px)",
};

export const LabelClass =
  "block text-[11px] font-semibold uppercase tracking-[.07em] text-muted mb-1.5";

export const InputClass =
  "w-full h-10 px-[13px] rounded-[11px] bg-elevated text-ink text-[13.5px] " +
  "border border-line-field outline-none transition-colors " +
  "focus:border-accent disabled:bg-[#0e1218] disabled:text-faint";

export const InputErrorClass = "border-danger-field focus:border-danger-field";

export const FieldErrorClass =
  "flex items-center gap-1.5 mt-1.5 text-[11.5px] text-danger-ink";

export const FieldHintClass = "block mt-1.5 text-[11.5px] text-faint";

export const ButtonPrimaryClass =
  "h-10 px-4 inline-flex items-center justify-center gap-2 rounded-[11px] " +
  "bg-accent text-white text-[13.5px] font-semibold transition-colors " +
  "hover:bg-accent-hover disabled:opacity-70 disabled:cursor-default cursor-pointer";

export const ButtonSecondaryClass =
  "h-10 px-4 inline-flex items-center justify-center gap-2 rounded-[11px] " +
  "border border-line-btn bg-raised text-ink-2 text-[13.5px] font-semibold " +
  "transition-colors hover:bg-hover-btn hover:text-ink cursor-pointer";

export const ButtonDangerClass =
  "h-10 px-4 inline-flex items-center justify-center gap-2 rounded-[11px] " +
  "bg-danger text-white text-[13.5px] font-semibold transition-colors " +
  "hover:bg-[#d0453a] disabled:opacity-70 disabled:cursor-default cursor-pointer";

// Small square icon button used in headers and panels.
export const IconButtonClass =
  "grid place-items-center rounded-[9px] bg-transparent text-muted " +
  "transition-colors hover:bg-hover-icon hover:text-ink cursor-pointer";

export const ChipButtonClass =
  "h-[34px] px-[13px] inline-flex items-center gap-2 rounded-[10px] " +
  "border border-line-btn bg-raised text-ink-2 text-[12.5px] font-semibold " +
  "transition-colors hover:bg-hover-btn hover:text-ink cursor-pointer";

export const SectionLabelClass =
  "text-[10.5px] font-semibold uppercase tracking-[.1em] text-faint";
