"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Globe, CheckCircle2 } from "lucide-react";
import ParentDocumentSelector, {
  findNodePath,
} from "@/components/ParentDocumentSelector";
import DocumentEditor from "@/components/DocumentEditor";
import {
  dummyDocumentationTree,
  DocumentationNode,
} from "@/data/documentationTree";

export default function NewDocumentPage() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [contentJson, setContentJson] = useState<object | null>(null);

  // Errors & Status
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [submittedPayload, setSubmittedPayload] = useState<object | null>(null);

  // Slug auto-generation helper
  const generatedSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // Build full route path for preview
  const parentPathSegments = findNodePath(dummyDocumentationTree, parentId);
  const fullPreviewUrl = `/docs/${[...parentPathSegments, generatedSlug || "new-document"].join("/")}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let isValid = true;
    setTitleError("");
    setContentError("");

    if (!title.trim()) {
      setTitleError("Document title is required.");
      isValid = false;
    }

    if (!contentJson || Object.keys(contentJson).length === 0) {
      setContentError("Document content cannot be empty.");
      isValid = false;
    }

    if (!isValid) return;

    const payload = {
      title: title.trim(),
      slug: generatedSlug,
      parentId: parentId,
      content: contentJson,
    };

    console.log("Created Document Payload:", payload);
    setSubmittedPayload(payload);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-text-secondary">
        <Link href="/admin/dashboard" className="hover:text-text transition-colors">
          Documentation
        </Link>
        <ChevronRight size={12} />
        <span className="text-text font-medium">New Document</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text">New Document</h1>
        <p className="text-sm text-text-secondary mt-1">
          Create a new documentation page and choose its position in the hierarchy.
        </p>
      </div>

      {/* Success Notification Banner */}
      {submittedPayload && (
        <div className="p-4 rounded-md bg-success/10 border border-success/20 text-success space-y-2">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <CheckCircle2 size={16} />
            <span>Document created successfully (logged to console)</span>
          </div>
          <pre className="text-xs bg-background/50 p-3 rounded text-text overflow-x-auto font-mono">
            {JSON.stringify(submittedPayload, null, 2)}
          </pre>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text">
            Document Title <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Getting Started"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-md bg-surface border border-border text-text placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
          {titleError && <p className="text-xs text-danger">{titleError}</p>}

          {/* URL Route Preview */}
          <div className="flex items-center gap-1.5 text-xs text-text-secondary font-mono mt-1">
            <Globe size={13} className="shrink-0" />
            <span>Preview URL:</span>
            <span className="text-accent truncate">{fullPreviewUrl}</span>
          </div>
        </div>

        {/* Parent Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text">
            Parent Documentation
          </label>
          <ParentDocumentSelector
            nodes={dummyDocumentationTree}
            selectedId={parentId}
            onSelect={setParentId}
          />
          <p className="text-xs text-text-secondary">
            Select "None — Root Document" to create a top-level section.
          </p>
        </div>

        {/* Rich-Text Content Editor */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text">
            Document Content <span className="text-danger">*</span>
          </label>
          <DocumentEditor onChange={(json) => setContentJson(json)} />
          {contentError && <p className="text-xs text-danger">{contentError}</p>}
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard")}
            className="px-4 py-2 text-sm font-medium rounded-md border border-border text-text-secondary hover:text-text hover:bg-surface transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-text hover:bg-primary-active transition-colors shadow-sm"
          >
            Create Document
          </button>
        </div>
      </form>
    </div>
  );
}