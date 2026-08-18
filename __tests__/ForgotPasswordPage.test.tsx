import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPasswordPage from "@/app/forgot-password/page";
import { forgotPassword } from "@/app/services/authService";

// Mock the auth service
jest.mock("@/app/services/authService", () => ({
  forgotPassword: jest.fn(),
}));

describe("ForgotPasswordPage", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    // Silence console.error during expected error tests
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("renders the forgot password form correctly", () => {
    render(<ForgotPasswordPage />);

    expect(screen.getByRole("heading", { name: /forgot password\?/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("name@example.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
  });

  it("shows validation error if email input is empty on submit", async () => {
    render(<ForgotPasswordPage />);

    const submitButton = screen.getByRole("button", { name: /send reset link/i });
    fireEvent.click(submitButton);

    expect(screen.getByText("Please enter your email address.")).toBeInTheDocument();
    expect(forgotPassword).not.toHaveBeenCalled();
  });

  it("does not call forgotPassword API for invalid email format", async () => {
    render(<ForgotPasswordPage />);

    const emailInput = screen.getByPlaceholderText("name@example.com");
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    const submitButton = screen.getByRole("button", { name: /send reset link/i });
    fireEvent.click(submitButton);

    expect(forgotPassword).not.toHaveBeenCalled();
  });

  it("calls forgotPassword API and shows success state on valid submission", async () => {
    (forgotPassword as jest.Mock).mockResolvedValueOnce({});

    render(<ForgotPasswordPage />);

    const emailInput = screen.getByPlaceholderText("name@example.com");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /send reset link/i });
    fireEvent.click(submitButton);

    expect(screen.getByRole("button", { name: /sending link/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(forgotPassword).toHaveBeenCalledWith({ email: "test@example.com" });
    });

    await waitFor(() => {
      expect(screen.getByText(/a reset link has been sent/i)).toBeInTheDocument();
    });
  });

  it("handles API error gracefully and shows error message", async () => {
    (forgotPassword as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    render(<ForgotPasswordPage />);

    const emailInput = screen.getByPlaceholderText("name@example.com");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitButton = screen.getByRole("button", { name: /send reset link/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Failed to send reset link. Please try again later.")).toBeInTheDocument();
    });
  });
});