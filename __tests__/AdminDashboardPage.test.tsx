import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AdminDashboardPage from "@/app/admin/dashboard/page";
import { getAdminDocumentTree } from "@/app/services/documentService";

jest.mock("@/app/services/documentService", () => ({
  getAdminDocumentTree: jest.fn(),
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

const mockDocuments = [
  {
    id: "doc-1",
    title: "Getting Started",
    slug: "getting-started",
    status: "PUBLISHED",
    updatedAt: new Date().toISOString(),
    children: [
      {
        id: "doc-1-1",
        title: "Installation",
        slug: "installation",
        status: "PUBLISHED",
        updatedAt: "2026-08-17T10:00:00Z",
      },
      {
        id: "doc-1-2",
        title: "Configuration Draft",
        slug: "configuration-draft",
        status: "DRAFT",
        updatedAt: "2026-08-10T10:00:00Z",
      },
    ],
  },
  {
    id: "doc-2",
    title: "API Reference",
    slug: "api-reference",
    status: "DRAFT",
    updatedAt: undefined,
    children: [],
  },
];

describe("AdminDashboardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state with spinner initially", () => {
    (getAdminDocumentTree as jest.Mock).mockReturnValue(new Promise(() => {}));

    render(<AdminDashboardPage />);

    expect(screen.getByRole("status", { name: /loading/i })).toBeInTheDocument();
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
  });

  test("fetches and renders dashboard metrics correctly including nested children", async () => {
    (getAdminDocumentTree as jest.Mock).mockResolvedValue(mockDocuments);

    render(<AdminDashboardPage />);

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    // Total documents count: 4 (2 top-level + 2 nested children)
    expect(screen.getByText("4")).toBeInTheDocument();

    // Query elements specifically within their respective stat cards
    const publishedCard = screen.getByText("Published").closest("div");
    expect(publishedCard).toHaveTextContent("2");

    const draftsCard = screen.getByText("Drafts").closest("div");
    expect(draftsCard).toHaveTextContent("2");
  });

  test("renders top-level documents in the table", async () => {
    (getAdminDocumentTree as jest.Mock).mockResolvedValue(mockDocuments);

    render(<AdminDashboardPage />);

    const firstDocTitle = await screen.findByText("Getting Started");
    const secondDocTitle = await screen.findByText("API Reference");

    expect(firstDocTitle).toBeInTheDocument();
    expect(secondDocTitle).toBeInTheDocument();

    expect(screen.getByText("/docs/getting-started")).toBeInTheDocument();
    expect(screen.getByText("/docs/api-reference")).toBeInTheDocument();
    expect(screen.getByText("Top-Level Documents (2)")).toBeInTheDocument();
  });

  test("formats last updated dates correctly", async () => {
    (getAdminDocumentTree as jest.Mock).mockResolvedValue(mockDocuments);

    render(<AdminDashboardPage />);

    expect(await screen.findByText("Today")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  test("renders action links with correct URLs", async () => {
    (getAdminDocumentTree as jest.Mock).mockResolvedValue(mockDocuments);

    render(<AdminDashboardPage />);

    const newDocBtn = await screen.findByRole("link", { name: /new document/i });
    expect(newDocBtn).toHaveAttribute("href", "/admin/docs/new");

    // Wait for document table rows to render before querying links
    const viewLinks = await screen.findAllByTitle("View on site");
    expect(viewLinks[0]).toHaveAttribute("href", "/docs/getting-started");
    expect(viewLinks[0]).toHaveAttribute("target", "_blank");

    const editLinks = await screen.findAllByTitle("Edit document");
    expect(editLinks[0]).toHaveAttribute("href", "/admin/docs/doc-1/edit");
  });

  test("handles fetch error gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (getAdminDocumentTree as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch")
    );

    render(<AdminDashboardPage />);

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to fetch documents:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});