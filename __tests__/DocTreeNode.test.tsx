import { render, screen, fireEvent } from "@testing-library/react";
import DocTreeNode from "@/components/DocTreeNode";
import { usePathname } from "next/navigation";
import { getDocIcon } from "@/lib/iconMap";
import { DocumentationNode } from "@/data/documentationData";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// Mock icon map helper
jest.mock("@/lib/iconMap", () => ({
  getDocIcon: jest.fn(),
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  ChevronRight: () => <span data-testid="chevron-right" />,
  ChevronDown: () => <span data-testid="chevron-down" />,
}));

const mockUsePathname = usePathname as jest.Mock;
const mockGetDocIcon = getDocIcon as jest.Mock;

describe("DocTreeNode Component", () => {
  const sampleNode: DocumentationNode = {
    id: "1",
    title: "Getting Started",
    slug: "getting-started",
    parentId: null,
    icon: "book",
    children: [
      {
        id: "2",
        title: "Installation",
        slug: "installation",
        parentId: "1",
        children: [],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue("/docs");
    mockGetDocIcon.mockReturnValue(() => <span data-testid="doc-icon" />);
  });

  it("renders the node title and constructs the correct link href", () => {
    render(<DocTreeNode node={sampleNode} />);

    const link = screen.getByRole("link", { name: /getting started/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/docs/getting-started");
  });

  it("renders the root icon when depth is 0 or parentId is null", () => {
    render(<DocTreeNode node={sampleNode} depth={0} />);

    expect(mockGetDocIcon).toHaveBeenCalledWith("book");
    expect(screen.getByTestId("doc-icon")).toBeInTheDocument();
  });

  it("does not render the root icon for non-root nodes", () => {
    const childNode: DocumentationNode = {
      id: "2",
      title: "Installation",
      slug: "installation",
      parentId: "1",
      children: [],
    };

    render(<DocTreeNode node={childNode} depth={1} />);

    expect(screen.queryByTestId("doc-icon")).not.toBeInTheDocument();
  });

  it("toggles expanded state when clicking the node container", () => {
    render(<DocTreeNode node={sampleNode} />);

    // Initially branch is inactive (/docs !== /docs/getting-started)
    expect(screen.getByTestId("chevron-right")).toBeInTheDocument();

    const container = screen.getByText("Getting Started").closest("div");
    if (container) fireEvent.click(container);

    expect(screen.getByTestId("chevron-down")).toBeInTheDocument();
  });

  it("automatically expands if current pathname matches or is a child of the node path", () => {
    mockUsePathname.mockReturnValue("/docs/getting-started/installation");

    render(<DocTreeNode node={sampleNode} />);

    expect(screen.getByTestId("chevron-down")).toBeInTheDocument();
  });

  it("calls onNavigate when the title link is clicked", () => {
    const onNavigateMock = jest.fn();

    render(<DocTreeNode node={sampleNode} onNavigate={onNavigateMock} />);

    const link = screen.getByRole("link", { name: /getting started/i });
    fireEvent.click(link);

    expect(onNavigateMock).toHaveBeenCalledTimes(1);
  });

  it("recursively renders child nodes when children exist", () => {
    mockUsePathname.mockReturnValue("/docs/getting-started");

    render(<DocTreeNode node={sampleNode} />);

    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("Installation")).toBeInTheDocument();

    const childLink = screen.getByRole("link", { name: /installation/i });
    expect(childLink).toHaveAttribute("href", "/docs/getting-started/installation");
  });
});