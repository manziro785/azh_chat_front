import { useState } from "react";
import { BaseModal } from "./baseModal";
import { useDeleteChannel } from "../../hooks/channel/useDeleteChannel";
import { useChannelContext } from "../../hooks/channel/useChannelContext";
import { apiErrorMessage } from "../../lib/apiError";

export default function DeleteChannel({ open, onClose }) {
  const { deleteChannel, isPending } = useDeleteChannel();
  const { activeChannel } = useChannelContext();
  const [serverError, setServerError] = useState("");

  const handleDelete = async () => {
    try {
      await deleteChannel({
        channelId: activeChannel.id,
        name: activeChannel.name,
      });
      onClose();
    } catch (error) {
      setServerError(apiErrorMessage(error, "Couldn't delete the channel"));
    }
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Delete channel?"
      subtitle="This cannot be undone"
      cancelLabel="Cancel"
      error={serverError}
      onDismissError={() => setServerError("")}
      confirmLabel={isPending ? "Deleting…" : "Delete channel"}
      onConfirm={handleDelete}
      busy={isPending}
      danger
    >
      <div className="rounded-xl border border-danger-line bg-danger-bg px-3.5 py-[13px] text-[12.5px] text-danger-ink-2 text-pretty">
        All messages and members of #{activeChannel?.name} will be deleted
        permanently.
      </div>
    </BaseModal>
  );
}
