import React from "react";
import { render, screen } from "@testing-library/react";
import VerifyEmailPage from "@/app/register/verify-email/page";
import { useSearchParams } from "next/navigation";

// Mock Next.js navigation hooks
jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));

describe("VerifyEmailPage Component", () => {
  const mockGet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue({
      get: mockGet,
    });
  });

  it("renders the verification page with the provided email address", () => {
    const testEmail = "alex@example.com";
    mockGet.mockReturnValue(testEmail);

    render(<VerifyEmailPage />);

    expect(screen.getByRole("heading", { name: /check your email/i })).toBeInTheDocument();
    expect(screen.getByText(testEmail)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /resend verification email/i })).toBeInTheDocument();
    
    const backLink = screen.getByRole("link", { name: /back to sign in/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/login");
  });

  it("renders the fallback email text when no email search parameter is provided", () => {
    mockGet.mockReturnValue(null);

    render(<VerifyEmailPage />);

    // Target the specific container box that displays the fallback text instead of the paragraph text
    const emailBox = screen.getByText("your email address", {
      selector: "div",
    });
    expect(emailBox).toBeInTheDocument();
  });

  it("renders resend button and spam folder helper text", () => {
    mockGet.mockReturnValue("test@example.com");

    render(<VerifyEmailPage />);

    expect(screen.getByRole("button", { name: /resend verification email/i })).toBeInTheDocument();
    expect(screen.getByText(/didn't receive the email\? check your spam or junk folder\./i)).toBeInTheDocument();
  });
});