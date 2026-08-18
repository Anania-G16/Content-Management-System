import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import {
  getPublicDocumentTree,
  getClientDocumentTree,
  getAdminDocumentTree,
} from "@/app/services/documentService";

jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/app/services/documentService", () => ({
  getPublicDocumentTree: jest.fn(),
  getClientDocumentTree: jest.fn(),
  getAdminDocumentTree: jest.fn(),
}));

jest.mock("@/components/DocTreeNode", () => {
  return function DummyDocTreeNode({
    node,
    onNavigate,
  }: {
    node: { id: string; title: string };
    onNavigate: () => void;
  }) {
    return (
      <li data-testid="doc-tree-node" onClick={onNavigate}>
        {node.title}
      </li>
    );
  };
});

const mockPublicDocs = [
  { id: "pub-1", parentId: null, title: "Public Overview", slug: "public-overview" },
];

const mockClientDocs = [
  { id: "client-1", parentId: null, title: "Client Guide", slug: "client-guide" },
];

const mockAdminDocs = [
  { id: "admin-1", parentId: null, title: "Admin Console", slug: "admin-console" },
];

describe("Sidebar Component", () => {
  const mockUseAuth = useAuth as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    (getPublicDocumentTree as jest.Mock).mockResolvedValue(mockPublicDocs);
    (getClientDocumentTree as jest.Mock).mockResolvedValue(mockClientDocs);
    (getAdminDocumentTree as jest.Mock).mockResolvedValue(mockAdminDocs);
  });

  test("renders skeleton state while authentication status is loading", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true,
    });

    const { container } = render(<Sidebar />);
    expect(container.querySelector(".react-loading-skeleton")).toBeInTheDocument();
  });

  test("fetches and renders public document tree for unauthenticated users", async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    render(<Sidebar />);

    const publicDocNode = await screen.findByText("Public Overview");
    expect(publicDocNode).toBeInTheDocument();
    expect(getPublicDocumentTree).toHaveBeenCalledTimes(1);
  });

  test("fetches and renders client document tree for logged-in non-admin users", async () => {
    mockUseAuth.mockReturnValue({
      user: { role: "CLIENT" },
      isAuthenticated: true,
      isLoading: false,
    });

    render(<Sidebar />);

    const clientDocNode = await screen.findByText("Client Guide");
    expect(clientDocNode).toBeInTheDocument();
    expect(getClientDocumentTree).toHaveBeenCalledTimes(1);
  });

  test("fetches and renders admin document tree for admin users", async () => {
    mockUseAuth.mockReturnValue({
      user: { role: "ADMIN" },
      isAuthenticated: true,
      isLoading: false,
    });

    render(<Sidebar />);

    const adminDocNode = await screen.findByText("Admin Console");
    expect(adminDocNode).toBeInTheDocument();
    expect(getAdminDocumentTree).toHaveBeenCalledTimes(1);
  });

  test("toggles mobile drawer open and closed when mobile button is clicked", async () => {
    const user = userEvent.setup();
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    render(<Sidebar />);

    const toggleButton = screen.getByRole("button", { name: /toggle navigation/i });
    const aside = screen.getByRole("complementary");

    expect(aside).toHaveClass("-translate-x-full");

    await user.click(toggleButton);
    expect(aside).toHaveClass("translate-x-0");

    await user.click(toggleButton);
    expect(aside).toHaveClass("-translate-x-full");
  });

  test("closes mobile drawer when backdrop overlay is clicked", async () => {
    const user = userEvent.setup();
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    const { container } = render(<Sidebar />);

    const toggleButton = screen.getByRole("button", { name: /toggle navigation/i });
    await user.click(toggleButton);

    const backdrop = container.querySelector(".backdrop-blur-sm");
    expect(backdrop).toBeInTheDocument();

    await user.click(backdrop!);
    expect(screen.getByRole("complementary")).toHaveClass("-translate-x-full");
  });

  test("closes mobile sidebar when a document node triggers onNavigate", async () => {
    const user = userEvent.setup();
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    render(<Sidebar />);

    const node = await screen.findByText("Public Overview");

    await user.click(screen.getByRole("button", { name: /toggle navigation/i }));
    expect(screen.getByRole("complementary")).toHaveClass("translate-x-0");

    await user.click(node);
    expect(screen.getByRole("complementary")).toHaveClass("-translate-x-full");
  });

  test("handles service error gracefully without crashing", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (getPublicDocumentTree as jest.Mock).mockRejectedValueOnce(
      new Error("Network Error")
    );

    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    render(<Sidebar />);

    await screen.findByRole("complementary");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to fetch documentation:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});