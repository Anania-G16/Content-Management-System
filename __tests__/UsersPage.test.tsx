import React, { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UsersPage from "@/app/admin/users/page";
import {
  getClients,
  updateUserStatus,
  deleteUser,
  promoteUserToAdmin,
} from "@/app/services/userService";
import "@testing-library/jest-dom";

// Mock services
jest.mock("@/app/services/userService", () => ({
  getClients: jest.fn(),
  updateUserStatus: jest.fn(),
  deleteUser: jest.fn(),
  promoteUserToAdmin: jest.fn(),
}));

// Mock Spinner component
jest.mock("@/components/Spinner", () => {
  return function DummySpinner() {
    return <div data-testid="spinner">Loading...</div>;
  };
});

const mockUsers = [
  {
    id: "usr-1",
    name: "Alex Mercer",
    email: "alex@example.com",
    role: "User",
    createdAt: "2026-01-10",
    isDeactivated: false,
  },
  {
    id: "usr-2",
    name: "Sarah Connor",
    email: "sarah@example.com",
    role: "Admin",
    createdAt: "2026-02-15",
    isDeactivated: true,
  },
];

describe("UsersPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getClients as jest.Mock).mockResolvedValue(mockUsers);
  });

  test("renders loading spinner initially and displays user table after fetching", async () => {
    await act(async () => {
      render(<UsersPage />);
    });

    await waitFor(() => {
      expect(screen.getByText("Alex Mercer")).toBeInTheDocument();
      expect(screen.getByText("alex@example.com")).toBeInTheDocument();
      expect(screen.getByText("Sarah Connor")).toBeInTheDocument();
      expect(screen.getByText("Deactivated")).toBeInTheDocument();
    });
  });

  test("filters users based on search input", async () => {
    await act(async () => {
      render(<UsersPage />);
    });

    await waitFor(() => {
      expect(screen.getByText("Alex Mercer")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      "Search users by name or email..."
    );

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "sarah" } });
    });

    expect(screen.getByText("Sarah Connor")).toBeInTheDocument();
    expect(screen.queryByText("Alex Mercer")).not.toBeInTheDocument();
  });

  test("promotes user to admin when clicking option in action menu", async () => {
    (promoteUserToAdmin as jest.Mock).mockResolvedValue(undefined);

    await act(async () => {
      render(<UsersPage />);
    });

    await waitFor(() => {
      expect(screen.getByText("Alex Mercer")).toBeInTheDocument();
    });

    // Open action menu for Alex Mercer (first user in list)
    const actionButtons = screen.getAllByRole("button", { name: "Actions" });
    await act(async () => {
      fireEvent.click(actionButtons[0]);
    });

    // Click Promote to Admin
    const promoteButton = screen.getByRole("button", {
      name: /Promote to Admin/i,
    });
    await act(async () => {
      fireEvent.click(promoteButton);
    });

    await waitFor(() => {
      expect(promoteUserToAdmin).toHaveBeenCalledWith("usr-1");
    });
  });

  test("toggles deactivation status of user", async () => {
    (updateUserStatus as jest.Mock).mockResolvedValue(undefined);

    await act(async () => {
      render(<UsersPage />);
    });

    await waitFor(() => {
      expect(screen.getByText("Alex Mercer")).toBeInTheDocument();
    });

    const actionButtons = screen.getAllByRole("button", { name: "Actions" });
    await act(async () => {
      fireEvent.click(actionButtons[0]);
    });

    const deactivateButton = screen.getByRole("button", {
      name: /Deactivate User/i,
    });
    await act(async () => {
      fireEvent.click(deactivateButton);
    });

    await waitFor(() => {
      expect(updateUserStatus).toHaveBeenCalledWith("usr-1", false);
    });
  });

  test("opens delete confirmation modal and permanently deletes user", async () => {
    (deleteUser as jest.Mock).mockResolvedValue(undefined);

    await act(async () => {
      render(<UsersPage />);
    });

    await waitFor(() => {
      expect(screen.getByText("Alex Mercer")).toBeInTheDocument();
    });

    // Open action menu
    const actionButtons = screen.getAllByRole("button", { name: "Actions" });
    await act(async () => {
      fireEvent.click(actionButtons[0]);
    });

    // Trigger delete modal
    const deleteOption = screen.getByRole("button", { name: /Delete User/i });
    await act(async () => {
      fireEvent.click(deleteOption);
    });

    // Verify modal is displayed
    expect(screen.getByText("Delete User Account")).toBeInTheDocument();

    // Confirm deletion inside modal
    const confirmDeleteBtn = screen.getByRole("button", {
      name: "Delete Account",
    });
    await act(async () => {
      fireEvent.click(confirmDeleteBtn);
    });

    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalledWith("usr-1");
      expect(screen.queryByText("Alex Mercer")).not.toBeInTheDocument();
    });
  });
});