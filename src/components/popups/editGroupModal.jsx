import { useState } from "react";
import { BaseModal } from "./baseModal";
import { FormInput } from "../ui/formInput";
import { useUpdateChannel } from "../../hooks/channel/useUpdateChannel";
import { useChannelContext } from "../../hooks/channel/useChannelContext";
import { apiErrorMessage } from "../../lib/apiError";

export const EditGroupModal = ({ open, onClose }) => {
  const { activeChannel } = useChannelContext();
  const { updateChannel, isPending } = useUpdateChannel();

  // Mounted only while open (see Dashboard), so the fields can be seeded once
  // from the channel instead of being kept in sync by an effect.
  const [name, setName] = useState(() => activeChannel?.name ?? "");
  const [description, setDescription] = useState(
    () => activeChannel?.description ?? ""
  );
  const [nameError, setNameError] = useState("");
  const [serverError, setServerError] = useState("");

  if (!activeChannel) return null;

  const handleSubmit = async () => {
    if (name.trim().length < 3) {
      setNameError("At least 3 characters");
      return;
    }

    try {
      await updateChannel({
        idChannel: activeChannel.id,
        channelData: { name: name.trim(), description: description.trim() },
      });
      onClose();
    } catch (error) {
      setServerError(apiErrorMessage(error, "Couldn't update the channel"));
    }
  };

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Edit channel"
      subtitle="Admins only"
      cancelLabel="Cancel"
      error={serverError}
      onDismissError={() => setServerError("")}
      confirmLabel={isPending ? "Saving…" : "Save"}
      onConfirm={handleSubmit}
      busy={isPending}
    >
      <FormInput
        label="Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setNameError("");
        }}
        placeholder="Channel name"
        error={nameError}
        disabled={isPending}
      />
      <FormInput
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What is it about?"
        disabled={isPending}
      />
    </BaseModal>
  );
};
