import { render, screen, fireEvent } from "@testing-library/react";
import DocumentTree, { DocumentTreeNode } from "@/components/DocumentTree";
import { DocumentationNode } from "@/data/documentationTree";

// Mock Lucide icons
jest.mock("lucide-react", () =>
  new Proxy(
    {},
    {
      get: (_, prop: string) => () => (
        <span data-testid={`icon-${prop.toLowerCase()}`} />
      ),
    }
  )
);

// Mock DocumentActions child component
jest.mock("@/components/DocumentActions", () => ({
  __esModule: true,
  default: ({ node, onDeleteRequest }: any) => (
    <button
      data-testid={`actions-${node.id}`}
      onClick={() => onDeleteRequest(node)}
    >
      Actions
    </button>
  ),
}));

describe("DocumentTree and DocumentTreeNode Components", () => {
  const mockOnDeleteRequest = jest.fn();

  const mockNodes: DocumentationNode[] = [
  {
    id: "1",
    parentId: null,
    title: "Getting Started",
    slug: "getting-started",
    status: "PUBLISHED",
    children: [
      {
        id: "1-1",
        parentId: "1",
        title: "Installation",
        slug: "getting-started/installation",
        status: "DRAFT",
        children: [],
      },
    ],
  },
  {
    id: "2",
    parentId: null,
    title: "API Reference",
    slug: "api-reference",
    status: "PUBLISHED",
    children: [],
  },
];
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders root nodes correctly", () => {
    render(
      <DocumentTree
        nodes={mockNodes}
        searchQuery=""
        onDeleteRequest={mockOnDeleteRequest}
      />
    );

    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("API Reference")).toBeInTheDocument();
    expect(screen.getByText("/docs/getting-started")).toBeInTheDocument();
  });

  it("renders status badges appropriately", () => {
    render(
      <DocumentTree
        nodes={mockNodes}
        searchQuery=""
        onDeleteRequest={mockOnDeleteRequest}
      />
    );

    expect(screen.getAllByText("Published")).toHaveLength(2);
    expect(screen.getByText("Draft")).toBeInTheDocument();
  });

  it("expands and collapses nested children on button toggle", () => {
    render(
      <DocumentTree
        nodes={mockNodes}
        searchQuery=""
        onDeleteRequest={mockOnDeleteRequest}
      />
    );

    // Initial state: child node 'Installation' is visible because default isExpanded is true
    expect(screen.getByText("Installation")).toBeInTheDocument();

    // Toggle collapse on first node
    const toggleBtn = screen.getByLabelText("Collapse section");
    fireEvent.click(toggleBtn);

    // Child node should no longer be rendered
    expect(screen.queryByText("Installation")).not.toBeInTheDocument();
  });

  it("filters nodes based on searchQuery and keeps matching subtree expanded", () => {
    render(
      <DocumentTree
        nodes={mockNodes}
        searchQuery="Installation"
        onDeleteRequest={mockOnDeleteRequest}
      />
    );

    // Parent 'Getting Started' is kept because child matches
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("Installation")).toBeInTheDocument();

    // Unrelated node 'API Reference' should be filtered out
    expect(screen.queryByText("API Reference")).not.toBeInTheDocument();
  });

  it("returns null for non-matching nodes during search", () => {
    const { container } = render(
      <DocumentTree
        nodes={mockNodes}
        searchQuery="Nonexistent Query"
        onDeleteRequest={mockOnDeleteRequest}
      />
    );

    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it("passes onDeleteRequest to DocumentActions", () => {
    render(
      <DocumentTree
        nodes={mockNodes}
        searchQuery=""
        onDeleteRequest={mockOnDeleteRequest}
      />
    );

    const actionButton = screen.getByTestId("actions-1");
    fireEvent.click(actionButton);

    expect(mockOnDeleteRequest).toHaveBeenCalledWith(mockNodes[0]);
  });
});