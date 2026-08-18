import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ParentDocumentSelector, {
  findNodePath,
} from "@/components/ParentDocumentSelector";
import { DocumentationNode } from "@/data/documentationTree";

const mockNodes: DocumentationNode[] = [
  {
    id: "doc-1",
    parentId: null,
    title: "Getting Started",
    slug: "getting-started",
    children: [
      {
        id: "doc-1-1",
        parentId: "doc-1",
        title: "Installation",
        slug: "installation",
      },
    ],
  },
  {
    id: "doc-2",
    parentId: null,
    title: "API Reference",
    slug: "api-reference",
    children: [
      {
        id: "doc-2-1",
        parentId: "doc-2",
        title: "Authentication",
        slug: "authentication",
      },
    ],
  },
];

describe("ParentDocumentSelector Helper Functions", () => {
  test("findNodePath returns correct slug path for a nested node", () => {
    const path = findNodePath(mockNodes, "doc-1-1");
    expect(path).toEqual(["getting-started", "installation"]);
  });

  test("findNodePath returns empty array when targetId is null", () => {
    const path = findNodePath(mockNodes, null);
    expect(path).toEqual([]);
  });
});

describe("ParentDocumentSelector Component", () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders trigger button with root title by default when no parent is selected", () => {
    render(<ParentDocumentSelector nodes={mockNodes} onSelect={mockOnSelect} />);

    expect(screen.getByRole("button", { name: /None — Root Document/i })).toBeInTheDocument();
  });

  test("renders selected node title in the trigger button", () => {
    render(
      <ParentDocumentSelector
        nodes={mockNodes}
        selectedParentId="doc-1"
        onSelect={mockOnSelect}
      />
    );

    expect(screen.getByRole("button", { name: /Getting Started/i })).toBeInTheDocument();
  });

  test("opens dropdown on click and displays node tree", async () => {
    const user = userEvent.setup();
    render(<ParentDocumentSelector nodes={mockNodes} onSelect={mockOnSelect} />);

    const triggerButton = screen.getByRole("button", { name: /None — Root Document/i });
    await user.click(triggerButton);

    expect(screen.getByPlaceholderText("Search documentation...")).toBeInTheDocument();
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("Installation")).toBeInTheDocument();
    expect(screen.getByText("API Reference")).toBeInTheDocument();
  });

  test("selects root document when clicking None option", async () => {
    const user = userEvent.setup();
    render(
      <ParentDocumentSelector
        nodes={mockNodes}
        selectedParentId="doc-1"
        onSelect={mockOnSelect}
      />
    );

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("None — Root Document"));

    expect(mockOnSelect).toHaveBeenCalledWith(null);
  });

  test("calls onSelect with correct ID when a document node is clicked", async () => {
    const user = userEvent.setup();
    render(<ParentDocumentSelector nodes={mockNodes} onSelect={mockOnSelect} />);

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("API Reference"));

    expect(mockOnSelect).toHaveBeenCalledWith("doc-2");
  });

  test("prevents selecting invalid/forbidden nodes (current document & descendants)", async () => {
    const user = userEvent.setup();
    render(
      <ParentDocumentSelector
        nodes={mockNodes}
        currentDocumentId="doc-1"
        onSelect={mockOnSelect}
      />
    );

    await user.click(screen.getByRole("button"));

    const invalidParentLabel = screen.getAllByText("(invalid parent)");
    expect(invalidParentLabel.length).toBeGreaterThan(0);

    await user.click(screen.getByText("Getting Started"));
    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  test("filters documents based on search query", async () => {
    const user = userEvent.setup();
    render(<ParentDocumentSelector nodes={mockNodes} onSelect={mockOnSelect} />);

    await user.click(screen.getByRole("button"));

    const searchInput = screen.getByPlaceholderText("Search documentation...");
    await user.type(searchInput, "Auth");

    expect(screen.getByText("API Reference")).toBeInTheDocument();
    expect(screen.getByText("Authentication")).toBeInTheDocument();
    expect(screen.queryByText("Getting Started")).not.toBeInTheDocument();
  });

  test("closes dropdown when clicking outside", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <ParentDocumentSelector nodes={mockNodes} onSelect={mockOnSelect} />
      </div>
    );

    await user.click(screen.getByRole("button"));
    expect(screen.getByPlaceholderText("Search documentation...")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(screen.queryByPlaceholderText("Search documentation...")).not.toBeInTheDocument();
  });
});