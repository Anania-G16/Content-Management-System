import Link from "next/link";
import { Plus, FileText, CheckCircle2, FileEdit, Edit, Eye } from "lucide-react";

const stats = [
  {
    title: "Total Documents",
    value: "24",
    icon: FileText,
    color: "text-primary",
  },
  {
    title: "Published",
    value: "18",
    icon: CheckCircle2,
    color: "text-success",
  },
  {
    title: "Drafts",
    value: "6",
    icon: FileEdit,
    color: "text-accent",
  },
];

const documents = [
  {
    id: "1",
    title: "Getting Started",
    slug: "getting-started",
    status: "Published",
    updatedAt: "Today",
  },
  {
    id: "2",
    title: "Installation Guide",
    slug: "installation",
    status: "Published",
    updatedAt: "Yesterday",
  },
  {
    id: "3",
    title: "Company Policies",
    slug: "company-policies",
    status: "Draft",
    updatedAt: "3 days ago",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text">
            Admin Dashboard
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage and publish company documentation.
          </p>
        </div>

        <Link
          href="/admin/dashboard/documents/create"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-primary text-text text-sm font-medium hover:bg-primary-active transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>New Document</span>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="p-5 rounded-md bg-surface border border-border flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1">
                  {stat.title}
                </span>
                <span className="text-3xl font-bold text-text">
                  {stat.value}
                </span>
              </div>
              <div className={`p-3 rounded-md bg-background border border-border ${stat.color}`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Document Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text flex items-center gap-2">
            <FileText size={18} className="text-primary" />
            <span>All Documents ({documents.length})</span>
          </h2>
        </div>

        <div className="rounded-md bg-surface border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-text-secondary">
              <thead className="bg-background border-b border-border text-xs uppercase text-text-secondary">
                <tr>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Last Updated</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-background/50 transition-colors">
                    {/* Title & URL */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-text">{doc.title}</div>
                      <div className="text-xs text-text-secondary font-mono">
                        /docs/{doc.slug}
                      </div>
                    </td>

                    {/* Published / Draft Tag */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          doc.status === "Published"
                            ? "bg-success/10 text-success"
                            : "bg-text-secondary/10 text-text-secondary"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-xs">{doc.updatedAt}</td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/docs/${doc.slug}`}
                          target="_blank"
                          className="text-text-secondary hover:text-text transition-colors flex items-center gap-1 text-xs"
                          title="View on site"
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </Link>
                        <Link
                          href={`/admin/dashboard/documents/${doc.id}`}
                          className="text-primary hover:text-primary-text transition-colors flex items-center gap-1 text-xs font-medium"
                          title="Edit document"
                        >
                          <Edit size={14} />
                          <span>Edit</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}