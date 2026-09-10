// The backend answers with { error: "..." } on every failure path.
// The old code read data.message, which is always undefined — hence the
// useless "Failed to ..." fallbacks everywhere.
export function apiErrorMessage(error, fallback = "Something went wrong") {
  const data = error?.response?.data;
  return data?.error || data?.message || error?.message || fallback;
}
