"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { dummyDocumentationTree } from "@/data/documentationData";
import DocTreeNode from "./DocTreeNode";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 p-3 rounded-full bg-surface border border-border text-text hover:text-primary transition-colors shadow-lg"
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
        className={`fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-[#1a1a1a] border-r border-border flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
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