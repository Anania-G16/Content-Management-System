"use client";
import { use, useEffect, useState } from "react";
import {
  getPublicDocumentBySlug,
  getClientDocumentBySlug,
  getAdminDocumentBySlug
} from "@/app/services/documentService";
import DocumentRenderer from "@/components/DocumentRenderer";
import { useAuth } from "@/context/AuthContext";
import type { DocumentationNode } from "@/data/documentationTree";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default function DocCatchAllPage({ params }: PageProps) {
  const { slug } = use(params);
  const documentSlug = slug[slug.length - 1];

  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [document, setDocument] = useState<DocumentationNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;

    const fetchDocument = async () => {
      try {
        const data =
          user?.role === "ADMIN"
            ? await getAdminDocumentBySlug(documentSlug)
            : isAuthenticated
              ? await getClientDocumentBySlug(documentSlug)
              : await getPublicDocumentBySlug(documentSlug);
        setDocument(data);
      } catch (error) {
        console.error("Failed to fetch document:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [documentSlug, isAuthenticated, isAuthLoading]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-4 px-2 md:px-6">
        <SkeletonTheme baseColor="#1a1a1a" highlightColor="#2a2a2a">
          <div className="space-y-6">
            {/* Title & Metadata */}
            <div className="space-y-3">
              <Skeleton height={36} width="60%" />
              <div className="flex items-center gap-3">
                <Skeleton height={14} width={100} />
                <Skeleton height={14} width={80} />
              </div>
            </div>

            {/* Paragraph 1 */}
            <div className="space-y-2 pt-2">
              <Skeleton height={16} width="100%" />
              <Skeleton height={16} width="94%" />
              <Skeleton height={16} width="88%" />
            </div>

            {/* Section Heading */}
            <div className="pt-4">
              <Skeleton height={26} width="40%" />
            </div>

            {/* Paragraph 2 */}
            <div className="space-y-2">
              <Skeleton height={16} width="98%" />
              <Skeleton height={16} width="92%" />
            </div>

            {/* Code / Content Block */}
            <div className="pt-2">
              <Skeleton height={160} className="rounded-lg" />
            </div>

            {/* Additional Text Lines */}
            <div className="space-y-2 pt-2">
              <Skeleton height={16} width="95%" />
              <Skeleton height={16} width="70%" />
            </div>
          </div>
        </SkeletonTheme>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="max-w-4xl mx-auto py-4 px-2 md:px-6">
        <p className="text-sm text-text-secondary">
          Document could not be found.
        </p>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto py-4 px-2 md:px-6">
      <DocumentRenderer content={document.content!} />
    </article>
  );
}
