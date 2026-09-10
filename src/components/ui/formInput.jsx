import { AlertCircle } from "lucide-react";
import {
  FieldErrorClass,
  FieldHintClass,
  InputClass,
  InputErrorClass,
  LabelClass,
} from "../../styles";

export const FormInput = ({ label, error, hint, mono = false, ...props }) => (
  <label className="block">
    {label && <span className={LabelClass}>{label}</span>}
    <input
      className={`${InputClass} ${error ? InputErrorClass : ""} ${
        mono ? "font-mono tracking-[.12em]" : ""
      }`}
      {...props}
    />
    {error && (
      <span className={FieldErrorClass}>
        <AlertCircle className="h-[13px] w-[13px] flex-none" />
        {error}
      </span>
    )}
    {!error && hint && <span className={FieldHintClass}>{hint}</span>}
  </label>
);
