import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "@/app/register/page";
import { registerClient } from "@/app/services/authService";
import { useRouter } from "next/navigation";
import axios from "axios";

// Mock Next.js navigation hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the auth service
jest.mock("@/app/services/authService", () => ({
  registerClient: jest.fn(),
}));

// Mock child components that might use complex contexts or icons
jest.mock("@/components/Header", () => () => <div data-testid="mock-header" />);
jest.mock("@/components/Sidebar", () => () => <div data-testid="mock-sidebar" />);

describe("RegisterPage Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("renders all form fields and action buttons correctly", () => {
    render(<RegisterPage />);

    expect(screen.getByRole("heading", { name: /create an account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("toggles password visibility when the eye icons are clicked", async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    expect(passwordInput).toHaveAttribute("type", "password");
    expect(confirmPasswordInput).toHaveAttribute("type", "password");

    // Click show password for main password field
    const toggleButtons = screen.getAllByRole("button", { name: /show password/i });
    await user.click(toggleButtons[0]);

    expect(passwordInput).toHaveAttribute("type", "text");

    // Click show password for confirm password field
    await user.click(toggleButtons[1]);
    expect(confirmPasswordInput).toHaveAttribute("type", "text");
  });

  it("shows an error message if passwords do not match", async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/full name/i), "Alex Rivera");
    await user.type(screen.getByLabelText(/email address/i), "alex@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Password123!");
    await user.type(screen.getByLabelText(/confirm password/i), "DifferentPassword");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(screen.getByText(/passwords do not match\./i)).toBeInTheDocument();
    expect(registerClient).not.toHaveBeenCalled();
  });

  it("successfully registers a user, shows loading state, and redirects", async () => {
    const user = userEvent.setup();
    let resolveRegister: (value: any) => void = () => {};
    const registerPromise = new Promise((resolve) => {
      resolveRegister = resolve;
    });
    (registerClient as jest.Mock).mockReturnValueOnce(registerPromise);

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/full name/i), "Alex Rivera");
    await user.type(screen.getByLabelText(/email address/i), "alex@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Password123!");
    await user.type(screen.getByLabelText(/confirm password/i), "Password123!");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    const submitButton = screen.getByRole("button", { name: /creating account\.\.\./i });
    expect(submitButton).toBeDisabled();

    resolveRegister({ success: true });

    await waitFor(() => {
      expect(registerClient).toHaveBeenCalledWith({
        fullName: "Alex Rivera",
        email: "alex@example.com",
        password: "Password123!",
      });
      expect(mockPush).toHaveBeenCalledWith(
        `/register/verify-email?email=${encodeURIComponent("alex@example.com")}`
      );
    });
  });

  it("displays custom API error message when axios request fails", async () => {
    const user = userEvent.setup();
    const errorMessage = "Email is already registered.";
    
    const axiosError = {
      isAxiosError: true,
      response: {
        data: { message: errorMessage },
      },
    };

    jest.spyOn(axios, "isAxiosError").mockReturnValue(true);
    (registerClient as jest.Mock).mockRejectedValueOnce(axiosError);

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/full name/i), "Alex Rivera");
    await user.type(screen.getByLabelText(/email address/i), "alex@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Password123!");
    await user.type(screen.getByLabelText(/confirm password/i), "Password123!");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("displays fallback error message on generic or non-axios failures", async () => {
    const user = userEvent.setup();

    jest.spyOn(axios, "isAxiosError").mockReturnValue(false);
    (registerClient as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/full name/i), "Alex Rivera");
    await user.type(screen.getByLabelText(/email address/i), "alex@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Password123!");
    await user.type(screen.getByLabelText(/confirm password/i), "Password123!");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/registration failed\. please try again\./i)).toBeInTheDocument();
    });
  });
});