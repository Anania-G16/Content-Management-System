import React, { act } from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import EditDocumentPage from "@/app/admin/docs/[id]/edit/page";
import { getAdminDocumentTree, updateDocument } from "@/app/services/documentService";
import { getClients, getDocumentPermissions } from "@/app/services/userService";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
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

jest.mock("@/app/services/documentService", () => ({
  getAdminDocumentTree: jest.fn(),
  updateDocument: jest.fn(),
}));

jest.mock("@/app/services/userService", () => ({
  getClients: jest.fn(),
  getDocumentPermissions: jest.fn(),
}));

jest.mock("@/components/DocumentEditor", () => {
  return function DummyDocumentEditor({
    onChange,
  }: {
    initialContent?: object | null;
    onChange: (content: object) => void;
  }) {
    return (
      <button
        data-testid="mock-editor"
        onClick={() => onChange({ type: "doc", content: ["Updated"] })}
      >
        Update Content
      </button>
    );
  };
});

jest.mock("@/components/ParentDocumentSelector", () => {
  return function DummyParentSelector({
    onSelect,
  }: {
    nodes: unknown[];
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    currentDocumentId: string;
  }) {
    return (
      <button data-testid="mock-parent-select" onClick={() => onSelect("parent-1")}>
        Select Parent
      </button>
    );
  };
});

jest.mock("@/components/IconSelector", () => {
  return function DummyIconSelector({
    onSelect,
  }: {
    selectedIcon: string | null;
    onSelect: (icon: string) => void;
  }) {
    return (
      <button data-testid="mock-icon-select" onClick={() => onSelect("FileText")}>
        Select Icon
      </button>
    );
  };
});

const mockTree = [
  {
    id: "doc-123",
    title: "Test Guide",
    slug: "test-guide",
    status: "PUBLISHED",
    parentId: null,
    icon: "BookOpen",
    content: { type: "doc", content: ["Hello"] },
    accessLevel: "PUBLIC",
  },
];

const mockClients = [
  { id: "user-1", name: "Alice Smith", email: "alice@example.com" },
  { id: "user-2", name: "Bob Jones", email: "bob@example.com" },
];

const renderAsyncPage = async (paramsPromise: Promise<{ id: string }>) => {
  let result;
  await act(async () => {
    result = render(<EditDocumentPage params={paramsPromise} />);
  });
  return result;
};

