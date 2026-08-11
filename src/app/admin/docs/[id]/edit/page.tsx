"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, FileText, CheckCircle2 } from "lucide-react";
import DocumentEditor from "@/components/DocumentEditor";
import ParentDocumentSelector from "@/components/ParentDocumentSelector";
import IconSelector from "@/components/IconSelector";
import {
  dummyDocumentationTree,
  DocumentationNode,
} from "@/data/documentationTree";

// Flatten document tree helper to easily find matching route ID
function findDocumentById(
  nodes: DocumentationNode[],
  targetId: string,
): DocumentationNode | null {
  for (const node of nodes) {
    if (node.id === targetId) return node;
    if (node.children) {
      const found = findDocumentById(node.children, targetId);
      if (found) return found;
    }
  }
  return null;
}

// Convert title to URL slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function EditDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  // Look up document in initial dummy data
  const existingDoc = findDocumentById(dummyDocumentationTree, id);

  // Form State initialized with found document data
  const [title, setTitle] = useState(existingDoc?.title || "");
  const [parentId, setParentId] = useState<string | null>(
    existingDoc?.parentId || null,
  );
  const [icon, setIcon] = useState<string | null>(
    existingDoc?.icon || "BookOpen"
  );
  const [editorContent, setEditorContent] = useState<object | null>(
    existingDoc?.content || null,
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!existingDoc) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center space-y-4">
        <div className="p-3 rounded-full bg-danger/10 text-danger w-fit mx-auto">
          <AlertCircle size={28} />
        </div>
        <h1 className="text-2xl font-bold text-text">Document Not Found</h1>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          The documentation page with ID{" "}
          <code className="text-primary font-mono">{id}</code> does not exist or
          was removed.
        </p>
        <Link
          href="/admin/docs"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-surface border border-border text-text hover:bg-background transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Documentation</span>
        </Link>
      </div>
    );
  }

  const generatedSlug = generateSlug(title);

  // Handle Parent Changes
  const handleParentChange = (newParentId: string | null) => {
    setParentId(newParentId);
    if (newParentId !== null) {
      setIcon(null);
    } else {
      setIcon(existingDoc.icon || "BookOpen");
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      setError("Document title is required.");
      return;
    }

    setError("");

    const payload = {
      id: existingDoc.id,
      title: title.trim(),
      slug: generatedSlug,
      parentId,
      icon: parentId === null ? icon : null,
      content: editorContent,
    };

    console.log("Updated Document Payload:", payload);
    setSuccess(true);

    setTimeout(() => {
      router.push("/admin/docs");
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Breadcrumbs & Title */}
      <div className="space-y-2 border-b border-border pb-6">
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <Link
            href="/admin/docs"
            className="hover:text-text transition-colors"
          >
            Documentation
          </Link>
          <span>/</span>
          <span className="text-text font-medium">Edit Document</span>
        </div>
        <h1 className="text-2xl font-bold text-text">Edit Document</h1>
        <p className="text-sm text-text-secondary">
          Update the title, hierarchy, and content of this document.
        </p>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3 rounded-md bg-danger/10 border border-danger/30 text-danger text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Document updated successfully! Redirecting...</span>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-6 bg-surface border border-border p-6 rounded-md">
        {/* Title & Slug Preview */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-text uppercase tracking-wider">
            Document Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Installation Guide"
            className="w-full px-3 py-2 text-sm rounded-md bg-background border border-border text-text placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
          <div className="text-xs text-text-secondary font-mono">
            URL: <span className="text-primary">/docs/{generatedSlug}</span>
          </div>
        </div>

        {/* Parent Document Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-text uppercase tracking-wider">
            Parent Document
          </label>
          <ParentDocumentSelector
            nodes={dummyDocumentationTree}
            selectedId={parentId}
            onSelect={handleParentChange}
            currentDocumentId={existingDoc.id}
          />
        </div>

        {/* Conditional Icon Selector for Root Documents */}
        {parentId === null && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-text uppercase tracking-wider">
              Root Icon
            </label>
            <IconSelector selectedIcon={icon} onSelect={setIcon} />
          </div>
        )}

        {/* Content Editor */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-text uppercase tracking-wider">
            Document Content
          </label>
          <DocumentEditor
            initialContent={existingDoc.content}
            onChange={(json) => setEditorContent(json)}
          />
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link
          href="/admin/docs"
          className="px-4 py-2 text-xs font-medium rounded-md border border-border text-text-secondary hover:text-text hover:bg-surface transition-colors"
        >
          Cancel
        </Link>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 text-xs font-medium rounded-md bg-primary text-text hover:bg-primary-active transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}