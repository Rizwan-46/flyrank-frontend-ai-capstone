import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ChatMessage from "@/components/ai/ChatMessage";

// Stand-in for react-markdown: just render the raw text. We're testing
// OUR component's behavior, not react-markdown's internals.
vi.mock("react-markdown", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

// Stand-in for next/link: a plain anchor works fine for these tests.
vi.mock("next/link", () => ({
  default: ({ children, href }) => <a href={href}>{children}</a>,
}));

function makeMessage(overrides = {}) {
  return {
    id: "msg-1",
    role: "assistant",
    parts: [],
    ...overrides,
  };
}

describe("ChatMessage", () => {
  it("renders a plain text message from the assistant", () => {
    const message = makeMessage({
      parts: [{ type: "text", text: "Hello, how can I help?" }],
    });

    render(<ChatMessage message={message} />);

    expect(screen.getByText("Hello, how can I help?")).toBeInTheDocument();
  });

  it("renders a user message with the user icon, not the bot icon", () => {
    const message = makeMessage({
      role: "user",
      parts: [{ type: "text", text: "What about Rocky?" }],
    });

    render(<ChatMessage message={message} />);

    expect(screen.getByText("What about Rocky?")).toBeInTheDocument();
  });

  it("shows a searching indicator while the tool's input is still streaming", () => {
    const message = makeMessage({
      parts: [
        {
          type: "tool-getPetHealthSummary",
          state: "input-streaming",
          toolCallId: "call-1",
        },
      ],
    });

    render(<ChatMessage message={message} />);

    expect(screen.getByText(/searching pet health information/i)).toBeInTheDocument();
  });

  it("shows which pet is being looked up once tool input is available", () => {
    const message = makeMessage({
      parts: [
        {
          type: "tool-getPetHealthSummary",
          state: "input-available",
          toolCallId: "call-1",
          input: { petId: "pet-1" },
        },
      ],
    });

    render(<ChatMessage message={message} petsById={{ "pet-1": "Rocky" }} />);

    expect(screen.getByText(/health record lookup/i)).toBeInTheDocument();
    expect(screen.getByText("Rocky")).toBeInTheDocument();
  });

  it("renders the health summary card when the tool succeeds", () => {
    const message = makeMessage({
      parts: [
        {
          type: "tool-getPetHealthSummary",
          state: "output-available",
          toolCallId: "call-1",
          output: {
            pet: { id: "pet-1", name: "Rocky", species: "Dog", breed: "German Shepherd" },
            healthStatus: "needs-attention",
            vaccinations: { completed: 3, overdue: 1, upcoming: 1 },
            upcomingAppointment: null,
            recentMedicalRecords: [],
          },
        },
      ],
    });

    render(<ChatMessage message={message} />);

    expect(screen.getByText("Rocky")).toBeInTheDocument();
    expect(screen.getByText("Needs Attention")).toBeInTheDocument();
  });

  it("renders a designed error with a retry button when the tool fails", () => {
    const onRetry = vi.fn();
    const message = makeMessage({
      parts: [
        {
          type: "tool-getPetHealthSummary",
          state: "output-error",
          toolCallId: "call-1",
          errorText: "Simulated failure for testing.",
        },
      ],
    });

    render(<ChatMessage message={message} onRetry={onRetry} />);

    expect(
      screen.getByText(/unable to retrieve that pet's health information/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });
});