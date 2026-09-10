import { useState } from "react";
import { BaseModal } from "./baseModal";
import Avatar from "../ui/avatar";
import { useDeleteChannelMember } from "../../hooks/members/useDeleteChannelMember";
import { useChannelContext } from "../../hooks/channel/useChannelContext";
import { apiErrorMessage } from "../../lib/apiError";

export default function DeleteMember({ open, onClose, member }) {
  const { deleteMember, isPending } = useDeleteChannelMember();
  const { activeChannel } = useChannelContext();
  const [serverError, setServerError] = useState("");

  const handleDelete = async () => {
    try {
      await deleteMember({ memberId: member.id, nickname: member.nickname });
      onClose();
    } catch (error) {
      setServerError(apiErrorMessage(error, "Couldn't remove the member"));
    }
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Remove member?"
      subtitle="They lose access to this channel immediately"
      cancelLabel="Cancel"
      error={serverError}
      onDismissError={() => setServerError("")}
      confirmLabel={isPending ? "Removing…" : "Remove"}
      onConfirm={handleDelete}
      busy={isPending}
      danger
    >
      <div className="flex items-start gap-[11px] rounded-xl border border-danger-line bg-danger-bg px-3.5 py-[13px]">
        <Avatar name={member?.nickname} src={member?.avatar_url} size={34} />
        <span className="min-w-0 flex-1 text-[12.5px] text-danger-ink-2 text-pretty">
          Remove {member?.nickname} from #{activeChannel?.name}? They can rejoin
          later with the invite code.
        </span>
      </div>
    </BaseModal>
  );
}
