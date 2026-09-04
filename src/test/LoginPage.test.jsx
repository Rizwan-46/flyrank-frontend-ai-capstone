import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginPage from "@/app/(auth)/login/page";
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

// Mock authStore hook
vi.mock("@/store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

describe("LoginPage", () => {
  let mockPush;
  let mockReplace;
  let mockLogin;

  beforeEach(() => {
    mockPush = vi.fn();
    mockReplace = vi.fn();
    mockLogin = vi.fn();

    useRouter.mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });

    useAuthStore.mockImplementation((selector) =>
      selector({
        login: mockLogin,
        isAuthenticated: false,
        hasHydrated: true,
      })
    );
  });

  it("renders page header, prefilled inputs, and submit button", () => {
    render(<LoginPage />);

  expect(
      screen.getByText(/log in to your account/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toHaveValue("james@example.com");
    expect(screen.getByLabelText(/password/i)).toHaveValue("Password123");
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute(
      "href",
      "/signup"
    );
  });

  it("redirects to /dashboard if already authenticated and hydrated", () => {
    useAuthStore.mockImplementation((selector) =>
      selector({
        login: mockLogin,
        isAuthenticated: true,
        hasHydrated: true,
      })
    );

    render(<LoginPage />);

    expect(mockReplace).toHaveBeenCalledWith("/dashboard");
  });

  it("displays client-side validation errors when inputs are blank", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.clear(emailInput);
    await user.clear(passwordInput);

    const submitButton = screen.getByRole("button", { name: /log in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(emailInput).toHaveAttribute("aria-invalid", "true");
      expect(passwordInput).toHaveAttribute("aria-invalid", "true");
    });
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("displays server error message when login fails", async () => {
    const user = userEvent.setup();
    mockLogin.mockReturnValue({
      success: false,
      error: "Invalid email or password.",
    });

    render(<LoginPage />);

    const submitButton = screen.getByRole("button", { name: /log in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Invalid email or password.")
      ).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("submits valid credentials and navigates to /dashboard on success", async () => {
    const user = userEvent.setup();
    mockLogin.mockReturnValue({
      success: true,
    });

    render(<LoginPage />);

    const submitButton = screen.getByRole("button", { name: /log in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "james@example.com",
        password: "Password123",
      });
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });
});