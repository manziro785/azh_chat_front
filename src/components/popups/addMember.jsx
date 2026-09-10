import { useState } from "react";
import { Check } from "lucide-react";
import { BaseModal } from "./baseModal";
import { FormInput } from "../ui/formInput";
import Avatar from "../ui/avatar";
import Spinner from "../ui/spinner";
import { useAddMember } from "../../hooks/members/useAddMember";
import { useGetChannelMembers } from "../../hooks/members/useGetChannelMembers";
import { useSearchUsers } from "../../hooks/useSearchUsers";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { apiErrorMessage } from "../../lib/apiError";

export default function AddMember({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [serverError, setServerError] = useState("");

  const { addMember, isPending } = useAddMember();
  const debouncedQuery = useDebouncedValue(query.trim(), 300);
  const { data, isFetching } = useSearchUsers(debouncedQuery);
  const { data: membersData } = useGetChannelMembers();

  // Search returns everyone, including people already in this channel —
  // picking one of those is a guaranteed 409 from the server.
  const memberIds = new Set(
    (membersData?.members ?? []).map((m) => String(m.id))
  );

  const users = data?.users ?? [];
  const hasQuery = debouncedQuery.length > 0;
  const searching = hasQuery && isFetching;
  const noResults = hasQuery && !isFetching && users.length === 0;

  const handleClose = () => {
    setQuery("");
    setSelected(null);
    setServerError("");
    onClose();
  };

  const handleAdd = async () => {
    if (!selected) return;
    try {
      await addMember({ userId: selected.id, nickname: selected.nickname });
      handleClose();
    } catch (error) {
      setServerError(apiErrorMessage(error, "Couldn't add the member"));
    }
  };

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title="Add member"
      subtitle="Search by nickname"
      cancelLabel="Cancel"
      error={serverError}
      onDismissError={() => setServerError("")}
      confirmLabel={isPending ? "Adding…" : "Add member"}
      onConfirm={handleAdd}
      busy={isPending}
      confirmDisabled={!selected}
    >
      <FormInput
        label="Nickname"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelected(null);
        }}
        placeholder="Start typing…"
        disabled={isPending}
      />

      {/* Fixed min-height so the panel never jumps between its three states. */}
      <div className="min-h-[130px] rounded-xl border border-line-bubble bg-inset p-1.5">
        {searching && (
          <div className="flex h-[118px] items-center justify-center gap-[9px] text-[12.5px] text-muted">
            <Spinner className="text-accent" /> Searching…
          </div>
        )}

        {noResults && (
          <div className="flex h-[118px] flex-col items-center justify-center gap-1.5 px-5 text-center">
            <div className="text-[13px] font-semibold">No users found</div>
            <div className="text-[12px] text-muted text-pretty">
              Try the full nickname, or share the invite code instead.
            </div>
          </div>
        )}

        {!hasQuery && (
          <div className="flex h-[118px] items-center justify-center px-5 text-center text-[12px] text-muted">
            Start typing a nickname to find people.
          </div>
        )}

        {hasQuery &&
          !searching &&
          users.map((user) => {
            const picked = selected?.id === user.id;
            const alreadyMember = memberIds.has(String(user.id));

            return (
              <div
                key={user.id}
                onClick={() => !alreadyMember && setSelected(user)}
                className={`flex items-center gap-2.5 rounded-[10px] px-[9px] py-2 transition-colors ${
                  alreadyMember
                    ? "cursor-default opacity-55"
                    : picked
                      ? "cursor-pointer bg-[#182035]"
                      : "cursor-pointer hover:bg-[#181d27]"
                }`}
              >
                <Avatar name={user.nickname} src={user.avatar_url} size={30} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium">
                    {user.nickname}
                  </div>
                  <div className="truncate text-[11.5px] text-faint">
                    {user.email}
                  </div>
                </div>
                {alreadyMember ? (
                  <span className="flex-none text-[11px] text-faint">
                    Already in channel
                  </span>
                ) : (
                  <span
                    className={`grid h-[18px] w-[18px] flex-none place-items-center rounded-full border-[1.5px] ${
                      picked
                        ? "border-accent bg-accent text-white"
                        : "border-line-dashed"
                    }`}
                  >
                    {picked && (
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    )}
                  </span>
                )}
              </div>
            );
          })}
      </div>
    </BaseModal>
  );
}
