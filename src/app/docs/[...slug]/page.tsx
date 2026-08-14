import { Clock } from "lucide-react";
import { getPublicDocumentBySlug } from "@/app/services/documentService";
import DocumentRenderer from "@/components/DocumentRenderer";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function DocCatchAllPage({ params }: PageProps) {
  const { slug } = await params;

  const documentSlug = slug[slug.length - 1];

  const document = await getPublicDocumentBySlug(documentSlug);

  return (
    <article className="max-w-4xl mx-auto py-4 px-2 md:px-6">
      <DocumentRenderer content={document.content!} />
    </article>
  );
}
