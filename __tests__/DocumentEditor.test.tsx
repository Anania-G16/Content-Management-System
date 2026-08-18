import { render, screen, fireEvent } from "@testing-library/react";
import DocumentEditor from "@/components/DocumentEditor";
import { useEditor } from "@tiptap/react";

// Mock @tiptap/react
jest.mock("@tiptap/react", () => ({
  useEditor: jest.fn(),
  EditorContent: ({ editor }: { editor: any }) => (
    <div data-testid="editor-content">
      {editor ? "TipTap Content Area" : null}
    </div>
  ),
}));

// Mock lucide-react icons
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

describe("DocumentEditor Component", () => {
  const mockOnChange = jest.fn();

  // Helper mock chainable API for TipTap editor instance
  const createMockChain = () => {
    const chain: Record<string, jest.Mock> = {};
    const chainableMethods = [
      "focus",
      "toggleBold",
      "toggleItalic",
      "setColor",
      "unsetMark",
      "toggleHeading",
      "toggleBulletList",
      "toggleOrderedList",
      "toggleCode",
      "toggleCodeBlock",
      "toggleBlockquote",
      "setHorizontalRule",
      "insertTable",
      "addRowAfter",
      "deleteRow",
      "addColumnAfter",
      "deleteColumn",
      "deleteTable",
      "undo",
      "redo",
      "run",
    ];

    chainableMethods.forEach((method) => {
      chain[method] = jest.fn().mockImplementation(() => chain);
    });

    return chain;
  };

  let mockChain: ReturnType<typeof createMockChain>;
  let mockEditorInstance: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockChain = createMockChain();

    mockEditorInstance = {
      chain: jest.fn().mockReturnValue(mockChain),
      isActive: jest.fn().mockReturnValue(false),
      can: jest.fn().mockReturnValue({
        undo: jest.fn().mockReturnValue(true),
        redo: jest.fn().mockReturnValue(true),
      }),
      getJSON: jest.fn().mockReturnValue({ type: "doc", content: [] }),
    };

    (useEditor as jest.Mock).mockReturnValue(mockEditorInstance);
  });

  it("returns null if editor instance is not initialized", () => {
    (useEditor as jest.Mock).mockReturnValue(null);

    const { container } = render(<DocumentEditor onChange={mockOnChange} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders editor toolbar and content area when initialized", () => {
    render(<DocumentEditor onChange={mockOnChange} />);

    expect(screen.getByTestId("editor-content")).toBeInTheDocument();
    expect(screen.getByTitle("Bold")).toBeInTheDocument();
    expect(screen.getByTitle("Italic")).toBeInTheDocument();
    expect(screen.getByTitle("Heading 1")).toBeInTheDocument();
  });

  it("triggers bold command when bold button is clicked", () => {
    render(<DocumentEditor onChange={mockOnChange} />);

    fireEvent.click(screen.getByTitle("Bold"));

    expect(mockEditorInstance.chain).toHaveBeenCalled();
    expect(mockChain.focus).toHaveBeenCalled();
    expect(mockChain.toggleBold).toHaveBeenCalled();
    expect(mockChain.run).toHaveBeenCalled();
  });

  it("triggers heading commands when heading buttons are clicked", () => {
    render(<DocumentEditor onChange={mockOnChange} />);

    fireEvent.click(screen.getByTitle("Heading 1"));
    expect(mockChain.toggleHeading).toHaveBeenCalledWith({ level: 1 });

    fireEvent.click(screen.getByTitle("Heading 2"));
    expect(mockChain.toggleHeading).toHaveBeenCalledWith({ level: 2 });

    fireEvent.click(screen.getByTitle("Heading 3"));
    expect(mockChain.toggleHeading).toHaveBeenCalledWith({ level: 3 });
  });

  it("triggers text color formatting and reset buttons", () => {
    render(<DocumentEditor onChange={mockOnChange} />);

    const colorButtons = screen.getAllByTitle(/Color/i);
    fireEvent.click(colorButtons[0]);

    expect(mockChain.setColor).toHaveBeenCalledWith("var(--color-text, #f1f5f9)");

    fireEvent.click(screen.getByTitle("Reset Text Color"));
    expect(mockChain.unsetMark).toHaveBeenCalledWith("textStyle");
  });

  it("renders contextual table controls when a table is active", () => {
    mockEditorInstance.isActive.mockImplementation((name: string) => name === "table");

    render(<DocumentEditor onChange={mockOnChange} />);

    expect(screen.getByTitle("Add Row Below")).toBeInTheDocument();
    expect(screen.getByTitle("Delete Current Row")).toBeInTheDocument();
    expect(screen.getByTitle("Add Column Right")).toBeInTheDocument();
    expect(screen.getByTitle("Delete Current Column")).toBeInTheDocument();
    expect(screen.getByTitle("Delete Entire Table")).toBeInTheDocument();

    fireEvent.click(screen.getByTitle("Add Row Below"));
    expect(mockChain.addRowAfter).toHaveBeenCalled();

    fireEvent.click(screen.getByTitle("Delete Entire Table"));
    expect(mockChain.deleteTable).toHaveBeenCalled();
  });

  it("triggers undo and redo actions", () => {
    render(<DocumentEditor onChange={mockOnChange} />);

    fireEvent.click(screen.getByTitle("Undo"));
    expect(mockChain.undo).toHaveBeenCalled();

    fireEvent.click(screen.getByTitle("Redo"));
    expect(mockChain.redo).toHaveBeenCalled();
  });

  it("invokes onChange callback on editor update", () => {
    (useEditor as jest.Mock).mockImplementation(({ onUpdate }) => {
      // Simulate TipTap onUpdate callback execution
      onUpdate({ editor: mockEditorInstance });
      return mockEditorInstance;
    });

    render(<DocumentEditor onChange={mockOnChange} />);

    expect(mockEditorInstance.getJSON).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith({ type: "doc", content: [] });
  });
});