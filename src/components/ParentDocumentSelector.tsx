"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, ChevronRight, Search, Check, FileText } from "lucide-react";
import { DocumentationNode } from "@/data/documentationTree";

export interface ParentDocumentSelectorProps {
  nodes: DocumentationNode[];
  selectedId?: string | null;
  selectedParentId?: string | null;
  onSelect: (parentId: string | null) => void;
  currentDocumentId?: string;
}

// Helper function to build dynamic slug preview paths
export function findNodePath(
  nodes: DocumentationNode[],
  targetId: string | null
): string[] {
  if (!targetId) return [];

  function search(tree: DocumentationNode[], currentPath: string[]): string[] | null {
    for (const node of tree) {
      const newPath = [...currentPath, node.slug];
      if (node.id === targetId) return newPath;
      if (node.children) {
        const found = search(node.children, newPath);
        if (found) return found;
      }
    }
    return null;
  }

  return search(nodes, []) || [];
}

// Helper function to find selected node title
function findNodeTitle(nodes: DocumentationNode[], targetId: string | null): string {
  if (!targetId) return "None — Root Document";

  function search(tree: DocumentationNode[]): string | null {
    for (const node of tree) {
      if (node.id === targetId) return node.title;
      if (node.children) {
        const found = search(node.children);
        if (found) return found;
      }
    }
    return null;
  }

  return search(nodes) || "None — Root Document";
}

// Collect forbidden node IDs (current document + all descendants)
function collectForbiddenIds(
  nodes: DocumentationNode[],
  currentDocumentId?: string
): Set<string> {
  const forbidden = new Set<string>();
  if (!currentDocumentId) return forbidden;

  function traverse(node: DocumentationNode, isMatch: boolean) {
    const matched = isMatch || node.id === currentDocumentId;
    if (matched) forbidden.add(node.id);

    if (node.children) {
      for (const child of node.children) {
        traverse(child, matched);
      }
    }
  }

  for (const node of nodes) {
    traverse(node, false);
  }

  return forbidden;
}

interface TreeNodeProps {
  node: DocumentationNode;
  selectedId: string | null;
  searchQuery: string;
  depth?: number;
  onSelect: (parentId: string) => void;
  forbiddenIds: Set<string>;
}

function DocumentTreeNode({
  node,
  selectedId,
  searchQuery,
  depth = 0,
  onSelect,
  forbiddenIds,
}: TreeNodeProps) {
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const isSelected = node.id === selectedId;
  const isForbidden = forbiddenIds.has(node.id);

  const [isExpanded, setIsExpanded] = useState(true);

  // Match search filter (Types explicit to resolve noImplicitAny)
  const matchesSearch = node.title.toLowerCase().includes(searchQuery.toLowerCase());
  const hasMatchingChild = node.children?.some(function check(
    child: DocumentationNode
  ): boolean {
    return (
      child.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Boolean(child.children?.some((c: DocumentationNode) => check(c)))
    );
  });

  if (searchQuery && !matchesSearch && !hasMatchingChild) {
    return null;
  }

  return (
    <div className="text-sm">
      <div
        onClick={() => {
          if (!isForbidden) onSelect(node.id);
        }}
        className={`flex items-center justify-between rounded-md px-2 py-1.5 transition-colors ${
          isForbidden
            ? "opacity-40 cursor-not-allowed bg-background/50 text-text-secondary"
            : isSelected
            ? "bg-primary/10 text-primary font-medium cursor-pointer"
            : "hover:bg-surface text-text-secondary hover:text-text cursor-pointer"
        }`}
        style={{ paddingLeft: `${Math.max(0.5, depth * 1.25 + 0.5)}rem` }}
      >
        <div className="flex-1 flex items-center gap-2 truncate">
          <FileText size={14} className="shrink-0 text-text-secondary" />
          <span className="truncate">
            {node.title}{" "}
            {isForbidden && (
              <span className="text-[10px] italic text-text-secondary ml-1">
                (invalid parent)
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {isSelected && <Check size={14} className="text-primary shrink-0" />}
          {hasChildren && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="p-1 rounded hover:bg-background/80 text-text-secondary"
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
        </div>
      </div>

      {hasChildren && (isExpanded || searchQuery) && (
        <div className="space-y-0.5">
          {node.children!.map((child: DocumentationNode) => (
            <DocumentTreeNode
              key={child.id}
              node={child}
              selectedId={selectedId}
              searchQuery={searchQuery}
              depth={depth + 1}
              onSelect={onSelect}
              forbiddenIds={forbiddenIds}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ParentDocumentSelector({
  nodes,
  selectedId,
  selectedParentId,
  onSelect,
  currentDocumentId,
}: ParentDocumentSelectorProps) {
  const activeSelectedId =
    selectedParentId !== undefined ? selectedParentId : (selectedId ?? null);

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const forbiddenIds = useMemo(
    () => collectForbiddenIds(nodes, currentDocumentId),
    [nodes, currentDocumentId]
  );

  const selectedTitle = findNodeTitle(nodes, activeSelectedId);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-md bg-surface border border-border text-text hover:border-text-secondary/50 focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
      >
        <span className="truncate">{selectedTitle}</span>
        <ChevronDown size={16} className="text-text-secondary shrink-0 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-30 mt-1 w-full rounded-md bg-surface border border-border shadow-lg p-2 space-y-2">
          {/* Search Input */}
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded bg-background border border-border text-text placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Tree Options */}
          <div className="max-h-56 overflow-y-auto space-y-0.5 pt-1">
            {/* Root / None Option */}
            <div
              onClick={() => {
                onSelect(null);
                setIsOpen(false);
              }}
              className={`flex items-center justify-between px-2 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${
                activeSelectedId === null
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-background text-text-secondary hover:text-text"
              }`}
            >
              <span>None — Root Document</span>
              {activeSelectedId === null && <Check size={14} className="text-primary" />}
            </div>

            <div className="border-t border-border my-1" />

            {nodes.map((node: DocumentationNode) => (
              <DocumentTreeNode
                key={node.id}
                node={node}
                selectedId={activeSelectedId}
                searchQuery={searchQuery}
                onSelect={(selected) => {
                  onSelect(selected);
                  setIsOpen(false);
                }}
                forbiddenIds={forbiddenIds}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}