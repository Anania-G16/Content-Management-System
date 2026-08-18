import React from "react";
import { render, screen } from "@testing-library/react";
import VerifyEmailErrorPage from "@/app/verify-email/error/page"; // Adjust import path as needed

describe("VerifyEmailErrorPage Component", () => {
  it("renders error heading, description, and navigation links correctly", () => {
    render(<VerifyEmailErrorPage />);

    // Check heading
    expect(
      screen.getByRole("heading", { name: /verification failed/i })
    ).toBeInTheDocument();

    // Check description text
    expect(
      screen.getByText(/this verification link is invalid or has expired/i)
    ).toBeInTheDocument();

    // Check 'Try Again' link
    const tryAgainLink = screen.getByRole("link", { name: /try again/i });
    expect(tryAgainLink).toBeInTheDocument();
    expect(tryAgainLink).toHaveAttribute("href", "/register/verify-email");

    // Check 'Back to Sign In' link
    const backToSignInLink = screen.getByRole("link", { name: /back to sign in/i });
    expect(backToSignInLink).toBeInTheDocument();
    expect(backToSignInLink).toHaveAttribute("href", "/login");
  });
});