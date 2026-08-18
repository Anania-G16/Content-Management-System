import React, { act } from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import NewDocumentPage from "@/app/admin/docs/new/page";
import { getAdminDocumentTree } from "@/app/services/documentService";
import { getClients } from "@/app/services/userService";
import api from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

// Polyfill HTMLFormElement.prototype.requestSubmit for jsdom environment
if (typeof HTMLFormElement !== "undefined" && !HTMLFormElement.prototype.requestSubmit) {
  HTMLFormElement.prototype.requestSubmit = function (submitter) {
    if (submitter) {
      submitter.click();
    } else {
      const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
      this.dispatchEvent(submitEvent);
    }
  };
}

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
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

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("@/lib/api", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

jest.mock("@/app/services/documentService", () => ({
  getAdminDocumentTree: jest.fn(),
}));

jest.mock("@/app/services/userService", () => ({
  getClients: jest.fn(),
}));

jest.mock("@/components/DocumentEditor", () => {
  return function DummyDocumentEditor({
    onChange,
  }: {
    onChange: (content: object) => void;
  }) {
    return (
      <button
        type="button"
        data-testid="mock-editor"
        onClick={() => onChange({ type: "doc", content: ["Test Content"] })}
      >
        Set Content
      </button>
    );
  };
});

jest.mock("@/components/ParentDocumentSelector", () => ({
  __esModule: true,
  default: function DummyParentSelector({
    onSelect,
  }: {
    nodes: unknown[];
    selectedId: string | null;
    onSelect: (id: string | null) => void;
  }) {
    return (
      <button
        type="button"
        data-testid="mock-parent-select"
        onClick={() => onSelect("parent-100")}
      >
        Select Parent
      </button>
    );
  },
  findNodePath: jest.fn().mockReturnValue([]),
}));

jest.mock("@/components/IconSelector", () => {
  return function DummyIconSelector({
    onSelect,
  }: {
    selectedIcon: string | null;
    onSelect: (icon: string) => void;
  }) {
    return (
      <button
        type="button"
        data-testid="mock-icon-select"
        onClick={() => onSelect("FileText")}
      >
        Select Icon
      </button>
    );
  };
});

const mockTree = [
  {
    id: "parent-100",
    title: "Getting Started",
    slug: "getting-started",
    status: "PUBLISHED",
    parentId: null,
    icon: "BookOpen",
    content: {},
    accessLevel: "PUBLIC",
  },
];

const mockClients = [
  { id: "user-1", name: "Alice Smith", email: "alice@example.com" },
  { id: "user-2", name: "Bob Jones", email: "bob@example.com" },
];

describe("NewDocumentPage", () => {
  const mockPush = jest.fn();
  const mockGetParam = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as jest.Mock).mockReturnValue({ get: mockGetParam });
    mockGetParam.mockReturnValue(null);
    (getAdminDocumentTree as jest.Mock).mockResolvedValue(mockTree);
    (getClients as jest.Mock).mockResolvedValue(mockClients);
  });

  const renderPage = async () => {
    let result;
    await act(async () => {
      result = render(<NewDocumentPage />);
    });
    return result;
  };

  test("renders form inputs correctly with default values", async () => {
    await renderPage();

    expect(screen.getByPlaceholderText("e.g. Getting Started")).toBeInTheDocument();
    expect(screen.getByText("/docs/new-document")).toBeInTheDocument();
    expect(screen.getByLabelText("All authenticated users")).toBeChecked();
  });

  test("validates required fields before submitting", async () => {
    await renderPage();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Publish" }));
    });

    expect(screen.getByText("Document title is required.")).toBeInTheDocument();
    expect(screen.getByText("Document content cannot be empty.")).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  test("allows searching and selecting users in PRIVATE access mode", async () => {
    await renderPage();

    // Select PRIVATE mode
    const privateRadio = screen.getByLabelText("Specific users only");
    await act(async () => {
      fireEvent.click(privateRadio);
    });

    // Open user dropdown container
    const searchInput = screen.getByPlaceholderText("Search users...");
    const dropdownContainer = searchInput.parentElement?.parentElement;

    if (dropdownContainer) {
      await act(async () => {
        fireEvent.click(dropdownContainer);
      });
    }

    // Select Alice Smith from dropdown options
    const aliceOptions = await screen.findAllByText("Alice Smith");
    const optionItem = aliceOptions.find((el) => el.closest("li") || el.tagName.toLowerCase() === "button" || el.closest("div[role='option']"));
    await act(async () => {
      fireEvent.click(optionItem || aliceOptions[0]);
    });

    // Locate the rendered chip element containing Alice Smith
    const chipText = screen.getAllByText("Alice Smith").find((el) => el.tagName.toLowerCase() === "span" && el.querySelector("button"));
    expect(chipText).toBeDefined();

    // Target the remove button inside the chip span
    const removeBtn = chipText?.querySelector("button");
    if (removeBtn) {
      await act(async () => {
        fireEvent.click(removeBtn);
      });
    }

    const remainingAliceChips = screen
      .queryAllByText("Alice Smith")
      .filter((el) => el.tagName.toLowerCase() === "span" && el.querySelector("button"));
    expect(remainingAliceChips).toHaveLength(0);
  });

  test("submits form payload correctly when publishing", async () => {
    (api.post as jest.Mock).mockResolvedValue({ data: { id: "new-doc-1" } });

    await renderPage();

    // Fill Title
    const titleInput = screen.getByPlaceholderText("e.g. Getting Started");
    fireEvent.change(titleInput, { target: { value: "API Reference" } });

    // Set Content via mock editor
    await act(async () => {
      fireEvent.click(screen.getByTestId("mock-editor"));
    });

    // Click Publish
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Publish" }));
    });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/api/documents", {
        title: "API Reference",
        slug: "api-reference",
        icon: "BookOpen",
        content: { type: "doc", content: ["Test Content"] },
        parentId: null,
        status: "PUBLISHED",
        accessLevel: "CLIENT",
        allowedUsers: [],
      });
    });

    expect(toast.success).toHaveBeenCalledWith("Document created successfully!");
  });

  test("submits form payload correctly as draft", async () => {
    (api.post as jest.Mock).mockResolvedValue({ data: { id: "new-doc-2" } });

    await renderPage();

    const titleInput = screen.getByPlaceholderText("e.g. Getting Started");
    fireEvent.change(titleInput, { target: { value: "Draft Guide" } });

    await act(async () => {
      fireEvent.click(screen.getByTestId("mock-editor"));
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Save as Draft" }));
    });

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/api/documents",
        expect.objectContaining({
          status: "DRAFT",
        })
      );
    });
  });

  test("navigates back to dashboard when Cancel is clicked", async () => {
    await renderPage();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    });

    expect(mockPush).toHaveBeenCalledWith("/admin/dashboard");
  });
});