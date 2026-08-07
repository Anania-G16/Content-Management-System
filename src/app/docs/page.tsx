import { Clock } from "lucide-react";

interface PageProps {
  params: Promise<{
    slug?: string | string[];
  }>;
}

export default async function DocCatchAllPage({ params }: PageProps) {
  const resolvedParams = await params;
  
  // Normalize slug to an array regardless of single or catch-all routing
  const slugArray = Array.isArray(resolvedParams.slug)
    ? resolvedParams.slug
    : resolvedParams.slug
    ? [resolvedParams.slug]
    : [];

  const fullPath = slugArray.length > 0 ? `/docs/${slugArray.join("/")}` : "/docs";
  const pageTitle = slugArray.length > 0 ? slugArray[slugArray.length - 1] : "Documentation";

  return (
    <article className="max-w-4xl mx-auto py-4 px-2 md:px-6">
      {/* Meta Header */}
      <div className="flex items-center gap-2 text-xs text-text-secondary mb-3 font-mono">
        <Clock size={14} />
        <span>Last updated: August 2026</span>
      </div>

      {/* Main Title & Path */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-text tracking-tight mb-2 capitalize">
        {pageTitle.replace(/-/g, " ")}
      </h1>
      <p className="text-sm font-mono text-text-secondary mb-6">
        Path: {fullPath}
      </p>

      <hr className="border-border my-6" />

      {/* Page Body */}
      <div className="space-y-6 text-text leading-relaxed">
        <p className="text-text-secondary text-lg">
          Viewing documentation page at depth{" "}
          <code className="px-1.5 py-0.5 rounded bg-surface border border-border text-accent text-sm font-mono">
            {slugArray.length || 1}
          </code>.
        </p>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-text tracking-tight">
            Breadcrumb Segments
          </h2>
          <ul className="list-disc list-inside space-y-1 text-text-secondary font-mono text-sm pl-2">
            {slugArray.map((_, index) => (
              <li key={index}>
                /docs/{slugArray.slice(0, index + 1).join("/")}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}