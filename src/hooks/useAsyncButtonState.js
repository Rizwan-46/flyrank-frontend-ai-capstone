"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Generic state machine for a button driving a real (or fake) async action.
 * Phases: "idle" | "loading" | "success" | "error".
 *
 * Guards against race conditions from spam-clicking or a stale response
 * resolving after a newer attempt has started, via a generation counter —
 * only the most recent attempt is ever allowed to update state.
 */
export function useAsyncButtonState({ successHoldMs = 900 } = {}) {
  const [phase, setPhase] = useState("idle");
  const [attempt, setAttempt] = useState(0);
  const attemptRef = useRef(0);
  const timeoutRef = useRef(null);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const run = useCallback(
    async (action) => {
      // Ignore clicks while genuinely busy or just after a success — this
      // is the "must not break under spam-clicking" guarantee. Error state
      // stays clickable on purpose: that click IS the retry action.
      if (phase === "loading" || phase === "success") return;

      clearTimeout(timeoutRef.current);
      const attemptId = ++attemptRef.current;
      setAttempt(attemptId);
      setPhase("loading");

      try {
        await action();
        if (attemptRef.current !== attemptId) return; // superseded, ignore
        setPhase("success");
        timeoutRef.current = setTimeout(() => {
          if (attemptRef.current === attemptId) setPhase("idle");
        }, successHoldMs);
      } catch {
        if (attemptRef.current !== attemptId) return; // superseded, ignore
        setPhase("error");
      }
    },
    [phase, successHoldMs]
  );

  return { phase, attempt, run };
}