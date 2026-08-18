"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";
import { DocumentationNode } from "@/data/documentationTree";
import DocumentActions from "./DocumentActions";

interface DocumentTreeNodeProps {
  node: DocumentationNode;
  searchQuery: string;
  depth?: number;
  onDeleteRequest: (node: DocumentationNode) => void;
}

export function DocumentTreeNode({
  node,
  searchQuery,
  depth = 0,
  onDeleteRequest,
}: DocumentTreeNodeProps) {
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const [isExpanded, setIsExpanded] = useState(true);

  // Search filter matching
  const matchesSearch = node.title
    .toLowerCase()
    .includes(searchQuery.toLowerCase());
  const hasMatchingChild = node.children?.some(function check(child): boolean {
    return (
      child.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Boolean(child.children?.some(check))
    );
  });

  if (searchQuery && !matchesSearch && !hasMatchingChild) {
    return null;
  }

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="space-y-1">
      <div
        className="group flex items-center justify-between p-2.5 rounded-md bg-surface border border-border/60 hover:border-border transition-colors"
        style={{ marginLeft: `${depth * 1.25}rem` }}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
          {/* Expand/Collapse Chevron */}
          {hasChildren ? (
            <button
              type="button"
              onClick={toggleExpand}
              className="p-1 rounded text-text-secondary hover:text-text hover:bg-background transition-colors shrink-0"
              aria-label={isExpanded ? "Collapse section" : "Expand section"}
            >
              {isExpanded ? (
                <ChevronDown size={15} />
              ) : (
                <ChevronRight size={15} />
              )}
            </button>
          ) : (
            <span className="w-6 shrink-0" />
          )}

          <FileText size={16} className="text-primary shrink-0" />

          {/* Title & Slug */}
          <div className="min-w-0 truncate">
            <span className="text-sm font-medium text-text truncate block">
              <div className="flex items-center gap-2">
                <span>{node.title}</span>
                {node.status === "PUBLISHED" && (
                  <span className="px-1.5 py-0.5 rounded border border-success/30 bg-success/10 text-[10px] font-medium text-success">
                    Published
                  </span>
                )}
                {node.status === "DRAFT" && (
                  <span className="px-1.5 py-0.5 rounded border border-text-secondary/30 text-[10px] font-medium text-text-secondary">
                    Draft
                  </span>
                )}
              </div>
            </span>
            <span className="text-xs font-mono text-text-secondary truncate block">
              /docs/{node.slug}
            </span>
          </div>
        </div>

        {/* Action Menu */}
        <DocumentActions node={node} onDeleteRequest={onDeleteRequest} />
      </div>

      {/* Recursive Children */}
      {hasChildren && (isExpanded || searchQuery) && (
        <div className="space-y-1">
          {node.children!.map((child) => (
            <DocumentTreeNode
              key={child.id}
              node={child}
              searchQuery={searchQuery}
              depth={depth + 1}
              onDeleteRequest={onDeleteRequest}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface DocumentTreeProps {
  nodes: DocumentationNode[];
  searchQuery: string;
  onDeleteRequest: (node: DocumentationNode) => void;
}

export default function DocumentTree({
  nodes,
  searchQuery,
  onDeleteRequest,
}: DocumentTreeProps) {
  return (
    <div className="space-y-1.5">
      {nodes.map((node) => (
        <DocumentTreeNode
          key={node.id}
          node={node}
          searchQuery={searchQuery}
          onDeleteRequest={onDeleteRequest}
        />
      ))}
    </div>
  );
}
