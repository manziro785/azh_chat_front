// Turns a flat message list into what the design's feed renders:
// day dividers, and consecutive messages by one author merged into a single
// group with several bubbles (one avatar, one timestamp per group).

const GROUP_WINDOW_MS = 5 * 60 * 1000;

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function dayLabel(date) {
  const today = startOfDay(new Date());
  const day = startOfDay(date);
  const dayMs = 24 * 60 * 60 * 1000;

  if (day === today) return "Today";
  if (day === today - dayMs) return "Yesterday";

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    ...(date.getFullYear() === new Date().getFullYear()
      ? {}
      : { year: "numeric" }),
  });
}

export function timeLabel(date) {
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function buildFeed(messages, currentUserId) {
  const items = [];
  let lastDay = null;
  let group = null;

  for (const message of messages) {
    const date = message.createdAt ? new Date(message.createdAt) : null;
    const valid = date && !Number.isNaN(date.getTime());
    const day = valid ? startOfDay(date) : null;

    if (valid && day !== lastDay) {
      items.push({ kind: "day", key: `day-${day}`, label: dayLabel(date) });
      lastDay = day;
      group = null;
    }

    const mine =
      !!currentUserId && String(message.senderId) === String(currentUserId);

    const continues =
      group &&
      group.senderId === message.senderId &&
      valid &&
      group.lastAt !== null &&
      date.getTime() - group.lastAt <= GROUP_WINDOW_MS;

    if (continues) {
      group.bubbles.push({ id: message.id, text: message.content });
      group.lastAt = date.getTime();
      continue;
    }

    group = {
      kind: "group",
      key: `group-${message.id}`,
      senderId: message.senderId,
      nick: mine ? "You" : message.senderNickname,
      avatarName: message.senderNickname,
      avatarUrl: message.senderAvatar,
      mine,
      time: valid ? timeLabel(date) : "",
      lastAt: valid ? date.getTime() : null,
      bubbles: [{ id: message.id, text: message.content }],
    };
    items.push(group);
  }

  return items;
}
