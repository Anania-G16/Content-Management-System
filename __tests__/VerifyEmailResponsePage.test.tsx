import React from "react";
import { render, waitFor } from "@testing-library/react";
import VerifyEmailPage from "@/app/verify-email/page"; // Adjust import path to your page file
import api from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";

// Mock Next.js navigation hooks and the API client
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("@/lib/api", () => ({
  post: jest.fn(),
}));

describe("VerifyEmailPage Component", () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });
  });

  it("redirects to error page when token is missing", async () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });

    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/verify-email/error");
    });
    expect(api.post).not.toHaveBeenCalled();
  });

  it("calls verification API and redirects to success page when token is valid", async () => {
    const testToken = "valid-token-123";
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(testToken),
    });
    (api.post as jest.Mock).mockResolvedValueOnce({});

    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/api/auth/verify-email", {
        token: testToken,
      });
      expect(mockReplace).toHaveBeenCalledWith("/verify-email/success");
    });
  });

  it("redirects to error page when verification API call fails", async () => {
    const testToken = "invalid-token-123";
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(testToken),
    });
    (api.post as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    // Suppress console.error during the expected failure test
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<VerifyEmailPage />);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/api/auth/verify-email", {
        token: testToken,
      });
      expect(mockReplace).toHaveBeenCalledWith("/verify-email/error");
    });

    consoleSpy.mockRestore();
  });
});