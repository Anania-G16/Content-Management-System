import { Clock, Copy } from "lucide-react";

export default function DocPage() {
  return (
    <article className="max-w-4xl mx-auto py-4 px-2 md:px-6">
      {/* Meta header */}
      <div className="flex items-center gap-2 text-xs text-text-secondary mb-3 font-mono">
        <Clock size={14} />
        <span>Last updated: August 2026</span>
      </div>

      {/* Main Title & Description */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-text tracking-tight mb-4">
        Getting Started
      </h1>
      <p className="text-lg text-text-secondary leading-relaxed mb-8">
        Learn how to set up, configure, and build modern design systems using 
        our Next.js layout engine and Tailwind v4 design tokens.
      </p>

      {/* Divider */}
      <hr className="border-border my-8" />

      {/* Document Body */}
      <div className="space-y-8 text-text leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-text tracking-tight">
            Prerequisites
          </h2>
          <p className="text-text-secondary">
            Before integrating the sidebar or theme tokens into your codebase, ensure 
            your environment meets the minimum version requirement for Next.js App Router:
          </p>
          <ul className="list-disc list-inside space-y-2 text-text-secondary pl-2">
            <li>
              Node.js <code className="px-1.5 py-0.5 rounded bg-surface border border-border text-accent text-sm font-mono">v18.17.0</code> or higher
            </li>
            <li>React 19 or above</li>
            <li>Tailwind CSS v4 initialized in your global stylesheet</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-text tracking-tight">
            Quick Installation
          </h2>
          <p className="text-text-secondary">
            Install the base library and icon utilities using your package manager of choice:
          </p>

          {/* Code Block Component */}
          <div className="rounded-lg bg-surface border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/50 text-xs text-text-secondary font-mono">
              <span>terminal</span>
              <button 
                className="flex items-center gap-1 hover:text-text transition-colors"
                aria-label="Copy code"
              >
                <Copy size={12} />
                <span>Copy</span>
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm font-mono text-text">
              <code>npm install lucide-react clsx tailwind-merge</code>
            </pre>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-text tracking-tight">
            Step-by-Step Configuration
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-text-secondary pl-2">
            <li className="pl-1">
              Import the <code className="px-1.5 py-0.5 rounded bg-surface border border-border text-accent text-sm font-mono">Sidebar</code> component into your root layout wrapper.
            </li>
            <li className="pl-1">
              Map your documentation navigation items inside the layout definition array.
            </li>
            <li className="pl-1">
              Verify that the theme values match your custom color definitions in <code className="px-1.5 py-0.5 rounded bg-surface border border-border text-accent text-sm font-mono">global.css</code>.
            </li>
          </ol>
        </section>
      </div>
    </article>
  );
}