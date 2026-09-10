import { useState } from "react";
import { BaseModal } from "./baseModal";
import { FormInput } from "../ui/formInput";
import { useJoinChannel } from "../../hooks/channel/useJoinChannel";
import { apiErrorMessage } from "../../lib/apiError";
import { INVITE_CODE_LENGTH, withHash } from "../../lib/invite";

export default function EnterCodeModal({ open, onClose }) {
  const { joinChannel, isPending } = useJoinChannel();
  const [code, setCode] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [serverError, setServerError] = useState("");

  // State holds the six characters; the # is presentation only.
  const handleChange = (e) => {
    setFieldError("");
    setServerError("");
    setCode(
      e.target.value
        .replace(/[^A-Za-z0-9]/g, "")
        .toUpperCase()
        .slice(0, INVITE_CODE_LENGTH)
    );
  };

  const handleClose = () => {
    setCode("");
    setFieldError("");
    setServerError("");
    onClose();
  };

  const handleSubmit = async () => {
    if (code.length !== INVITE_CODE_LENGTH) {
      setFieldError(`The code is exactly ${INVITE_CODE_LENGTH} characters`);
      return;
    }

    try {
      await joinChannel(withHash(code));
      handleClose();
    } catch (error) {
      setServerError(
        apiErrorMessage(error, "No channel with this code. Check it with the admin.")
      );
    }
  };

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title="Join a channel"
      subtitle="Ask an admin for the 6-character code"
      error={serverError}
      onDismissError={() => setServerError("")}
      confirmLabel={isPending ? "Joining…" : "Join"}
      onConfirm={handleSubmit}
      busy={isPending}
      confirmDisabled={code.length !== INVITE_CODE_LENGTH}
    >
      <FormInput
        label="Invite code"
        value={withHash(code)}
        onChange={handleChange}
        placeholder="ABC123"
        mono
        error={fieldError}
        hint="6 characters, uppercase — the # is added for you"
        disabled={isPending}
      />
    </BaseModal>
  );
}
