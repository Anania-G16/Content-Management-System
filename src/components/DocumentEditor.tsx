"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  SquareCode,
  Minus,
  Undo,
  Redo,
  Palette,
  RotateCcw,
} from "lucide-react";

interface DocumentEditorProps {
  onChange: (jsonContent: object) => void;
  initialContent?: object | null;
}

// 3-tier text color palette aligned with your layout styles
const TEXT_COLORS = [
  { 
    name: "Title Color", 
    hex: "var(--color-text, #f1f5f9)" 
  },
  { 
    name: "Subtitle Color (Mid-tone)", 
    hex: "color-mix(in srgb, var(--color-text, #f1f5f9) 50%, var(--color-text-secondary, #94a3b8) 50%)" 
  },
  { 
    name: "Content Color (Sidebar)", 
    hex: "var(--color-text-secondary, #94a3b8)" 
  },
];

export default function DocumentEditor({ onChange, initialContent }: DocumentEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
    ],
    immediatelyRender: false,
    content: initialContent || "",
    editorProps: {
      attributes: {
        class:
          "tiptap-editor prose-editor min-h-[300px] p-4 text-text bg-background/50 focus:outline-none rounded-b-md text-sm leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  if (!editor) return null;

  return (
    <div className="rounded-md border border-border bg-surface overflow-hidden">
      {/* Editor Custom Styles */}
      <style jsx global>{`
        .tiptap-editor h1 {
          font-size: 1.875rem;
          font-weight: 800;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          line-height: 1.25;
        }
        .tiptap-editor h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 0.875rem;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }
        .tiptap-editor h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 0.75rem;
          margin-bottom: 0.375rem;
          line-height: 1.4;
        }
        .tiptap-editor ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .tiptap-editor ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .tiptap-editor li {
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
        }
        .tiptap-editor blockquote {
          border-left: 3px solid var(--color-primary, #6366f1);
          padding-left: 1rem;
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
          font-style: italic;
          color: var(--color-text-secondary, #94a3b8);
        }
        .tiptap-editor code {
          background-color: rgba(255, 255, 255, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.875em;
        }
        .tiptap-editor pre {
          background-color: #080d1a;
          color: #f1f5f9;
          padding: 0.75rem 1rem;
          border-radius: 0.375rem;
          font-family: monospace;
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
          overflow-x: auto;
        }
        .tiptap-editor hr {
          border: none;
          border-top: 1px solid var(--color-border, #1e293b);
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
      `}</style>

      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-background border-b border-border">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded text-xs transition-colors ${
            editor.isActive("bold")
              ? "bg-primary text-text"
              : "text-text-secondary hover:text-text hover:bg-surface"
          }`}
          title="Bold"
        >
          <Bold size={15} />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded text-xs transition-colors ${
            editor.isActive("italic")
              ? "bg-primary text-text"
              : "text-text-secondary hover:text-text hover:bg-surface"
          }`}
          title="Italic"
        >
          <Italic size={15} />
        </button>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Dynamic Theme Text Colors */}
        <div className="flex items-center gap-1 px-1">
          <Palette size={14} className="text-text-secondary mr-0.5" />
          {TEXT_COLORS.map((color) => {
            const isActive = editor.isActive("textStyle", { color: color.hex });
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => editor.chain().focus().setColor(color.hex).run()}
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform hover:scale-110 border ${
                  isActive ? "border-text ring-1 ring-text" : "border-border"
                }`}
                title={color.name}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: color.hex }}
                />
              </button>
            );
          })}

          {/* Reset Color */}
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetMark("textStyle").run()}
            className="p-1 rounded text-xs text-text-secondary hover:text-text hover:bg-surface transition-colors ml-0.5"
            title="Reset Text Color"
          >
            <RotateCcw size={13} />
          </button>
        </div>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Heading 1 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded text-xs transition-colors ${
            editor.isActive("heading", { level: 1 })
              ? "bg-primary text-text"
              : "text-text-secondary hover:text-text hover:bg-surface"
          }`}
          title="Heading 1"
        >
          <Heading1 size={15} />
        </button>

        {/* Heading 2 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded text-xs transition-colors ${
            editor.isActive("heading", { level: 2 })
              ? "bg-primary text-text"
              : "text-text-secondary hover:text-text hover:bg-surface"
          }`}
          title="Heading 2"
        >
          <Heading2 size={15} />
        </button>

        {/* Heading 3 */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded text-xs transition-colors ${
            editor.isActive("heading", { level: 3 })
              ? "bg-primary text-text"
              : "text-text-secondary hover:text-text hover:bg-surface"
          }`}
          title="Heading 3"
        >
          <Heading3 size={15} />
        </button>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded text-xs transition-colors ${
            editor.isActive("bulletList")
              ? "bg-primary text-text"
              : "text-text-secondary hover:text-text hover:bg-surface"
          }`}
          title="Bullet List"
        >
          <List size={15} />
        </button>

        {/* Ordered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded text-xs transition-colors ${
            editor.isActive("orderedList")
              ? "bg-primary text-text"
              : "text-text-secondary hover:text-text hover:bg-surface"
          }`}
          title="Ordered List"
        >
          <ListOrdered size={15} />
        </button>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Inline Code */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-1.5 rounded text-xs transition-colors ${
            editor.isActive("code")
              ? "bg-primary text-text"
              : "text-text-secondary hover:text-text hover:bg-surface"
          }`}
          title="Inline Code"
        >
          <Code size={15} />
        </button>

        {/* Code Block */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded text-xs transition-colors ${
            editor.isActive("codeBlock")
              ? "bg-primary text-text"
              : "text-text-secondary hover:text-text hover:bg-surface"
          }`}
          title="Code Block"
        >
          <SquareCode size={15} />
        </button>

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded text-xs transition-colors ${
            editor.isActive("blockquote")
              ? "bg-primary text-text"
              : "text-text-secondary hover:text-text hover:bg-surface"
          }`}
          title="Blockquote"
        >
          <Quote size={15} />
        </button>

        {/* Horizontal Rule */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1.5 rounded text-xs text-text-secondary hover:text-text hover:bg-surface transition-colors"
          title="Horizontal Rule"
        >
          <Minus size={15} />
        </button>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Undo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded text-xs text-text-secondary hover:text-text hover:bg-surface disabled:opacity-40 transition-colors"
          title="Undo"
        >
          <Undo size={15} />
        </button>

        {/* Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded text-xs text-text-secondary hover:text-text hover:bg-surface disabled:opacity-40 transition-colors"
          title="Redo"
        >
          <Redo size={15} />
        </button>
      </div>

      {/* Editor Body */}
      <EditorContent editor={editor} />
    </div>
  );
}