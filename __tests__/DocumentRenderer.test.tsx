import { render, screen } from "@testing-library/react";
import DocumentRenderer from "@/components/DocumentRenderer";
import { useEditor } from "@tiptap/react";

// Mock @tiptap/react
jest.mock("@tiptap/react", () => ({
  useEditor: jest.fn(),
  EditorContent: ({ editor }: { editor: any }) => (
    <div data-testid="editor-content">
      {editor ? "Rendered Document Output" : null}
    </div>
  ),
}));

describe("DocumentRenderer Component", () => {
  const sampleContent = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "Hello, world!" }],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when editor instance is not initialized", () => {
    (useEditor as jest.Mock).mockReturnValue(null);

    const { container } = render(<DocumentRenderer content={sampleContent} />);
    expect(container.firstChild).toBeNull();
  });

  it("initializes TipTap editor with correct options (editable: false)", () => {
    const mockEditorInstance = { editable: false };
    (useEditor as jest.Mock).mockReturnValue(mockEditorInstance);

    render(<DocumentRenderer content={sampleContent} />);

    expect(useEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        content: sampleContent,
        editable: false,
        immediatelyRender: false,
        editorProps: {
          attributes: {
            class: "tiptap-document",
          },
        },
      })
    );
  });

  it("renders EditorContent when editor is initialized", () => {
    const mockEditorInstance = { editable: false };
    (useEditor as jest.Mock).mockReturnValue(mockEditorInstance);

    render(<DocumentRenderer content={sampleContent} />);

    expect(screen.getByTestId("editor-content")).toBeInTheDocument();
    expect(screen.getByText("Rendered Document Output")).toBeInTheDocument();
  });
});