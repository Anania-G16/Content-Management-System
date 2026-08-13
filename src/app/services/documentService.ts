import api from "@/lib/api";
import { DocumentationNode } from "@/data/documentationTree";

type ApiDocumentNode = {
  _id: string;
  title: string;
  slug: string;
  parentId: string | null;
  icon?: string | null;
  content?: object;
  children?: ApiDocumentNode[];
};

const mapDocumentNode = (node: ApiDocumentNode): DocumentationNode => {
  return {
    id: node._id,
    title: node.title,
    slug: node.slug,
    parentId: node.parentId,
    icon: node.icon,
    content: node.content,
    children: node.children?.map(mapDocumentNode),
  };
};

export async function getAdminDocumentTree(): Promise<DocumentationNode[]> {
  const response = await api.get("/api/documents/admin/tree");

  return response.data.map(mapDocumentNode);
}