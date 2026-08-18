import React, { act } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import DocCatchAllPage from "@/app/docs/[...slug]/page";
import { useAuth } from "@/context/AuthContext";
import {
  getPublicDocumentBySlug,
  getClientDocumentBySlug,
  getAdminDocumentBySlug,
} from "@/app/services/documentService";
import "@testing-library/jest-dom";

// Mock Auth Context
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Mock Document Services
jest.mock("@/app/services/documentService", () => ({
  getPublicDocumentBySlug: jest.fn(),
  getClientDocumentBySlug: jest.fn(),
  getAdminDocumentBySlug: jest.fn(),
}));

// Mock DocumentRenderer component
jest.mock("@/components/DocumentRenderer", () => {
  return {
    __esModule: true,
    default: function DummyRenderer({ content }: { content: string }) {
      return <div data-testid="document-renderer">{content}</div>;
    },
  };
});

// Fix: Provide both default (Skeleton) and named (SkeletonTheme) exports
jest.mock("react-loading-skeleton", () => {
  return {
    __esModule: true,
    default: function DummySkeleton() {
      return <div data-testid="skeleton-loader" />;
    },
    SkeletonTheme: function DummySkeletonTheme({ children }: { children: React.ReactNode }) {
      return <div data-testid="skeleton-theme">{children}</div>;
    },
  };
});

// Mock CSS imports so Jest doesn't choke on them
jest.mock("react-loading-skeleton/dist/skeleton.css", () => {});

const mockDoc = {
  id: "doc-1",
  title: "Getting Started",
  content: "# Hello World Documentation",
};

describe("DocCatchAllPage Component", () => {
  const createParams = (slugArray: string[]) =>
    Promise.resolve({ slug: slugArray });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetches public document when user is unauthenticated", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    (getPublicDocumentBySlug as jest.Mock).mockResolvedValue(mockDoc);

    const params = createParams(["guides", "getting-started"]);

    await act(async () => {
      render(<DocCatchAllPage params={params} />);
    });

    await waitFor(() => {
      expect(getPublicDocumentBySlug).toHaveBeenCalledWith("getting-started");
      expect(
        screen.getByText("# Hello World Documentation")
      ).toBeInTheDocument();
    });
  });

  test("fetches client document when user is authenticated as standard user", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: "u1", role: "CLIENT" },
      isAuthenticated: true,
      isLoading: false,
    });
    (getClientDocumentBySlug as jest.Mock).mockResolvedValue(mockDoc);

    const params = createParams(["guides", "getting-started"]);

    await act(async () => {
      render(<DocCatchAllPage params={params} />);
    });

    await waitFor(() => {
      expect(getClientDocumentBySlug).toHaveBeenCalledWith("getting-started");
      expect(
        screen.getByText("# Hello World Documentation")
      ).toBeInTheDocument();
    });
  });

  test("fetches admin document when user has ADMIN role", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: "a1", role: "ADMIN" },
      isAuthenticated: true,
      isLoading: false,
    });
    (getAdminDocumentBySlug as jest.Mock).mockResolvedValue(mockDoc);

    const params = createParams(["admin", "settings"]);

    await act(async () => {
      render(<DocCatchAllPage params={params} />);
    });

    await waitFor(() => {
      expect(getAdminDocumentBySlug).toHaveBeenCalledWith("settings");
      expect(
        screen.getByText("# Hello World Documentation")
      ).toBeInTheDocument();
    });
  });

  test("renders 'not found' message if document fetch yields null", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    (getPublicDocumentBySlug as jest.Mock).mockResolvedValue(null);

    const params = createParams(["unknown-slug"]);

    await act(async () => {
      render(<DocCatchAllPage params={params} />);
    });

    await waitFor(() => {
      expect(
        screen.getByText("Document could not be found.")
      ).toBeInTheDocument();
    });
  });
});