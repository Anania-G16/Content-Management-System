import { render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";
import { useAuth } from "@/context/AuthContext";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("AdminGuard", () => {
  const replaceMock = jest.fn();

  beforeEach(() => {
  jest.clearAllMocks();

  mockedUseRouter.mockReturnValue({
    replace: replaceMock,
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  } as unknown as ReturnType<typeof useRouter>);
});
  it("renders nothing while authentication is loading", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: jest.fn(),
      logout: jest.fn(),
    });

    const { container } = render(
      <AdminGuard>
        <div>Admin Content</div>
      </AdminGuard>,
    );

    expect(container.firstChild).toBeNull();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("redirects unauthenticated users to /docs", async () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    const { container } = render(
      <AdminGuard>
        <div>Admin Content</div>
      </AdminGuard>,
    );

    expect(container.firstChild).toBeNull();

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/docs");
    });
  });

  it("redirects non-admin users to /docs", async () => {
    mockedUseAuth.mockReturnValue({
      user: {
        id: "user-1",
        fullName: "Test User",
        email: "user@test.com",
        role: "CLIENT",
        isActive: true,
        isEmailVerified: true,
      },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    const { container } = render(
      <AdminGuard>
        <div>Admin Content</div>
      </AdminGuard>,
    );

    expect(container.firstChild).toBeNull();

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/docs");
    });
  });

  it("renders children for admin users", () => {
    mockedUseAuth.mockReturnValue({
      user: {
        id: "admin-1",
        fullName: "Admin User",
        email: "admin@test.com",
        role: "ADMIN",
        isActive: true,
        isEmailVerified: true,
      },
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
    });

    render(
      <AdminGuard>
        <div>Admin Content</div>
      </AdminGuard>,
    );

    expect(screen.getByText("Admin Content")).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });
});