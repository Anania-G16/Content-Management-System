"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      {/* Global Header */}
      <Header />

      <div className="flex flex-1">
        {/* Documentation Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 min-w-0 p-6 sm:p-8 lg:p-12">
          <div className="max-w-4xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}