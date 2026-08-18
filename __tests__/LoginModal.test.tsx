import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginModal from "@/app/login/page"; // Adjust import path if needed based on your file structure
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

// Mock dependencies
jest.mock("@/lib/api", () => ({
  post: jest.fn(),
}));

jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LoginModal", () => {
  const mockLogin = jest.fn();
  const mockPush = jest.fn();
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    // Silence console.error during expected error tests
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("renders nothing when isOpen is false", () => {
    const { container } = render(<LoginModal isOpen={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the login modal correctly when open", () => {
    render(<LoginModal isOpen={true} />);

    expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("name@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot password\?/i)).toBeInTheDocument();
  });

  it("calls onClose when the close button or backdrop is clicked", () => {
    const handleClose = jest.fn();
    render(<LoginModal isOpen={true} onClose={handleClose} />);

    const closeButton = screen.getByLabelText(/close modal/i);
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("toggles password visibility when the eye icon is clicked", () => {
    render(<LoginModal isOpen={true} />);

    const passwordInput = screen.getByPlaceholderText("••••••••");
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleButton = screen.getByLabelText(/show password/i);
    fireEvent.click(toggleButton);

    expect(passwordInput).toHaveAttribute("type", "text");
    expect(screen.getByLabelText(/hide password/i)).toBeInTheDocument();
  });

  it("handles successful login, calls context login, and redirects to /docs", async () => {
    const mockResponseData = {
      user: { id: "1", email: "test@example.com" },
      accessToken: "fake-jwt-token",
    };
    (api.post as jest.Mock).mockResolvedValueOnce({ data: mockResponseData });

    render(<LoginModal isOpen={true} />);

    fireEvent.change(screen.getByPlaceholderText("name@example.com"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/api/auth/login", {
        email: "test@example.com",
        password: "password123",
      });
    });

    expect(mockLogin).toHaveBeenCalledWith(mockResponseData.user, mockResponseData.accessToken);
    expect(mockPush).toHaveBeenCalledWith("/docs");
  });

  it("displays error message when login fails with backend error response", async () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        data: { message: "Invalid email or password." },
      },
    };
    (api.post as jest.Mock).mockRejectedValueOnce(axiosError);

    render(<LoginModal isOpen={true} />);

    fireEvent.change(screen.getByPlaceholderText("name@example.com"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password.")).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
