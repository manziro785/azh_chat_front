import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import {
  ButtonPrimaryClass,
  FieldErrorClass,
  InputClass,
  InputErrorClass,
  LabelClass,
} from "../../styles";
import AlertBanner from "../ui/alertBanner";
import Spinner from "../ui/spinner";

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className={LabelClass}>{label}</span>
      {children}
      {error && (
        <span className={FieldErrorClass}>
          <AlertCircle className="h-[13px] w-[13px] flex-none" />
          {error.message}
        </span>
      )}
    </label>
  );
}

export default function AuthForm({ tab }) {
  const { submitAuth, isLoading, error, clearError } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  useEffect(() => {
    if (confirmPassword) trigger("confirmPassword");
  }, [password, confirmPassword, trigger]);

  // Switching tabs starts a different form: drop both the server banner and
  // any field errors left over from the other tab. Values are kept on purpose,
  // so a typed email survives the switch.
  useEffect(() => {
    clearError();
    clearErrors();
  }, [tab, clearError, clearErrors]);

  const isRegister = tab === "register";
  const loading = isLoading || isSubmitting;
  const inputClass = (hasError) =>
    `${InputClass} ${hasError ? InputErrorClass : ""}`;

  // submitAuth rejects on failure; useAuth has already turned that into the
  // banner message, so there is nothing left to do here but stop the throw.
  const onSubmit = (data) => submitAuth(data, tab).catch(() => {});

  return (
    // noValidate hands validation to react-hook-form. Without it the browser's
    // own check on type="email" runs first, silently cancels the submit and
    // shows a native bubble — so none of the messages below ever appeared.
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
    >
      <AlertBanner message={error} onDismiss={clearError} />

      <Field label="Email" error={errors.email}>
        <input
          type="email"
          placeholder="you@example.com"
          disabled={loading}
          className={inputClass(errors.email)}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "That doesn't look like an email",
            },
          })}
        />
      </Field>

      {isRegister && (
        <Field label="Nickname" error={errors.nickname}>
          <input
            type="text"
            placeholder="How people will see you"
            disabled={loading}
            className={inputClass(errors.nickname)}
            {...register("nickname", {
              required: "Nickname is required",
              minLength: { value: 3, message: "At least 3 characters" },
            })}
          />
        </Field>
      )}

      <Field label="Password" error={errors.password}>
        <input
          type="password"
          placeholder="At least 6 characters"
          disabled={loading}
          className={inputClass(errors.password)}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "At least 6 characters" },
          })}
        />
      </Field>

      {isRegister && (
        <Field label="Repeat password" error={errors.confirmPassword}>
          <input
            type="password"
            placeholder="Same password again"
            disabled={loading}
            className={inputClass(errors.confirmPassword)}
            {...register("confirmPassword", {
              required: "Please repeat the password",
              validate: (value) =>
                value === password || "Passwords don't match",
            })}
          />
        </Field>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`${ButtonPrimaryClass} mt-1 w-full`}
      >
        {loading && <Spinner />}
        {loading
          ? isRegister
            ? "Creating account…"
            : "Signing in…"
          : isRegister
            ? "Create account"
            : "Sign in"}
      </button>
    </form>
  );
}
