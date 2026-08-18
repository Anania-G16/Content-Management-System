import { render, screen, fireEvent } from "@testing-library/react";
import DocumentActions from "@/components/DocumentActions";
import { DocumentationNode } from "@/data/documentationTree";

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  MoreVertical: () => <span data-testid="icon-more-vertical" />,
  Edit: () => <span data-testid="icon-edit" />,
  Plus: () => <span data-testid="icon-plus" />,
  Trash2: () => <span data-testid="icon-trash" />,
  AlertTriangle: () => <span data-testid="icon-alert" />,
  X: () => <span data-testid="icon-x" />,
}));

describe("DocumentActions Component", () => {
  const sampleNode: DocumentationNode = {
    id: "doc-123",
    title: "API Reference",
    slug: "api-reference",
    parentId: null,
    children: [],
  };

  const mockOnDeleteRequest = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders quick edit link pointing to the correct route", () => {
    render(
      <DocumentActions node={sampleNode} onDeleteRequest={mockOnDeleteRequest} />
    );

    const editLinks = screen.getAllByRole("link", { name: /edit/i });
    expect(editLinks[0]).toHaveAttribute("href", "/admin/docs/doc-123/edit");
  });

  it("toggles the actions dropdown menu when clicking the more button", () => {
    render(
      <DocumentActions node={sampleNode} onDeleteRequest={mockOnDeleteRequest} />
    );

    expect(screen.queryByText("Add Child Document")).not.toBeInTheDocument();

    const menuButton = screen.getByRole("button", { name: /more actions/i });
    fireEvent.click(menuButton);

    expect(screen.getByText("Add Child Document")).toBeInTheDocument();

    fireEvent.click(menuButton);
    expect(screen.queryByText("Add Child Document")).not.toBeInTheDocument();
  });

  it("renders correct href links inside the dropdown menu", () => {
    render(
      <DocumentActions node={sampleNode} onDeleteRequest={mockOnDeleteRequest} />
    );

    fireEvent.click(screen.getByRole("button", { name: /more actions/i }));

    const editDocLink = screen.getByRole("link", { name: /edit document/i });
    const addChildLink = screen.getByRole("link", { name: /add child document/i });

    expect(editDocLink).toHaveAttribute("href", "/admin/docs/doc-123/edit");
    expect(addChildLink).toHaveAttribute(
      "href",
      "/admin/docs/new?parentId=doc-123"
    );
  });

  it("closes the menu when clicking outside", () => {
    render(
      <div>
        <span data-testid="outside-element">Outside</span>
        <DocumentActions node={sampleNode} onDeleteRequest={mockOnDeleteRequest} />
      </div>
    );

    fireEvent.click(screen.getByRole("button", { name: /more actions/i }));
    expect(screen.getByText("Delete")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId("outside-element"));
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("calls onDeleteRequest with node and closes menu when clicking delete", () => {
    render(
      <DocumentActions node={sampleNode} onDeleteRequest={mockOnDeleteRequest} />
    );

    fireEvent.click(screen.getByRole("button", { name: /more actions/i }));

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockOnDeleteRequest).toHaveBeenCalledTimes(1);
    expect(mockOnDeleteRequest).toHaveBeenCalledWith(sampleNode);
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("stops event propagation on root click", () => {
    const parentClickHandler = jest.fn();

    render(
      <div onClick={parentClickHandler}>
        <DocumentActions node={sampleNode} onDeleteRequest={mockOnDeleteRequest} />
      </div>
    );

    const editButton = screen.getByRole("link", { name: /^edit$/i });
    fireEvent.click(editButton);

    expect(parentClickHandler).not.toHaveBeenCalled();
  });
});