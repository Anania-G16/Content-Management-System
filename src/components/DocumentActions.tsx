"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoreVertical, Edit, Plus, Trash2, AlertTriangle, X } from "lucide-react";
import { DocumentationNode } from "@/data/documentationTree";

interface DocumentActionsProps {
  node: DocumentationNode;
  onDeleteRequest: (node: DocumentationNode) => void;
}

export default function DocumentActions({ node, onDeleteRequest }: DocumentActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      {/* Quick Edit Link */}
      <Link
        href={`/admin/docs/${node.id}/edit`}
        className="px-2.5 py-1 text-xs font-medium rounded border border-border bg-background text-text-secondary hover:text-text hover:bg-surface transition-colors"
      >
        Edit
      </Link>

      {/* More Actions Menu */}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded text-text-secondary hover:text-text hover:bg-background transition-colors"
          aria-label="More actions"
        >
          <MoreVertical size={16} />
        </button>

        {isOpen && (
          <div className="absolute right-0 z-30 mt-1 w-48 rounded-md bg-surface border border-border shadow-lg py-1 text-xs">
            <Link
              href={`/admin/docs/${node.id}/edit`}
              className="flex items-center gap-2 px-3 py-2 text-text-secondary hover:text-text hover:bg-background transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Edit size={14} />
              <span>Edit Document</span>
            </Link>

            <Link
              href={`/admin/docs/new?parentId=${node.id}`}
              className="flex items-center gap-2 px-3 py-2 text-text-secondary hover:text-text hover:bg-background transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Plus size={14} />
              <span>Add Child Document</span>
            </Link>

            <div className="border-t border-border my-1" />

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onDeleteRequest(node);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-danger hover:bg-danger/10 transition-colors text-left"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}