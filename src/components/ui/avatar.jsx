import { useState } from "react";
import { gradientFor, initialOf } from "../../lib/avatar";

// One avatar for the whole app: a letter on a name-derived gradient, or the
// uploaded picture when the backend has an avatar_url for that row.
// `radius` is a CSS value because the design uses circles for people and
// rounded squares for channels.
export default function Avatar({
  name,
  src,
  size = 32,
  radius = "50%",
  className = "",
  dimmed = false,
}) {
  // avatar_url is a free-text URL the user typed, so it can 404 or be blocked.
  // Remember which src failed instead of a plain boolean, so a later, working
  // src still renders without needing an effect to reset the flag.
  const [failedSrc, setFailedSrc] = useState(null);

  const box = {
    width: size,
    height: size,
    borderRadius: radius,
    opacity: dimmed ? 0.55 : 1,
  };

  if (src && failedSrc !== src) {
    return (
      <img
        src={src}
        alt={name || ""}
        style={box}
        onError={() => setFailedSrc(src)}
        className={`flex-none object-cover ${className}`}
      />
    );
  }

  return (
    <div
      style={{
        ...box,
        backgroundImage: gradientFor(name),
        fontSize: Math.round(size * 0.4),
      }}
      className={`flex-none grid place-items-center font-semibold text-canvas ${className}`}
    >
      {initialOf(name)}
    </div>
  );
}
