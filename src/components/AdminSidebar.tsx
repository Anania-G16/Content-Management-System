"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Documents",
    href: "/admin/docs",
    icon: FileText,
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: Users,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
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
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-surface border-r border-border flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header / Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-md bg-accent/30 text-text">
              <ShieldCheck size={20} />
            </div>
            <span className="font-semibold text-lg text-text tracking-wide">
              CMS Admin
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-background border border-border text-text-secondary">
            v1.0
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          <div>
            <div className="px-3 py-1.5 text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Management
            </div>
            <ul className="space-y-1">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`group flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors border ${
                        isActive
                          ? "bg-accent/40 text-text font-semibold border-border/50"
                          : "border-transparent text-text-secondary hover:bg-accent/20 hover:text-text"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} />
                        <span>{item.title}</span>
                      </div>
                      {isActive && (
                        <ChevronRight
                          size={14}
                          className="text-text-secondary"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Footer / Logout Button */}
        <div className="p-4 border-t border-border shrink-0">
          <button
            onClick={() => {
              setIsOpen(false);
              // Handle logout logic here
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
