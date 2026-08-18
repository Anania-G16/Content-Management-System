import React from "react";
import { render, screen } from "@testing-library/react";
import VerifyEmailSuccessPage from "@/app/verify-email/success/page"; // Adjust import path as needed

describe("VerifyEmailSuccessPage Component", () => {
  it("renders success message and continue link correctly", () => {
    render(<VerifyEmailSuccessPage />);

    expect(
      screen.getByRole("heading", { name: /email verified!/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/your email address has been successfully verified/i)
    ).toBeInTheDocument();

    const linkElement = screen.getByRole("link", { name: /continue to sign in/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", "/login");
  });
});