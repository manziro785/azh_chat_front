// The two sources of messages disagree on field names:
//   REST  /channels/:id/messages -> sender_id, sender_nickname, created_at
//   socket "new_message"         -> senderId,  senderNickname,  createdAt
// Everything above this line reads one shape.
export function normalizeMessage(raw) {
  return {
    id: raw.id,
    senderId: String(raw.sender_id ?? raw.senderId ?? ""),
    senderNickname: raw.sender_nickname ?? raw.senderNickname ?? "Unknown",
    senderAvatar: raw.sender_avatar ?? raw.senderAvatar ?? null,
    content: raw.content ?? "",
    createdAt: raw.created_at ?? raw.createdAt ?? null,
  };
}
