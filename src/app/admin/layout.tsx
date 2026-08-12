import AdminSidebar from "@/components/AdminSidebar";

export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 lg:pl-64 p-8">{children}</main>
    </div>
  );
}
