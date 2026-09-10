// The backend generates admin codes WITH the hash already in them ("#ABC123"),
// and /channels/join matches on that exact string. These two keep the UI from
// either double-prefixing it or sending a code the server can't find.
export function withHash(code) {
  const value = String(code ?? "").trim();
  if (!value) return "";
  return value.startsWith("#") ? value : `#${value}`;
}

export function stripHash(code) {
  return String(code ?? "")
    .trim()
    .replace(/^#/, "");
}

export const INVITE_CODE_LENGTH = 6;
