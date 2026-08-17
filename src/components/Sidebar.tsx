"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { DocumentationNode } from "@/data/documentationTree";
import DocTreeNode from "./DocTreeNode";
import { getPublicDocumentTree } from "@/app/services/documentService";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SKELETON_TREE_ITEMS = [
  { level: 0, width: "70%", hasChevron: true },
  { level: 1, width: "60%", hasChevron: false },
  { level: 1, width: "65%", hasChevron: false },
  { level: 1, width: "50%", hasChevron: false },
  
  
  { level: 0, width: "75%", hasChevron: true },
  { level: 1, width: "55%", hasChevron: true },
  { level: 2, width: "45%", hasChevron: false },
  { level: 2, width: "60%", hasChevron: false },
  { level: 1, width: "68%", hasChevron: false },

  
  { level: 0, width: "80%", hasChevron: true },
  { level: 1, width: "58%", hasChevron: false },
  { level: 1, width: "62%", hasChevron: false },

];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [documents, setDocuments] = useState<DocumentationNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const documents = await getPublicDocumentTree();
        setDocuments(documents);
      } catch (error) {
        console.error("Failed to fetch documentation:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

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
        className={`fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-surface border-r border-border flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Navigation Tree */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {isLoading ? (
            <SkeletonTheme baseColor="#1a1a1a" highlightColor="#2a2a2a">
              <div className="space-y-1">
                {SKELETON_TREE_ITEMS.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 h-8 px-2 rounded"
                    style={{ paddingLeft: `${item.level * 16 + 8}px` }}
                  >
                    {item.hasChevron ? (
                      <Skeleton circle width={12} height={12} />
                    ) : (
                      <span className="w-3 inline-block" />
                    )}
                    <Skeleton circle width={14} height={14} />
                    <div className="flex-1">
                      <Skeleton height={14} width={item.width} />
                    </div>
                  </div>
                ))}
              </div>
            </SkeletonTheme>
          ) : (
            <ul className="space-y-1">
              {documents.map((node) => (
                <DocTreeNode
                  key={node.id}
                  node={node}
                  onNavigate={() => setIsOpen(false)}
                />
              ))}
            </ul>
          )}
        </nav>
      </aside>
    </>
  );
}