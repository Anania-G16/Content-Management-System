import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfilePage from "@/app/profile/page";
import { useAuth } from "@/context/AuthContext";
import { changePassword } from "@/app/services/authService";
import { toast } from "react-toastify";

// Mock dependencies
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/app/services/authService", () => ({
  changePassword: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("ProfilePage", () => {
  let consoleErrorSpy: jest.SpyInstance;

  const mockUser = {
    fullName: "Anex Bejiga",
    email: "anex@example.com",
    role: "Developer",
    isActive: true,
    isEmailVerified: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-06-01T00:00:00.000Z",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("renders loading state when isLoading is true", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: true,
      isAuthenticated: false,
    });

    render(<ProfilePage />);

    expect(screen.getByText(/loading profile\.\.\./i)).toBeInTheDocument();
  });

  it("renders access denied view when unauthenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });

    render(<ProfilePage />);

    expect(screen.getByRole("heading", { name: /access denied/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute("href", "/login");
  });

  it("renders user profile data correctly when authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoading: false,
      isAuthenticated: true,
    });

    render(<ProfilePage />);

    expect(screen.getByRole("heading", { name: "Anex Bejiga" })).toBeInTheDocument();
    expect(screen.getAllByText("anex@example.com")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Developer")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Active")[0]).toBeInTheDocument();
    expect(screen.getByText("Verified")).toBeInTheDocument();
    expect(screen.getByText("January 1, 2026")).toBeInTheDocument();
    expect(screen.getByText("June 1, 2026")).toBeInTheDocument();
  });

  it("validates password form fields and displays error messages on blur/submit", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoading: false,
      isAuthenticated: true,
    });

    render(<ProfilePage />);

    const currentPasswordInput = screen.getByLabelText(/^current password/i);
    const newPasswordInput = screen.getByLabelText(/^new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);

    fireEvent.blur(currentPasswordInput);
    fireEvent.blur(newPasswordInput);
    fireEvent.blur(confirmPasswordInput);

    const updatePasswordButton = screen.getByRole("button", { name: /update password/i });
    fireEvent.click(updatePasswordButton);

    expect(await screen.findByText(/current password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/new password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/please confirm your new password/i)).toBeInTheDocument();
    expect(changePassword).not.toHaveBeenCalled();
  });

  it("validates minimum password length and mismatched confirmations", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoading: false,
      isAuthenticated: true,
    });

    render(<ProfilePage />);

    const currentPasswordInput = screen.getByLabelText(/^current password/i);
    const newPasswordInput = screen.getByLabelText(/^new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);

    fireEvent.change(currentPasswordInput, { target: { value: "oldpassword" } });
    fireEvent.change(newPasswordInput, { target: { value: "short" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "different" } });

    fireEvent.blur(newPasswordInput);
    fireEvent.blur(confirmPasswordInput);

    expect(await screen.findByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it("successfully calls changePassword and displays success toast on valid submission", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoading: false,
      isAuthenticated: true,
    });
    (changePassword as jest.Mock).mockResolvedValueOnce({ success: true });

    render(<ProfilePage />);

    fireEvent.change(screen.getByLabelText(/^current password/i), {
      target: { value: "OldPassword123" },
    });
    fireEvent.change(screen.getByLabelText(/^new password/i), {
      target: { value: "NewSecurePassword123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), {
      target: { value: "NewSecurePassword123" },
    });

    const updatePasswordButton = screen.getByRole("button", { name: /update password/i });
    fireEvent.click(updatePasswordButton);

    await waitFor(() => {
      expect(changePassword).toHaveBeenCalledWith({
        currentPassword: "OldPassword123",
        newPassword: "NewSecurePassword123",
        confirmPassword: "NewSecurePassword123",
      });
    });

    expect(toast.success).toHaveBeenCalledWith("Password changed successfully.");
  });

  it("handles password change error and shows error toast", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isLoading: false,
      isAuthenticated: true,
    });
    const axiosError = {
      isAxiosError: true,
      response: {
        data: { message: "Incorrect current password." },
      },
    };
    (changePassword as jest.Mock).mockRejectedValueOnce(axiosError);

    render(<ProfilePage />);

    fireEvent.change(screen.getByLabelText(/^current password/i), {
      target: { value: "WrongPassword" },
    });
    fireEvent.change(screen.getByLabelText(/^new password/i), {
      target: { value: "NewSecurePassword123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), {
      target: { value: "NewSecurePassword123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /update password/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Incorrect current password.");
    });
  });
});