"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Search, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    }

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileOpen]);

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
      <div className="flex-1 max-w-md mx-4 sm:mx-8">
        <div className="relative flex items-center">
          <Search
            size={15}
            className="absolute left-3 text-text-secondary shrink-0"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documentation..."
            className="w-full pl-9 pr-3 py-1.5 text-sm rounded-md bg-surface border border-border text-text placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* Authentication Area */}
      <div className="flex items-center gap-3 shrink-0 relative" ref={dropdownRef}>
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