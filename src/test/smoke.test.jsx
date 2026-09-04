import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

describe("test setup smoke check", () => {
  it("renders a button and finds it by its accessible name", () => {
    render(<button>Hello</button>);
    expect(screen.getByRole("button", { name: "Hello" })).toBeInTheDocument();
  });
});