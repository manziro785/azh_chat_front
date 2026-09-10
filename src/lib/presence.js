// The API has no "is_online" field. It gives users.last_seen, and the socket
// broadcasts user_status while we are connected. Anyone we have not seen a
// live event for falls back to their last_seen stamp, which is honest —
// better than the old code, which painted every member green unconditionally.
export function presenceLabel(isOnline, lastSeen) {
  if (isOnline) return "Online";
  if (!lastSeen) return "Offline";

  const date = new Date(lastSeen);
  if (Number.isNaN(date.getTime())) return "Offline";

  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "Last seen just now";
  if (minutes < 60) return `Last seen ${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Last seen ${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `Last seen ${days}d ago`;

  return `Last seen ${date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  })}`;
}
