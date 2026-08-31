"use client";

// Shared motion tokens and the cross-fade primitive used by every
// state-driven button in this app. Durations/easings chosen once here
// so every button that uses them is provably the same system.

export const EASE_STANDARD = "cubic-bezier(0.4, 0, 0.2, 1)"; // brisk, no overshoot
export const EASE_SUCCESS_POP = "cubic-bezier(0.34, 1.56, 0.64, 1)"; // slight bounce

export function Face({ visible, children, hiddenTransform, duration = 200, ease = EASE_STANDARD, className = "" }) {
  return (
    <span
      style={{
        transitionProperty: "opacity, transform",
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: ease,
        transform: visible ? "translateY(0) scale(1)" : hiddenTransform,
      }}
      className={`absolute inset-0 flex items-center justify-center gap-1.5 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      } ${className}`}
    >
      {children}
    </span>
  );
}