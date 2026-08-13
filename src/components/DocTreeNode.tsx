"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ChevronDown } from "lucide-react";
import { DocumentationNode } from "@/data/documentationData";
import { getDocIcon } from "@/lib/iconMap";

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

  // Check if it's a root document (depth is 0 or parentId is null)
  const isRootNode = depth === 0 || node.parentId === null;
  const RootIconComponent = isRootNode ? getDocIcon(node.icon) : null;

  return (
    <li className="list-none">
      <div
        onClick={toggleExpand}
        className={`group flex items-center justify-between rounded-md text-sm font-medium transition-colors cursor-pointer border ${
          isActive
            ? "bg-accent/40 text-text font-semibold border-border/50"
            : "border-transparent text-text-secondary hover:bg-accent/20 hover:text-text"
        }`}
        style={{ paddingLeft: `${Math.max(0.5, depth * 0.75 + 0.5)}rem` }}
      >
        {/* Document Title Link & Root Icon */}
        <Link
          href={currentPath}
          onClick={onNavigate}
          className="flex-1 py-1.5 pr-2 truncate flex items-center gap-2"
        >
          {RootIconComponent && (
            <RootIconComponent
              size={16}
              className="shrink-0 text-text-secondary group-hover:text-text transition-colors"
            />
          )}
          <span className="truncate">{node.title}</span>
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
      {hasChildren && (
        <div
          className={`grid transition-all duration-200 ease-out ${
            isExpanded
              ? "grid-rows-[1fr] opacity-100 mt-0.5"
              : "grid-rows-[0fr] opacity-0 mt-0"
          }`}
        >
          <div className="overflow-hidden">
            <ul className="space-y-0.5 border-l border-border/40 ml-3">
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
          </div>
        </div>
      )}
    </li>
  );
}