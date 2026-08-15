import { BookOpen, Compass, FolderTree, Sparkles } from "lucide-react";

export default function DocsLandingPage() {
  return (
    <article className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header Badge & Title */}
      <div className="space-y-4 mb-8">
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-text tracking-tight">
          Welcome to YGS Docs
        </h1>
        <p className="text-lg text-text-secondary leading-relaxed max-w-2xl">
          Your central repository for project documentation, architectural guides, API references, and team knowledge bases.
        </p>
      </div>

      <hr className="border-border my-8" />

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Getting Started Card */}
        <div className="p-6 rounded-xl bg-surface border border-border space-y-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Compass size={20} />
          </div>
          <h2 className="text-xl font-bold text-text tracking-tight">
            Getting Started
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Use the sidebar on the left to browse through available modules, guides, and specifications. Click on any page title to view its full documentation.
          </p>
        </div>

        {/* Nested Content Card */}
        <div className="p-6 rounded-xl bg-surface border border-border space-y-3">
          <div className="w-10 h-10 rounded-lg bg-accent/20 text-text flex items-center justify-center">
            <FolderTree size={20} />
          </div>
          <h2 className="text-xl font-bold text-text tracking-tight">
            Nested Structure
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Documents are organized hierarchically. Expand nested sections in the sidebar tree view to discover sub-topics, API endpoints, and detailed sub-pages.
          </p>
        </div>
      </div>

      {/* Encouraging Closing Banner */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-surface via-surface to-accent/10 border border-border flex items-start sm:items-center gap-4">
        <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0 hidden sm:block">
          <BookOpen size={24} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-text mb-1">
            Ready to explore?
          </h3>
          <p className="text-sm text-text-secondary">
            Select a document from the navigation sidebar to start reading, or use the search bar at the top to quickly find what you need.
          </p>
        </div>
      </div>
    </article>
  );
}