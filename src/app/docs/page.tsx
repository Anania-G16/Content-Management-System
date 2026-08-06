import Link from "next/link";
import { BookOpen, Rocket, Terminal, Zap, ArrowRight } from "lucide-react";

const featuredDocs = [
  {
    title: "Introduction",
    description: "Learn about the core concepts, architecture, and design patterns.",
    href: "/docs/introduction",
    icon: BookOpen,
  },
  {
    title: "Getting Started",
    description: "Prerequisites, setup steps, and fundamental usage guide.",
    href: "/docs/getting-started",
    icon: Rocket,
  },
  {
    title: "Installation",
    description: "Add components and theme tokens to your existing Next.js project.",
    href: "/docs/installation",
    icon: Terminal,
  },
  {
    title: "Quickstart",
    description: "Build your first production-ready layout in under 5 minutes.",
    href: "/docs/quickstart",
    icon: Zap,
  },
];

export default function DocsLandingPage() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Hero Section */}
      <section className="py-12 md:py-16 text-center sm:text-left border-b border-border">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-xs font-mono text-accent mb-6">
          <span>v1.0.0 Documentation</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold text-text tracking-tight mb-6">
          Welcome to the Documentation
        </h1>
        
        <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl mb-8">
          Explore our guides, component APIs, and architecture references. Select a topic 
          from the navigation sidebar or jump straight into the setup guide below.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/docs/getting-started"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary hover:bg-primary-active text-text font-medium transition-colors shadow-sm"
          >
            <span>Get Started</span>
            <ArrowRight size={18} />
          </Link>
          
          <Link
            href="/docs/installation"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-surface border border-border hover:border-text-secondary text-text font-medium transition-colors"
          >
            <span>Installation Guide</span>
          </Link>
        </div>
      </section>

      {/* Featured Topics Section */}
      <section className="pt-12 sm:pt-16">
        <h2 className="text-xl font-bold text-text tracking-tight mb-2">
          Browse Documentation
        </h2>
        <p className="text-sm text-text-secondary mb-8">
          Key entry points to help you integrate and start building faster.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredDocs.map((doc) => {
            const Icon = doc.icon;
            return (
              <Link
                key={doc.href}
                href={doc.href}
                className="group p-6 rounded-xl bg-surface border border-border hover:border-text-secondary/50 transition-all duration-150 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center text-primary group-hover:text-accent transition-colors mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-text group-hover:text-primary-text transition-colors mb-2">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {doc.description}
                  </p>
                </div>
                
                <div className="mt-6 flex items-center gap-1 text-xs font-mono text-text-secondary group-hover:text-text transition-colors">
                  <span>Read section</span>
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}