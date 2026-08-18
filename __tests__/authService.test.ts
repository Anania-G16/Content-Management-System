import api from "@/lib/api";
import {
  registerClient,
  changePassword,
  forgotPassword,
  resetPassword,
} from "@/app/services/authService";

jest.mock("@/lib/api", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe("authService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("registerClient", () => {
    it("registers a client with the correct payload", async () => {
      const payload = {
        fullName: "John Doe",
        email: "john@example.com",
        password: "password123",
      };

      const responseData = {
        message: "Registration successful",
      };

      mockedApi.post.mockResolvedValueOnce({
        data: responseData,
      } as any);

      const result = await registerClient(payload);

      expect(mockedApi.post).toHaveBeenCalledWith(
        "/api/auth/register",
        payload,
      );
      expect(result).toEqual(responseData);
    });
  });

  describe("changePassword", () => {
    it("changes the password with the correct payload", async () => {
      const payload = {
        currentPassword: "oldPassword",
        newPassword: "newPassword",
        confirmPassword: "newPassword",
      };

      const responseData = {
        message: "Password changed successfully",
      };

      mockedApi.post.mockResolvedValueOnce({
        data: responseData,
      } as any);

      const result = await changePassword(payload);

      expect(mockedApi.post).toHaveBeenCalledWith(
        "/api/auth/change-password",
        payload,
      );
      expect(result).toEqual(responseData);
    });
  });

  describe("forgotPassword", () => {
    it("sends the forgot-password request with the email", async () => {
      const payload = {
        email: "john@example.com",
      };

      const responseData = {
        message: "Reset email sent",
      };

      mockedApi.post.mockResolvedValueOnce({
        data: responseData,
      } as any);

      const result = await forgotPassword(payload);

      expect(mockedApi.post).toHaveBeenCalledWith(
        "/api/auth/forgot-password",
        payload,
      );
      expect(result).toEqual(responseData);
    });
  });

  describe("resetPassword", () => {
    it("resets the password with the token and new password", async () => {
      const payload = {
        token: "reset-token-123",
        newPassword: "newPassword123",
      };

      const responseData = {
        message: "Password reset successfully",
      };

      mockedApi.post.mockResolvedValueOnce({
        data: responseData,
      } as any);

      const result = await resetPassword(payload);

      expect(mockedApi.post).toHaveBeenCalledWith(
        "/api/auth/reset-password",
        payload,
      );
      expect(result).toEqual(responseData);
    });
  });
});