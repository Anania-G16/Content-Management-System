"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ChevronDown } from "lucide-react";
import { DocumentationNode } from "@/data/documentationData";

interface DocTreeNodeProps {
  node: DocumentationNode;
  parentPath?: string;
  depth?: number;
  onNavigate?: () => void;
}

export default function DocTreeNode({
  node,
  parentPath = "/docs",
  depth = 0,
  onNavigate,
}: DocTreeNodeProps) {
  const pathname = usePathname();
  const currentPath = `${parentPath}/${node.slug}`;
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const isActive = pathname === currentPath;

  const isBranchActive =
    pathname === currentPath || pathname.startsWith(`${currentPath}/`);

  const [isExpanded, setIsExpanded] = useState(isBranchActive);

  useEffect(() => {
    if (isBranchActive) {
      setIsExpanded(true);
    }
  }, [isBranchActive]);

  const toggleExpand = (e: React.MouseEvent) => {
    if (hasChildren) {
      setIsExpanded((prev) => !prev);
    }
  };

  return (
    <li className="list-none">
      <div
        onClick={toggleExpand}
        className={`group flex items-center justify-between rounded-md text-sm font-medium transition-colors cursor-pointer ${
          isActive
            ? "bg-primary-active text-primary-text font-semibold"
            : "text-text-secondary hover:bg-surface hover:text-text"
        }`}
        style={{ paddingLeft: `${Math.max(0.5, depth * 0.75 + 0.5)}rem` }}
      >
        {/* Document Title Link */}
        <Link
          href={currentPath}
          onClick={onNavigate}
          className="flex-1 py-1.5 pr-2 truncate"
        >
          {node.title}
        </Link>

        {/* Expand / Collapse Chevron Indicator */}
        {hasChildren && (
          <span className="p-1 mr-1 text-inherit flex items-center justify-center">
            {isExpanded ? (
              <ChevronDown size={14} className="text-inherit" />
            ) : (
              <ChevronRight size={14} className="text-inherit" />
            )}
          </span>
        )}
      </div>

      {/* Recursive Children List */}
      {hasChildren && isExpanded && (
        <ul className="mt-0.5 space-y-0.5 border-l border-border/50 ml-3">
          {node.children!.map((child) => (
            <DocTreeNode
              key={child.id}
              node={child}
              parentPath={currentPath}
              depth={depth + 1}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      )}
    </li>
  );
}