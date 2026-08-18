import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetPasswordPage from "@/app/reset-password/ResetPasswordClient";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/app/services/authService";

// Mock Next.js navigation hooks and auth service
jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

jest.mock("@/app/services/authService", () => ({
  resetPassword: jest.fn(),
}));

describe("ResetPasswordPage Component", () => {
  const mockGet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as unknown as jest.Mock).mockReturnValue({
      get: mockGet,
    });
  });

  it("renders invalid reset link state when token is missing", () => {
    mockGet.mockReturnValue(null);

    render(<ResetPasswordPage />);

    expect(
      screen.getByRole("heading", { name: /invalid reset link/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/token is missing or invalid/i),
    ).toBeInTheDocument();

    const requestLink = screen.getByRole("link", {
      name: /request new reset link/i,
    });
    expect(requestLink).toBeInTheDocument();
    expect(requestLink).toHaveAttribute("href", "/forgot-password");

    const backLink = screen.getByRole("link", { name: /back to sign in/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/login");
  });

  it("renders the reset password form when a valid token is provided", () => {
    mockGet.mockReturnValue("valid-token-123");

    render(<ResetPasswordPage />);

    expect(
      screen.getByRole("heading", { name: /^reset password$/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^new password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^confirm password$/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^reset password$/i }),
    ).toBeInTheDocument();
  });

  it("toggles password visibility when the eye buttons are clicked", () => {
    mockGet.mockReturnValue("valid-token-123");

    render(<ResetPasswordPage />);

    const passwordInput = screen.getByLabelText(/^new password$/i);
    const toggleButton = screen.getByRole("button", {
      name: /show new password/i,
    });
    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("displays validation error when passwords do not match", async () => {
    mockGet.mockReturnValue("valid-token-123");

    render(<ResetPasswordPage />);

    const passwordInput = screen.getByLabelText(/^new password$/i);
    const confirmPasswordInput = screen.getByLabelText(/^confirm password$/i);
    const submitButton = screen.getByRole("button", {
      name: /^reset password$/i,
    });

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "differentpassword" },
    });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(/passwords do not match/i),
    ).toBeInTheDocument();
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it("successfully resets the password and displays success message", async () => {
    mockGet.mockReturnValue("valid-token-123");
    (resetPassword as unknown as jest.Mock).mockResolvedValueOnce({});

    render(<ResetPasswordPage />);

    const passwordInput = screen.getByLabelText(/^new password$/i);
    const confirmPasswordInput = screen.getByLabelText(/^confirm password$/i);
    const submitButton = screen.getByRole("button", {
      name: /^reset password$/i,
    });

    fireEvent.change(passwordInput, {
      target: { value: "newSecurePassword123" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "newSecurePassword123" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith({
        token: "valid-token-123",
        newPassword: "newSecurePassword123",
      });
    });

    expect(
      await screen.findByText(/your password has been successfully reset/i),
    ).toBeInTheDocument();

    const signInButton = screen.getByRole("link", { name: /sign in now/i });
    expect(signInButton).toBeInTheDocument();
    expect(signInButton).toHaveAttribute("href", "/login");
  });

  it("displays error message when password reset fails", async () => {
    mockGet.mockReturnValue("expired-token-456");
    (resetPassword as unknown as jest.Mock).mockRejectedValueOnce(
      new Error("Expired token"),
    );

    render(<ResetPasswordPage />);

    const passwordInput = screen.getByLabelText(/^new password$/i);
    const confirmPasswordInput = screen.getByLabelText(/^confirm password$/i);
    const submitButton = screen.getByRole("button", {
      name: /^reset password$/i,
    });

    fireEvent.change(passwordInput, {
      target: { value: "newSecurePassword123" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "newSecurePassword123" },
    });
    fireEvent.click(submitButton);

    expect(
      await screen.findByText(
        /failed to reset password\. the link may have expired\./i,
      ),
    ).toBeInTheDocument();
  });
});
