"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, Save, ArrowRight } from "lucide-react";
import AsyncActionButton from "@/components/ui/async-action-button";

function fakeAsyncCall(outcomeMode) {
  return new Promise((resolve, reject) => {
    const delay = 600 + Math.random() * 900; // 600–1500ms
    setTimeout(() => {
      const shouldFail =
        outcomeMode === "error" || (outcomeMode === "random" && Math.random() < 0.2);
      if (shouldFail) reject(new Error("Simulated failure"));
      else resolve();
    }, delay);
  });
}

export default function ButtonDemoPage() {
  const [outcomeMode, setOutcomeMode] = useState("random");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold text-foreground">
        Buttons with a Brain — Motion Demo
      </h1>
      <p className="mt-2 text-muted-foreground">
        A button that communicates its own lifecycle through motion:
        idle → loading → success/error → back to idle.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <p className="text-sm font-medium text-foreground">
          Force the next attempt to:
        </p>
        <div className="mt-3 flex gap-4 text-sm">
          {["random", "success", "error"].map((mode) => (
            <label key={mode} className="flex items-center gap-1.5">
              <input
                type="radio"
                name="outcome"
                checked={outcomeMode === mode}
                onChange={() => setOutcomeMode(mode)}
              />
              {mode === "random" ? "Random (~20% fail)" : mode === "success" ? "Always succeed" : "Always fail"}
            </label>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <AsyncActionButton
            idleLabel="Send"
            idleIcon={Send}
            onAction={() => fakeAsyncCall(outcomeMode)}
          />

          <AsyncActionButton
            idleLabel="Save"
            idleIcon={Save}
            onAction={() => fakeAsyncCall("random")}
            widthClassName="w-28"
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Second button always uses the random ~20% failure rate — proving
          both share the same motion system independently.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <p className="text-sm text-foreground">
          This same motion system is also used for real in the app&apos;s Send
          button on the{" "}
          <Link href="/dashboard/ai-assistant" className="font-medium text-primary underline">
            AI Assistant page
          </Link>
          . There, &quot;loading&quot; is the actual Stop control — it stays
          interruptible rather than becoming a disabled spinner, since
          disabling input mid-generation would remove a real feature.
          Success and error there are driven by the chat&apos;s real
          completion status, not a fake timer like the demo above.
        </p>
        <Link
          href="/dashboard/ai-assistant"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Try it on the AI Assistant page
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-8 space-y-3 text-sm text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">
          Duration &amp; easing choices
        </h2>
        <p>
          <strong className="text-foreground">Idle ↔ loading (200ms, standard ease):</strong>{" "}
          brisk enough to feel like an immediate response to the click, with
          no overshoot — this is just a state change, not a celebration.
        </p>
        <p>
          <strong className="text-foreground">Spinner rotation (linear, continuous):</strong>{" "}
          eased rotation looks mechanically wrong for something meant to feel
          constant and ongoing; linear is the only honest choice here.
        </p>
        <p>
          <strong className="text-foreground">Loading → success (250ms, back-out overshoot):</strong>{" "}
          a slight bounce past 100% scale before settling gives the checkmark
          a small "pop," reinforcing a positive outcome — success is the one
          moment worth spending a little extra personality on.
        </p>
        <p>
          <strong className="text-foreground">Loading → error (200ms fade) + one shake (400ms):</strong>{" "}
          the shake is a single, short burst — long enough to read as "no,"
          short enough not to feel like a stuck or broken animation. Error
          state doesn&apos;t auto-revert; the user must act (Retry), so they
          can&apos;t miss that something failed.
        </p>
        <p>
          <strong className="text-foreground">Reduced motion:</strong> the
          shake is removed entirely, the spinner switches from rotation to a
          slow opacity pulse, and the success bounce becomes a plain fade —
          color and icon changes still carry the feedback either way.
        </p>
      </div>
    </div>
  );
}