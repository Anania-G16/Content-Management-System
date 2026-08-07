"use client";

import { useState } from "react";
import { Menu, X, BookOpen } from "lucide-react";
import { dummyDocumentationTree } from "@/data/documentationData";
import DocTreeNode from "./DocTreeNode";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-surface border border-border text-text hover:text-primary transition-colors"
        aria-label="Toggle Navigation"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-background border-r border-border flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header / Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-border shrink-0">
          <div className="p-1.5 rounded-md bg-primary/10 text-primary">
            <BookOpen size={20} />
          </div>
          <span className="font-semibold text-lg text-text tracking-wide">
            YGS Docs
          </span>
        </div>

        {/* Navigation Tree */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {dummyDocumentationTree.map((node) => (
              <DocTreeNode
                key={node.id}
                node={node}
                onNavigate={() => setIsOpen(false)}
              />
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}