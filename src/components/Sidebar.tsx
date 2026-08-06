"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, BookOpen, ChevronRight, ChevronDown } from "lucide-react";

interface NavItem {
  title: string;
  href: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs/introduction" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Quickstart", href: "/docs/quickstart" },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      { title: "Theming", href: "/docs/theming" },
      { title: "Components", href: "/docs/components" },
      { title: "API Reference", href: "/docs/api" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Track expanded section titles
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "Getting Started": true,
    "Core Concepts": true,
  });

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

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
        <div className="h-16 flex items-center gap-3 px-6 border-b border-border">
          <div className="p-1.5 rounded-md bg-primary/10 text-primary">
            <BookOpen size={20} />
          </div>
          <span className="font-semibold text-lg text-text tracking-wide">
            YGS Docs
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {navigation.map((section) => {
            const isExpanded = openSections[section.title] ?? true;

            return (
              <div key={section.title}>
                {/* Section Toggle Button */}
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-sm font-semibold text-text-secondary uppercase tracking-wider hover:text-text transition-colors rounded-md"
                >
                  <span>{section.title}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      isExpanded ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                </button>

                {/* Collapsible List */}
                {isExpanded && (
                  <ul className="mt-1 space-y-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href;

                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`group flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              isActive
                                ? "bg-primary-active text-primary-text"
                                : "text-text-secondary hover:bg-surface hover:text-text"
                            }`}
                          >
                            <span>{item.title}</span>
                            {isActive && (
                              <ChevronRight
                                size={14}
                                className="text-primary-text"
                              />
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}