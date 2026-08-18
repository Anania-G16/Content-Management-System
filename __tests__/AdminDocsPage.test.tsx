import React, { act } from "react";
import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import AdminDocsPage from "@/app/admin/docs/page";
import { getAdminDocumentTree, deleteDocument } from "@/app/services/documentService";

jest.mock("@/app/services/documentService", () => ({
  getAdminDocumentTree: jest.fn(),
  deleteDocument: jest.fn(),
}));

jest.mock("next/link", () => {
  return function DummyLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

jest.mock("@/components/DocumentTree", () => {
  return function DummyDocumentTree({
    nodes,
    onDeleteRequest,
  }: {
    nodes: Array<{ id: string; title: string }>;
    onDeleteRequest: (node: { id: string; title: string }) => void;
  }) {
    return (
      <div data-testid="mock-document-tree">
        {nodes.map((node) => (
          <div key={node.id} data-testid={`node-${node.id}`}>
            <span>{node.title}</span>
            <button
              type="button"
              data-testid={`delete-${node.id}`}
              onClick={() => onDeleteRequest(node)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    );
  };
});

const mockNodes = [
  { id: "doc-1", title: "Getting Started", children: [] },
  { id: "doc-2", title: "API Guide", children: [] },
];

describe("AdminDocsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getAdminDocumentTree as jest.Mock).mockResolvedValue(mockNodes);
  });

  test("renders document tree and search bar successfully", async () => {
    await act(async () => {
      render(<AdminDocsPage />);
    });

    await waitFor(() => {
      expect(screen.getByText("Getting Started")).toBeInTheDocument();
      expect(screen.getByText("API Guide")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Search documentation...")).toBeInTheDocument();
    });
  });

  test("renders empty state when no documents exist", async () => {
    (getAdminDocumentTree as jest.Mock).mockResolvedValue([]);

    await act(async () => {
      render(<AdminDocsPage />);
    });

    await waitFor(() => {
      expect(screen.getByText("No documentation yet")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Create First Document/i })).toBeInTheDocument();
    });
  });

  test("opens delete confirmation modal and deletes document on confirmation", async () => {
    (deleteDocument as jest.Mock).mockResolvedValue(undefined);

    await act(async () => {
      render(<AdminDocsPage />);
    });

    await waitFor(() => {
      expect(screen.getByText("Getting Started")).toBeInTheDocument();
    });

    // Click delete on first doc
    await act(async () => {
      fireEvent.click(screen.getByTestId("delete-doc-1"));
    });

    // Verify modal appears
    const modalHeader = screen.getByText("Delete Document");
    expect(modalHeader).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();

    // Scope the query strictly to the modal to avoid matching tree nodes
    const modalContainer = modalHeader.closest("div.fixed") as HTMLElement;

    // Confirm deletion
    await act(async () => {
      const confirmDeleteBtn = within(modalContainer).getByRole("button", {
        name: "Delete",
      });
      fireEvent.click(confirmDeleteBtn);
    });

    await waitFor(() => {
      expect(deleteDocument).toHaveBeenCalledWith("doc-1");
    });
  });
});