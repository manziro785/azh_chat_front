// Ring spinner from the design. Takes its colour from the parent's text
// colour, so the same component works on the accent button and on the
// red "reconnecting" banner.
export default function Spinner({ size = 14, className = "" }) {
  return (
    <span
      style={{ width: size, height: size }}
      className={`inline-block flex-none rounded-full border-2 border-current border-t-transparent animate-az-spin ${className}`}
    />
  );
}
