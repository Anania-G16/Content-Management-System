import { render, screen, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/context/AuthContext";

const mockUser = {
  id: "123",
  fullName: "John Doe",
  email: "john@example.com",
  role: "CLIENT" as const,
  isActive: true,
  isEmailVerified: true,
};

function TestComponent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  return (
    <div>
      <span data-testid="user">
        {user ? user.fullName : "No user"}
      </span>

      <span data-testid="authenticated">
        {isAuthenticated ? "authenticated" : "not authenticated"}
      </span>

      <span data-testid="loading">
        {isLoading ? "loading" : "loaded"}
      </span>

      <button onClick={() => login(mockUser, "test-token")}>
        Login
      </button>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("starts with no authenticated user", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId("user")).toHaveTextContent("No user");
    expect(screen.getByTestId("authenticated")).toHaveTextContent(
      "not authenticated",
    );

    await act(async () => {});
    
    expect(screen.getByTestId("loading")).toHaveTextContent("loaded");
  });

  it("logs in a user and stores authentication data", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await act(async () => {});

    await act(async () => {
      screen.getByRole("button", { name: "Login" }).click();
    });

    expect(screen.getByTestId("user")).toHaveTextContent("John Doe");
    expect(screen.getByTestId("authenticated")).toHaveTextContent(
      "authenticated",
    );

    expect(localStorage.getItem("accessToken")).toBe("test-token");
    expect(localStorage.getItem("user")).toBe(JSON.stringify(mockUser));
  });

  it("logs out a user and removes authentication data", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await act(async () => {});

    await act(async () => {
      screen.getByRole("button", { name: "Login" }).click();
    });

    await act(async () => {
      screen.getByRole("button", { name: "Logout" }).click();
    });

    expect(screen.getByTestId("user")).toHaveTextContent("No user");
    expect(screen.getByTestId("authenticated")).toHaveTextContent(
      "not authenticated",
    );

    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("restores the user from localStorage", async () => {
    localStorage.setItem("user", JSON.stringify(mockUser));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await act(async () => {});

    expect(screen.getByTestId("user")).toHaveTextContent("John Doe");
    expect(screen.getByTestId("authenticated")).toHaveTextContent(
      "authenticated",
    );
    expect(screen.getByTestId("loading")).toHaveTextContent("loaded");
  });

  it("clears invalid authentication data from localStorage", async () => {
    localStorage.setItem("user", "invalid-json");

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await act(async () => {});

    expect(screen.getByTestId("user")).toHaveTextContent("No user");
    expect(screen.getByTestId("authenticated")).toHaveTextContent(
      "not authenticated",
    );

    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("accessToken")).toBeNull();
  });

  it("throws when useAuth is used outside AuthProvider", () => {
    function InvalidComponent() {
      useAuth();
      return null;
    }

    expect(() => render(<InvalidComponent />)).toThrow(
      "useAuth must be used inside an AuthProvider",
    );
  });
});