describe("EditDocumentPage", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test("renders loading state or initial structure when promise is pending", async () => {
    (getAdminDocumentTree as jest.Mock).mockReturnValue(new Promise(() => {}));
    (getClients as jest.Mock).mockReturnValue(new Promise(() => {}));

    const pendingParams = new Promise<{ id: string }>(() => {});
    
    render(
      <React.Suspense fallback={<div data-testid="suspense-fallback">Loading...</div>}>
        <EditDocumentPage params={pendingParams} />
      </React.Suspense>
    );

    expect(screen.getByTestId("suspense-fallback")).toBeInTheDocument();
  });

  test("renders not found state when document does not exist", async () => {
    (getAdminDocumentTree as jest.Mock).mockResolvedValue([]);
    (getClients as jest.Mock).mockResolvedValue([]);
    (getDocumentPermissions as jest.Mock).mockResolvedValue([]);

    await renderAsyncPage(Promise.resolve({ id: "non-existent" }));

    await waitFor(() => {
      expect(screen.getByText("Document Not Found")).toBeInTheDocument();
    });
    expect(screen.getByText("non-existent")).toBeInTheDocument();
  });

  test("populates form fields correctly for existing document", async () => {
    (getAdminDocumentTree as jest.Mock).mockResolvedValue(mockTree);
    (getClients as jest.Mock).mockResolvedValue(mockClients);
    (getDocumentPermissions as jest.Mock).mockResolvedValue([]);

    await renderAsyncPage(Promise.resolve({ id: "doc-123" }));

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Guide")).toBeInTheDocument();
    });

    expect(screen.getByText("/docs/test-guide")).toBeInTheDocument();
    expect(screen.getByLabelText("Public")).toBeChecked();
  });

  test("handles user selection in restricted access mode", async () => {
    const docWithPrivate = [
      {
        ...mockTree[0],
        accessLevel: "PRIVATE",
        allowedUsers: [{ id: "user-1", name: "Alice Smith", email: "alice@example.com" }],
      },
    ];

    (getAdminDocumentTree as jest.Mock).mockResolvedValue(docWithPrivate);
    (getClients as jest.Mock).mockResolvedValue(mockClients);
    (getDocumentPermissions as jest.Mock).mockResolvedValue([{ _id: "user-1" }]);

    await renderAsyncPage(Promise.resolve({ id: "doc-123" }));

    await waitFor(() => {
      expect(screen.getByLabelText("Specific users only")).toBeChecked();
    });

    // Check that Alice Smith appears in the selected user badge
    const initialAliceMatches = screen.getAllByText("Alice Smith");
    expect(initialAliceMatches.length).toBeGreaterThan(0);

    // Open user selection dropdown
    const searchInput = screen.getByPlaceholderText("Search users...");
    const dropdownContainer = searchInput.parentElement?.parentElement;
    
    if (dropdownContainer) {
      await act(async () => {
        fireEvent.click(dropdownContainer);
      });
    }

    const bobOption = await screen.findByText("Bob Jones");
    await act(async () => {
      fireEvent.click(bobOption);
    });

    // Target the remove button explicitly from the selected badge element
    const aliceBadges = screen.getAllByText("Alice Smith");
    const badgeSpan = aliceBadges.find((el) => el.tagName.toLowerCase() === "span");
    const removeAliceBtn = badgeSpan?.nextElementSibling;

    if (removeAliceBtn) {
      await act(async () => {
        fireEvent.click(removeAliceBtn);
      });
    }

    // Verify Alice is no longer in the selected badges
    const remainingAliceSpans = screen
      .queryAllByText("Alice Smith")
      .filter((el) => el.tagName.toLowerCase() === "span");
    expect(remainingAliceSpans).toHaveLength(0);

    // Verify Bob Jones badge exists
    const bobBadges = screen
      .getAllByText("Bob Jones")
      .filter((el) => el.tagName.toLowerCase() === "span");
    expect(bobBadges.length).toBeGreaterThan(0);
  });

  test("updates document on Save Changes click", async () => {
    (getAdminDocumentTree as jest.Mock).mockResolvedValue(mockTree);
    (getClients as jest.Mock).mockResolvedValue([]);
    (getDocumentPermissions as jest.Mock).mockResolvedValue([]);
    (updateDocument as jest.Mock).mockResolvedValue({});

    await renderAsyncPage(Promise.resolve({ id: "doc-123" }));

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Guide")).toBeInTheDocument();
    });

    const titleInput = screen.getByDisplayValue("Test Guide");
    fireEvent.change(titleInput, { target: { value: "Updated Title" } });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));
    });

    await waitFor(() => {
      expect(updateDocument).toHaveBeenCalledWith("doc-123", {
        title: "Updated Title",
        slug: "updated-title",
        parentId: null,
        icon: "BookOpen",
        content: { type: "doc", content: ["Hello"] },
        status: "PUBLISHED",
        accessLevel: "PUBLIC",
        allowedUsers: [],
      });
    });

    expect(screen.getByText("Document updated successfully! Redirecting...")).toBeInTheDocument();
  });

  test("toggles document status on unpublish/publish button click", async () => {
    (getAdminDocumentTree as jest.Mock).mockResolvedValue(mockTree);
    (getClients as jest.Mock).mockResolvedValue([]);
    (getDocumentPermissions as jest.Mock).mockResolvedValue([]);
    (updateDocument as jest.Mock).mockResolvedValue({});

    await renderAsyncPage(Promise.resolve({ id: "doc-123" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Unpublish" })).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Unpublish" }));
    });

    await waitFor(() => {
      expect(updateDocument).toHaveBeenCalledWith(
        "doc-123",
        expect.objectContaining({
          status: "DRAFT",
        })
      );
    });
  });

  test("displays error banner when title is empty during save", async () => {
    (getAdminDocumentTree as jest.Mock).mockResolvedValue(mockTree);
    (getClients as jest.Mock).mockResolvedValue([]);
    (getDocumentPermissions as jest.Mock).mockResolvedValue([]);

    await renderAsyncPage(Promise.resolve({ id: "doc-123" }));

    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Guide")).toBeInTheDocument();
    });

    const titleInput = screen.getByDisplayValue("Test Guide");
    fireEvent.change(titleInput, { target: { value: "" } });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));
    });

    expect(screen.getByText("Document title is required.")).toBeInTheDocument();
    expect(updateDocument).not.toHaveBeenCalled();
  });
});