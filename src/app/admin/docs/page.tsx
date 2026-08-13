"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, FileText, AlertTriangle, X } from "lucide-react";
import DocumentTree from "@/components/DocumentTree";
import { DocumentationNode } from "@/data/documentationTree";
import api from "@/lib/api";
import { getAdminDocumentTree, deleteDocument } from "@/app/services/documentService";


export default function AdminDocsPage() {
  const [documents, setDocuments] = useState<DocumentationNode[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [nodeToDelete, setNodeToDelete] = useState<DocumentationNode | null>(
    null,
  );
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await getAdminDocumentTree();
        setDocuments(data);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      }
    };

    fetchDocuments();
  }, []);
  // Helper to check if search returns any visible nodes
  const hasSearchResults = (
    nodes: DocumentationNode[],
    query: string,
  ): boolean => {
    if (!query) return nodes.length > 0;
    return nodes.some(function check(node): boolean {
      if (node.title.toLowerCase().includes(query.toLowerCase())) return true;
      return Boolean(node.children?.some(check));
    });
  };

  const isTreeEmpty = documents.length === 0;
  const isSearchEmpty =
    !isTreeEmpty && !hasSearchResults(documents, searchQuery);

  const confirmDelete = async () => {
  if (!nodeToDelete) return;

  try {
    await deleteDocument(nodeToDelete.id);

    // Only update the UI after the backend successfully deletes it
    const removeNode = (list: DocumentationNode[]): DocumentationNode[] => {
      return list
        .filter((item) => item.id !== nodeToDelete.id)
        .map((item) => ({
          ...item,
          children: item.children ? removeNode(item.children) : undefined,
        }));
    };

    setDocuments((prev) => removeNode(prev));
    setNodeToDelete(null);
  } catch (error) {
    console.error("Failed to delete document:", error);
  }
};

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text">
            Documentation
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage and organize your documentation structure.
          </p>
        </div>

        <Link
          href="/admin/docs/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-text text-sm font-medium hover:bg-primary-active transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>New Document</span>
        </Link>
      </div>

      {/* Search Bar */}
      {!isTreeEmpty && (
        <div className="relative max-w-md">
          <Search
            size={15}
            className="absolute left-3 top-3 text-text-secondary"
          />
          <input
            type="text"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-md bg-surface border border-border text-text placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>
      )}

      {/* Document Tree Content */}
      {!isTreeEmpty && !isSearchEmpty && (
        <DocumentTree
          nodes={documents}
          searchQuery={searchQuery}
          onDeleteRequest={(node) => setNodeToDelete(node)}
        />
      )}

      {/* Search Empty State */}
      {isSearchEmpty && (
        <div className="p-8 text-center rounded-md bg-surface border border-border space-y-3">
          <p className="text-sm text-text-secondary">
            No documentation matching{" "}
            <span className="text-text font-medium">"{searchQuery}"</span>.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-xs font-medium text-primary hover:underline"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Complete Root Empty State */}
      {isTreeEmpty && (
        <div className="p-12 text-center rounded-md bg-surface border border-border space-y-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary w-fit mx-auto">
            <FileText size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-text">
              No documentation yet
            </h3>
            <p className="text-sm text-text-secondary max-w-sm mx-auto">
              Create your first document to start building your documentation
              tree.
            </p>
          </div>
          <Link
            href="/admin/docs/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary text-text text-sm font-medium hover:bg-primary-active transition-colors"
          >
            <Plus size={16} />
            <span>Create First Document</span>
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {nodeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-md bg-surface border border-border p-6 space-y-4 shadow-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-danger">
                <AlertTriangle size={20} />
                <h3 className="text-lg font-bold text-text">Delete Document</h3>
              </div>
              <button
                type="button"
                onClick={() => setNodeToDelete(null)}
                className="text-text-secondary hover:text-text"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-text">
                "{nodeToDelete.title}"
              </span>
              ?
              {nodeToDelete.children && nodeToDelete.children.length > 0 && (
                <span className="block mt-1 text-danger">
                  Warning: This will also remove all nested child documents
                  under it.
                </span>
              )}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setNodeToDelete(null)}
                className="px-4 py-2 text-xs font-medium rounded-md border border-border text-text-secondary hover:text-text hover:bg-background transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-medium rounded-md bg-danger text-text hover:bg-danger/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
