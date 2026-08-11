"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Search } from "lucide-react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");

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
          <Search size={15} className="absolute left-3 text-text-secondary shrink-0" />
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
      <div className="flex items-center gap-3 shrink-0">
        <Link
          href="/login"
          className="px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md bg-surface border border-border text-text hover:bg-white/5 hover:border-white/20 transition-colors"
        >
          Sign In
        </Link>
      </div>
    </header>
  );
}