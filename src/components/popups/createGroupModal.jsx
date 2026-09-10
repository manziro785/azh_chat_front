import { useState } from "react";
import { BaseModal } from "./baseModal";
import { FormInput } from "../ui/formInput";
import { useCreateChannel } from "../../hooks/channel/useCreateChannel";
import { useChannelContext } from "../../hooks/channel/useChannelContext";
import { apiErrorMessage } from "../../lib/apiError";

export const CreateGroupModal = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState("");
  const [serverError, setServerError] = useState("");
  const { createChannel, isPending } = useCreateChannel();
  const { setActiveChannel } = useChannelContext();

  const reset = () => {
    setName("");
    setDescription("");
    setNameError("");
    setServerError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (name.trim().length < 3) {
      setNameError("At least 3 characters");
      return;
    }

    try {
      const data = await createChannel({
        name: name.trim(),
        description: description.trim(),
      });
      // Jump straight into the channel that was just created.
      if (data?.channel) setActiveChannel(data.channel);
      handleClose();
    } catch (error) {
      setServerError(apiErrorMessage(error, "Couldn't create the channel"));
    }
  };

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title="New channel"
      subtitle="You become its admin and get an invite code"
      error={serverError}
      onDismissError={() => setServerError("")}
      confirmLabel={isPending ? "Creating…" : "Create channel"}
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
        placeholder="e.g. design-team"
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
