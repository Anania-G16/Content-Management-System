"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Globe,
  CheckCircle2,
  Search,
  X,
  ChevronDown,
} from "lucide-react";
import ParentDocumentSelector, {
  findNodePath,
} from "@/components/ParentDocumentSelector";
import DocumentEditor from "@/components/DocumentEditor";
import IconSelector from "@/components/IconSelector";
import {
  dummyDocumentationTree,
  DocumentationNode,
} from "@/data/documentationTree";
import { dummyUsers } from "@/data/userData";

export default function NewDocumentPage() {
  const router = useRouter();

  // Form State
  const [title, setTitle] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [icon, setIcon] = useState<string | null>("BookOpen");
  const [contentJson, setContentJson] = useState<object | null>(null);

  // Access Control State
  const [accessType, setAccessType] = useState<
    "PUBLIC" | "ALL_AUTHENTICATED" | "RESTRICTED"
  >("ALL_AUTHENTICATED");
  const [allowedUsers, setAllowedUsers] = useState<string[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Errors & Status
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [submittedPayload, setSubmittedPayload] = useState<object | null>(null);

  // Parent selection handler with icon state logic
  const handleParentSelect = (newParentId: string | null) => {
    setParentId(newParentId);
    if (newParentId !== null) {
      setIcon(null);
    } else if (icon === null) {
      setIcon("BookOpen");
    }
  };

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

  // Filter users based on search input
  const filteredUsers = dummyUsers.filter((user) => {
    const query = userSearchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const toggleUserSelection = (userId: string) => {
    setAllowedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const removeUser = (userId: string) => {
    setAllowedUsers((prev) => prev.filter((id) => id !== userId));
  };

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
      icon: parentId === null ? icon : null,
      content: contentJson,
      accessType: accessType,
      allowedUsers: accessType === "RESTRICTED" ? allowedUsers : [],
    };

    console.log("Created Document Payload:", payload);
    setSubmittedPayload(payload);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-text-secondary">
        <Link
          href="/admin/dashboard"
          className="hover:text-text transition-colors"
        >
          Documentation
        </Link>
        <ChevronRight size={12} />
        <span className="text-text font-medium">New Document</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text">
          New Document
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Create a new documentation page and choose its position in the
          hierarchy.
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
            <span className="text-primary truncate">{fullPreviewUrl}</span>
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
            onSelect={handleParentSelect}
          />
          <p className="text-xs text-text-secondary">
            Select "None — Root Document" to create a top-level section.
          </p>
        </div>

        {/* Conditional Icon Selector for Root Documents */}
        {parentId === null && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text">
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
                value="ALL_AUTHENTICATED"
                checked={accessType === "ALL_AUTHENTICATED"}
                onChange={() => setAccessType("ALL_AUTHENTICATED")}
                className="accent-primary"
              />
              All authenticated users
            </label>

            <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
              <input
                type="radio"
                name="accessType"
                value="RESTRICTED"
                checked={accessType === "RESTRICTED"}
                onChange={() => setAccessType("RESTRICTED")}
                className="accent-primary"
              />
              Specific users only
            </label>
          </div>

          {/* Restricted User Dropdown & Selection */}
          {accessType === "RESTRICTED" && (
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-medium text-text-secondary">
                Allowed Users
              </label>

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

              {/* Selected Users Chips */}
              {allowedUsers.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs text-text-secondary">Selected:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {allowedUsers.map((id) => {
                      const user = dummyUsers.find((u) => u.id === id);
                      if (!user) return null;
                      return (
                        <span
                          key={user.id}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-surface border border-border text-text"
                        >
                          {user.name}
                          <button
                            type="button"
                            onClick={() => removeUser(user.id)}
                            className="text-text-secondary hover:text-text transition-colors ml-0.5"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rich-Text Content Editor */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text">
            Document Content <span className="text-danger">*</span>
          </label>
          <DocumentEditor onChange={(json) => setContentJson(json)} />
          {contentError && (
            <p className="text-xs text-danger">{contentError}</p>
          )}
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
