import { useState } from "react";
import { BaseModal } from "./baseModal";
import { FormInput } from "../ui/formInput";
import Avatar from "../ui/avatar";
import { useGetProfile } from "../../hooks/profile/useGetProfile";
import { useUpdateProfile } from "../../hooks/profile/useUpdateProfile";
import { apiErrorMessage } from "../../lib/apiError";

export const EditProfileModal = ({ open, onClose }) => {
  const { data } = useGetProfile();
  const { updateProfile, isPending } = useUpdateProfile();
  const profile = data?.user ?? {};

  // Dashboard mounts this modal only while it is open, so the form starts
  // from the current profile on every open — no prop/state syncing effect.
  const [nickname, setNickname] = useState(() => profile.nickname ?? "");
  const [fieldError, setFieldError] = useState("");
  const [serverError, setServerError] = useState("");

  const handleSubmit = async () => {
    const trimmed = nickname.trim();

    if (trimmed.length < 3) {
      setFieldError("At least 3 characters");
      return;
    }
    if (trimmed === profile.nickname) {
      onClose();
      return;
    }

    try {
      await updateProfile({ nickname: trimmed });
      onClose();
    } catch (error) {
      setServerError(apiErrorMessage(error, "Couldn't save the profile"));
    }
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Your profile"
      subtitle="Visible to everyone in your channels"
      error={serverError}
      onDismissError={() => setServerError("")}
      confirmLabel={isPending ? "Saving…" : "Save changes"}
      onConfirm={handleSubmit}
      busy={isPending}
    >
      <div className="flex items-center gap-[13px]">
        <Avatar
          name={nickname || profile.nickname}
          src={profile.avatar_url}
          size={56}
        />
        <div>
          <div className="text-[15px] font-semibold">
            {nickname || profile.nickname}
          </div>
          <div className="mt-1 inline-flex items-center gap-1.5 text-[12px] text-online">
            <span className="h-[7px] w-[7px] rounded-full bg-online" />
            Online
          </div>
        </div>
      </div>

      <FormInput
        label="Email"
        value={profile.email ?? ""}
        onChange={() => {}}
        disabled
        hint="Email can't be changed"
      />
      <FormInput
        label="Nickname"
        value={nickname}
        onChange={(e) => {
          setNickname(e.target.value);
          setFieldError("");
        }}
        placeholder="Your nickname"
        error={fieldError}
        disabled={isPending}
      />
    </BaseModal>
  );
};
