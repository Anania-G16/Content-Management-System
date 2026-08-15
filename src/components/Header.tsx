"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Search, User, LogOut, LayoutDashboard, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getPublicDocumentTree } from "@/app/services/documentService";
import type { DocumentationNode } from "@/data/documentationTree";

interface FlattenedDoc {
  id: string;
  title: string;
  slug: string;
  path: string;
  url: string;
}

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [docTree, setDocTree] = useState<DocumentationNode[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  
  const router = useRouter();
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Fetch documentation tree on component mount
  useEffect(() => {
    let isMounted = true;
    getPublicDocumentTree()
      .then((tree) => {
        if (isMounted && tree) {
          setDocTree(tree);
        }
      })
      .catch((err) => {
        console.error("Failed to load documentation search index:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Recursively flatten tree into searchable document list with hierarchy paths and URLs
  const flattenedDocs = useMemo(() => {
    const results: FlattenedDoc[] = [];

    function traverse(node: DocumentationNode, parentPath: string[], parentSlugs: string[]) {
      const currentPath = [...parentPath, node.title];
      const currentSlugs = [...parentSlugs, node.slug];
      const url = `/docs/${currentSlugs.join("/")}`;

      results.push({
        id: node.id,
        title: node.title,
        slug: node.slug,
        path: currentPath.join(" / "),
        url,
      });

      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => traverse(child, currentPath, currentSlugs));
      }
    }

    docTree.forEach((node) => traverse(node, [], []));
    return results;
  }, [docTree]);

  // Filter documents based on searchQuery
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return flattenedDocs.filter((doc) =>
      doc.title.toLowerCase().includes(query)
    );
  }, [searchQuery, flattenedDocs]);

  // Handle click outside and escape keys for profile and search dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
        setIsSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelectDoc = (url: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    router.push(url);
  };

  return (
    <header className="sticky top-0 z-40 h-16 w-full bg-[#1a1a1a]/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 sm:px-6">
      {/* Company / Logo Area */}
      <Link href="/docs" className="flex items-center gap-3 group">
        <div className="p-1.5 rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
          <BookOpen size={20} />
        </div>
        <span className="font-semibold text-lg text-text tracking-wide">
          YGS Docs
        </span>
      </Link>

      {/* Search Area */}
      <div className="flex-1 max-w-md mx-4 sm:mx-8 relative" ref={searchContainerRef}>
        <div className="relative flex items-center">
          <Search
            size={15}
            className="absolute left-3 text-text-secondary shrink-0"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search documentation..."
            className="w-full pl-9 pr-3 py-1.5 text-sm rounded-md bg-surface border border-border text-text placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
          />
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && searchQuery.trim().length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 rounded-lg bg-surface border border-border shadow-2xl p-1.5 text-text z-50 max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
            {searchResults.length > 0 ? (
              <ul className="space-y-0.5">
                {searchResults.map((doc) => (
                  <li key={doc.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectDoc(doc.url)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-white/5 transition-colors group flex items-start gap-2.5"
                    >
                      <FileText
                        size={16}
                        className="text-text-secondary group-hover:text-primary shrink-0 mt-0.5 transition-colors"
                      />
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-medium text-text group-hover:text-primary transition-colors truncate">
                          {doc.title}
                        </span>
                        <span className="text-xs text-text-secondary truncate font-mono">
                          {doc.path}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-3 py-4 text-center text-sm text-text-secondary">
                No documents found matching &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Authentication Area */}
      <div className="flex items-center gap-3 shrink-0 relative" ref={profileDropdownRef}>
        {isAuthenticated && user ? (
          <>
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 text-text flex items-center justify-center text-base font-semibold hover:bg-zinc-700 hover:border-zinc-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
              title={user.fullName}
              aria-expanded={isProfileOpen}
              aria-haspopup="true"
            >
              {user.fullName.charAt(0).toUpperCase()}
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-lg bg-surface border border-border shadow-2xl p-2 text-text z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {/* User Info Section */}
                <div className="flex items-center gap-3 p-2.5 rounded-md bg-background/50 border border-border/50">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-base text-text">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-semibold text-sm text-text truncate">
                      {user.fullName}
                    </span>
                    <span className="text-xs text-text-secondary truncate">
                      {user.email}
                    </span>
                    <div className="mt-1">
                      <span className="inline-block text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="my-1.5 border-t border-border" />

                {/* Navigation & Actions */}
                <div className="space-y-0.5">
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md text-text-secondary hover:text-text hover:bg-white/5 transition-colors"
                    >
                      <LayoutDashboard size={16} />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md text-text-secondary hover:text-text hover:bg-white/5 transition-colors"
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-sm font-medium rounded-md text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <Link
            href="/login"
            className="px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md bg-surface border border-border text-text hover:bg-white/5 hover:border-white/20 transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}