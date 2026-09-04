import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SignupPage from "@/app/(auth)/signup/page";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href, className }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

// Mock authStore
vi.mock("@/store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

describe("SignupPage", () => {
  let mockPush;
  let mockReplace;
  let mockSignup;

  beforeEach(() => {
    mockPush = vi.fn();
    mockReplace = vi.fn();
    mockSignup = vi.fn();

    useRouter.mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });

    useAuthStore.mockImplementation((selector) =>
      selector({
        signup: mockSignup,
        isAuthenticated: false,
        hasHydrated: true,
      })
    );
  });

  it("renders the signup form with all input fields and the sign up button", () => {
    render(<SignupPage />);

    expect(screen.getByText("Create an account")).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute(
      "href",
      "/login"
    );
  });

  it("redirects to /dashboard if the user is already authenticated", () => {
    useAuthStore.mockImplementation((selector) =>
      selector({
        signup: mockSignup,
        isAuthenticated: true,
        hasHydrated: true,
      })
    );

    render(<SignupPage />);

    expect(mockReplace).toHaveBeenCalledWith("/dashboard");
  });

  it("displays client-side validation errors when submitting an empty form", async () => {
    const user = userEvent.setup();
    render(<SignupPage />);

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toHaveAttribute(
        "aria-invalid",
        "true"
      );
      expect(screen.getByLabelText(/^email$/i)).toHaveAttribute(
        "aria-invalid",
        "true"
      );
      expect(screen.getByLabelText(/^password$/i)).toHaveAttribute(
        "aria-invalid",
        "true"
      );
    });
    expect(mockSignup).not.toHaveBeenCalled();
  });

  it("displays server error alert when signup registration fails", async () => {
    const user = userEvent.setup();
    mockSignup.mockReturnValue({
      success: false,
      error: "An account with this email already exists.",
    });

    render(<SignupPage />);

    await user.type(screen.getByLabelText(/full name/i), "John Doe");
    await user.type(screen.getByLabelText(/^email$/i), "john@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Password123!");
    await user.type(
      screen.getByLabelText(/confirm password/i),
      "Password123!"
    );

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("An account with this email already exists.")
      ).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("submits valid credentials and navigates to /dashboard on successful registration", async () => {
    const user = userEvent.setup();
    mockSignup.mockReturnValue({ success: true });

    render(<SignupPage />);

    await user.type(screen.getByLabelText(/full name/i), "John Doe");
    await user.type(screen.getByLabelText(/^email$/i), "john@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Password123!");
    await user.type(
      screen.getByLabelText(/confirm password/i),
      "Password123!"
    );

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        password: "Password123!",
        confirmPassword: "Password123!",
      });
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });
});
