"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

interface DocumentRendererProps {
  content: object;
}

export default function DocumentRenderer({
  content,
}: DocumentRendererProps) {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color],
    content,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap-document",
      },
    },
  });

  if (!editor) return null;

  return (
    <>
      <style>{`
        .tiptap-document h1 {
          font-size: 1.875rem;
          font-weight: 800;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          line-height: 1.25;
        }

        .tiptap-document h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 0.875rem;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .tiptap-document h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 0.75rem;
          margin-bottom: 0.375rem;
          line-height: 1.4;
        }

        .tiptap-document ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .tiptap-document ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .tiptap-document li {
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
        }

        .tiptap-document blockquote {
          border-left: 3px solid var(--color-primary, #6366f1);
          padding-left: 1rem;
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
          font-style: italic;
          color: var(--color-text-secondary, #94a3b8);
        }

        .tiptap-document code {
          background-color: rgba(255, 255, 255, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.875em;
        }

        .tiptap-document pre {
          background-color: #080d1a;
          color: #f1f5f9;
          padding: 0.75rem 1rem;
          border-radius: 0.375rem;
          font-family: monospace;
          margin-top: 0.75rem;
          margin-bottom: 0.75rem;
          overflow-x: auto;
        }

        .tiptap-document hr {
          border: none;
          border-top: 1px solid var(--color-border, #1e293b);
          margin-top: 1rem;
          margin-bottom: 1rem;
        }

        .tiptap-document p {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
      `}</style>

      <EditorContent editor={editor} />
    </>
  );
}