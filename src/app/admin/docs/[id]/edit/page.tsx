"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Search,
  ChevronDown,
  X,
} from "lucide-react";
import DocumentEditor from "@/components/DocumentEditor";
import ParentDocumentSelector from "@/components/ParentDocumentSelector";
import IconSelector from "@/components/IconSelector";
import { DocumentationNode } from "@/data/documentationTree";
import { getClients, getDocumentPermissions } from "@/app/services/userService";
import Spinner from "@/components/Spinner";
import {
  getAdminDocumentTree,
  updateDocument,
} from "@/app/services/documentService";
import axios from "axios";

// Dummy users data
interface User {
  id: string;
  name: string;
  email: string;
}

type AccessType = "PUBLIC" | "CLIENT" | "PRIVATE";

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
  const [documents, setDocuments] = useState<DocumentationNode[]>([]);
  const [existingDoc, setExistingDoc] = useState<DocumentationNode | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<User[]>([]);

  // Form State initialized with found document data
  const [title, setTitle] = useState(existingDoc?.title || "");
  const [parentId, setParentId] = useState<string | null>(
    existingDoc?.parentId || null,
  );
  const [icon, setIcon] = useState<string | null>(
    existingDoc?.icon || "BookOpen",
  );
  const [editorContent, setEditorContent] = useState<object | null>(
    existingDoc?.content || null,
  );

  // Access Control State
  const [accessType, setAccessType] = useState<AccessType>("PUBLIC");
  const [allowedUsers, setAllowedUsers] = useState<string[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await getAdminDocumentTree();
        const clients = await getClients();
        setClients(clients);

        setDocuments(data);

        const document = findDocumentById(data, id);
        setExistingDoc(document);
        if (document) {
          const permissions = await getDocumentPermissions(document.id);
          setAllowedUsers(permissions.map((user: { _id: string }) => user._id));
        }
        if (document) {
          setTitle(document.title);
          setParentId(document.parentId);
          setIcon(document.icon || "BookOpen");
          setEditorContent(document.content || null);

          // Initialize Access Control State
          const rawAccess = (document as unknown as { accessLevel?: string })
            .accessLevel;
          if (rawAccess === "PRIVATE" || rawAccess === "SPECIFIC") {
            setAccessType("PRIVATE");
          } else if (rawAccess === "CLIENT" || rawAccess === "AUTHENTICATED") {
            setAccessType("CLIENT");
          } else {
            setAccessType("PUBLIC");
          }

          // Populate existing allowed user IDs
          const existingAllowedUsers: User[] =
            (document as unknown as { allowedUsers?: User[] }).allowedUsers ||
            [];
          if (existingAllowedUsers.length > 0) {
            setAllowedUsers(existingAllowedUsers.map((u) => u.id));
          } else if (
            (document as unknown as { allowedUserIds?: string[] })
              .allowedUserIds
          ) {
            setAllowedUsers(
              (document as unknown as { allowedUserIds?: string[] })
                .allowedUserIds || [],
            );
          }
        }
      } catch (err) {
        console.error("Failed to fetch document:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

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

  // Access Control User Selection Handlers
  const toggleUserSelection = (userId: string) => {
    if (allowedUsers.includes(userId)) {
      setAllowedUsers(allowedUsers.filter((id) => id !== userId));
    } else {
      setAllowedUsers([...allowedUsers, userId]);
    }
  };

  const removeUser = (userId: string) => {
    setAllowedUsers(allowedUsers.filter((id) => id !== userId));
  };

  const filteredUsers = clients.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchQuery.toLowerCase()),
  );

  const selectedUserObjects = clients.filter((user) =>
    allowedUsers.includes(user.id),
  );

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Document title is required.");
      return;
    }

    setError("");

    const payload = {
      title: title.trim(),
      slug: generatedSlug,
      parentId,
      icon: parentId === null ? icon : null,
      content: editorContent,
      status: existingDoc.status,
      accessLevel: accessType,
      allowedUsers: allowedUsers,
    };

    try {
      await updateDocument(existingDoc.id, payload);

      setSuccess(true);

      setTimeout(() => {
        router.push("/admin/docs");
      }, 1200);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.log("UPDATE ERROR RESPONSE:", err.response?.data);
        console.log("UPDATE ERROR STATUS:", err.response?.status);
      } else {
        console.log("UPDATE ERROR:", err);
      }

      setError("Failed to update document. Please try again.");
    }
  };

  const handleStatusChange = async () => {
    const newStatus = existingDoc.status === "DRAFT" ? "PUBLISHED" : "DRAFT";

    setError("");

    const payload = {
      title: existingDoc.title,
      slug: existingDoc.slug,
      parentId: existingDoc.parentId,
      icon: existingDoc.parentId === null ? existingDoc.icon : null,
      content: existingDoc.content,
      status: newStatus,
      accessLevel: accessType,
      allowedUsers: allowedUsers,
    };

    try {
      await updateDocument(existingDoc.id, payload);

      setSuccess(true);

      setTimeout(() => {
        router.push("/admin/docs");
      }, 1200);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.log("STATUS UPDATE ERROR RESPONSE:", err.response?.data);
        console.log("STATUS UPDATE ERROR STATUS:", err.response?.status);
      } else {
        console.log("STATUS UPDATE ERROR:", err);
      }

      setError(
        newStatus === "PUBLISHED"
          ? "Failed to publish document. Please try again."
          : "Failed to unpublish document. Please try again.",
      );
    }
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
          Update the title, hierarchy, access level, and content of this
          document.
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
            nodes={documents}
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

        {/* Access Control Section */}
        <div className="space-y-3 pt-2">
          <label className="block text-sm font-medium text-text">
            Access Control
          </label>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
              <input
                type="radio"
                name="accessType"
                value="PUBLIC"
                checked={accessType === "PUBLIC"}
                onChange={() => setAccessType("PUBLIC")}
                className="accent-primary"
              />
              Public
            </label>

            <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
              <input
                type="radio"
                name="accessType"
                value="CLIENT"
                checked={accessType === "CLIENT"}
                onChange={() => setAccessType("CLIENT")}
                className="accent-primary"
              />
              All authenticated users
            </label>

            <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
              <input
                type="radio"
                name="accessType"
                value="PRIVATE"
                checked={accessType === "PRIVATE"}
                onChange={() => setAccessType("PRIVATE")}
                className="accent-primary"
              />
              Specific users only
            </label>
          </div>

          {/* Restricted User Dropdown & Selection */}
          {accessType === "PRIVATE" && (
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-medium text-text-secondary">
                Allowed Users
              </label>

              {/* Selected User Chips */}
              {selectedUserObjects.length > 0 && (
                <div className="flex flex-wrap gap-2 pb-1">
                  {selectedUserObjects.map((user) => (
                    <span
                      key={user.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background border border-border text-xs font-medium text-text"
                    >
                      <span>{user.name}</span>
                      <button
                        type="button"
                        onClick={() => removeUser(user.id)}
                        className="text-text-secondary hover:text-danger transition-colors ml-0.5"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Multi-Select Dropdown Container */}
              <div className="relative">
                <div
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="w-full px-3 py-2 text-sm rounded-md bg-surface border border-border text-text flex items-center justify-between cursor-pointer focus-within:ring-1 focus-within:ring-primary"
                >
                  <div className="flex items-center gap-2 w-full mr-2">
                    <Search
                      size={14}
                      className="text-text-secondary shrink-0"
                    />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearchQuery}
                      onChange={(e) => {
                        setUserSearchQuery(e.target.value);
                        if (!isDropdownOpen) setIsDropdownOpen(true);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full bg-transparent text-text placeholder:text-text-secondary focus:outline-none"
                    />
                  </div>
                  <ChevronDown
                    size={14}
                    className="text-text-secondary shrink-0"
                  />
                </div>

                {/* Dropdown Options List */}
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto bg-surface border border-border rounded-md shadow-lg py-1">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => {
                        const isSelected = allowedUsers.includes(user.id);
                        return (
                          <div
                            key={user.id}
                            onClick={() => toggleUserSelection(user.id)}
                            className={`px-3 py-2 text-xs cursor-pointer flex items-center justify-between hover:bg-background/50 transition-colors ${
                              isSelected ? "bg-background/80 font-medium" : ""
                            }`}
                          >
                            <div>
                              <p className="text-text">{user.name}</p>
                              <p className="text-text-secondary text-[11px]">
                                {user.email}
                              </p>
                            </div>
                            {isSelected && (
                              <CheckCircle2
                                size={14}
                                className="text-primary shrink-0"
                              />
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-3 py-2 text-xs text-text-secondary">
                        No users found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

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

        <button
          type="button"
          onClick={handleStatusChange}
          className={
            existingDoc.status === "DRAFT"
              ? "px-4 py-2 text-xs font-medium rounded-md bg-success text-text hover:bg-success/90 transition-colors"
              : "px-4 py-2 text-xs font-medium rounded-md border border-danger/40 text-danger hover:bg-danger/10 transition-colors"
          }
        >
          {existingDoc.status === "DRAFT" ? "Publish" : "Unpublish"}
        </button>
      </div>
    </div>
  );
}
