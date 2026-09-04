import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import AsyncActionButton from "@/components/ui/async-action-button";

// Lets a test manually control exactly when a fake async action
// resolves or rejects, instead of guessing at real delays.
function createControllablePromise() {
  let resolveFn;
  let rejectFn;
  const promise = new Promise((resolve, reject) => {
    resolveFn = resolve;
    rejectFn = reject;
  });
  return { promise, resolve: resolveFn, reject: rejectFn };
}

describe("AsyncActionButton", () => {
  it("shows the idle label before anything is clicked", () => {
    render(<AsyncActionButton idleLabel="Send" onAction={() => Promise.resolve()} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
  });

  it("shows a loading state while the action is in progress", async () => {
    const user = userEvent.setup();
    const control = createControllablePromise();

    render(<AsyncActionButton idleLabel="Send" onAction={() => control.promise} />);

    await user.click(screen.getByRole("button"));

    expect(await screen.findByText("Working…")).toBeInTheDocument();

    control.resolve();
    await waitFor(() => expect(screen.getByText("Success")).toBeInTheDocument());
  });

  it("shows success feedback after the action resolves, then returns to idle", async () => {
    const user = userEvent.setup();
    const control = createControllablePromise();

    render(
      <AsyncActionButton idleLabel="Send" onAction={() => control.promise} successHoldMs={50} />
    );

    await user.click(screen.getByRole("button"));
    control.resolve();

    expect(await screen.findByText("Success")).toBeInTheDocument();

    // successHoldMs is short in this test, so simply waiting for real
    // time to pass is fast and reliable — no fake timers involved.
    await waitFor(() => expect(screen.getByText("Send")).toBeInTheDocument(), {
      timeout: 1000,
    });
  });

  it("shows the retry label after the action fails, and it does not auto-revert", async () => {
    const user = userEvent.setup();
    const control = createControllablePromise();

    render(
      <AsyncActionButton idleLabel="Send" errorLabel="Retry" onAction={() => control.promise} />
    );

    await user.click(screen.getByRole("button"));
    control.reject(new Error("Simulated failure"));

    expect(await screen.findByText("Retry")).toBeInTheDocument();

    // Confirm it does NOT auto-revert like success does — give it a
    // moment and check it's still showing Retry.
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("ignores extra clicks while an action is already in progress", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn(() => new Promise(() => {})); // never resolves, on purpose

    render(<AsyncActionButton idleLabel="Send" onAction={onAction} />);

    const button = screen.getByRole("button");
    await user.click(button);
    await user.click(button);
    await user.click(button);

    expect(onAction).toHaveBeenCalledTimes(1);
  });
});