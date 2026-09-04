import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ChatErrorBanner from "@/components/ai/ChatErrorBanner";

// Mock categorizeChatError to test pure component rendering without
// relying on external parsing utilities
vi.mock("@/lib/ai/errorMessages", () => ({
  categorizeChatError: vi.fn((err) => {
    const message = typeof err === "string" ? err : err?.message || "";

    if (message.includes("429") || message.toLowerCase().includes("rate limit")) {
      return {
        title: "Too many requests",
        description: "Please wait a moment and try again.",
      };
    }

    if (message.toLowerCase().includes("network")) {
      return {
        title: "Network connection lost",
        description: "Please check your internet connection and retry.",
      };
    }

    return {
      title: "Something went wrong",
      description: "An unexpected error occurred. Please try again.",
    };
  }),
}));

describe("ChatErrorBanner", () => {
  it("renders nothing when error is null or undefined", () => {
    const { container } = render(<ChatErrorBanner error={null} onRetry={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders with alert landmark role and correct accessibility attributes", () => {
    render(<ChatErrorBanner error={new Error("Generic error")} onRetry={vi.fn()} />);
    
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("displays rate-limit title and description when receiving a 429 error", () => {
    render(
      <ChatErrorBanner
        error={new Error("Rate limit exceeded (429)")}
        onRetry={vi.fn()}
      />
    );

    expect(screen.getByText("Too many requests")).toBeInTheDocument();
    expect(
      screen.getByText("Please wait a moment and try again.")
    ).toBeInTheDocument();
  });

  it("displays network failure information when a network error occurs", () => {
    render(
      <ChatErrorBanner
        error={new Error("Network offline")}
        onRetry={vi.fn()}
      />
    );

    expect(screen.getByText("Network connection lost")).toBeInTheDocument();
    expect(
      screen.getByText("Please check your internet connection and retry.")
    ).toBeInTheDocument();
  });

  it("fires onRetry handler when clicking 'Try Again'", async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();

    render(
      <ChatErrorBanner
        error={new Error("Temporary glitch")}
        onRetry={handleRetry}
      />
    );

    const retryButton = screen.getByRole("button", { name: /try again/i });
    await user.click(retryButton);

    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it("disables the retry button and prevents clicks when disabled prop is true", async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();

    render(
      <ChatErrorBanner
        error={new Error("Temporary glitch")}
        onRetry={handleRetry}
        disabled={true}
      />
    );

    const retryButton = screen.getByRole("button", { name: /try again/i });
    expect(retryButton).toBeDisabled();

    await user.click(retryButton);
    expect(handleRetry).not.toHaveBeenCalled();
  });
});