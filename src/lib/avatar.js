// Avatars in the redesign are a letter on a gradient. The gradient is picked
// from the name, so the same person keeps the same colour everywhere.

const GRADIENTS = [
  "linear-gradient(140deg,#8fb0ff,#5b83ff)",
  "linear-gradient(140deg,#ffb08f,#ff6f9c)",
  "linear-gradient(140deg,#8fe6c8,#2fb6a0)",
  "linear-gradient(140deg,#c9a0ff,#8a6bff)",
  "linear-gradient(140deg,#ffd98f,#ff9f5b)",
  "linear-gradient(140deg,#9ad9ff,#5bb8ff)",
];

export function gradientFor(seed) {
  const text = String(seed ?? "");
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) % 9973;
  }
  return GRADIENTS[hash % GRADIENTS.length];
}

export function initialOf(value) {
  return String(value ?? "?")
    .trim()
    .charAt(0)
    .toUpperCase();
}
