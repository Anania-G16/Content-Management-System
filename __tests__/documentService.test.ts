import api from "@/lib/api";
import {
  getAdminDocumentTree,
  getPublicDocumentTree,
  getClientDocumentTree,
  getPublicDocumentBySlug,
  getClientDocumentBySlug,
  getAdminDocumentBySlug,
  updateDocument,
  deleteDocument,
} from "@/app/services/documentService";

jest.mock("@/lib/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApi = api as jest.Mocked<typeof api>;

const mockDocument = {
  _id: "doc-1",
  title: "Getting Started",
  slug: "getting-started",
  parentId: null,
  icon: "book",
  content: { type: "doc" },
  status: "PUBLISHED" as const,
  updatedAt: "2026-08-18T00:00:00Z",
  accessLevel: "PUBLIC" as const,
};

describe("documentService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAdminDocumentTree", () => {
    it("fetches and maps the admin document tree", async () => {
      mockedApi.get.mockResolvedValueOnce({
        data: [mockDocument],
      } as any);

      const result = await getAdminDocumentTree();

      expect(mockedApi.get).toHaveBeenCalledWith(
        "/api/documents/admin/tree",
      );

      expect(result).toEqual([
        {
          id: "doc-1",
          title: "Getting Started",
          slug: "getting-started",
          parentId: null,
          icon: "book",
          content: { type: "doc" },
          status: "PUBLISHED",
          updatedAt: "2026-08-18T00:00:00Z",
          accessLevel: "PUBLIC",
          children: undefined,
        },
      ]);
    });
  });

  describe("getPublicDocumentTree", () => {
    it("fetches and maps the public document tree", async () => {
      mockedApi.get.mockResolvedValueOnce({
        data: [mockDocument],
      } as any);

      const result = await getPublicDocumentTree();

      expect(mockedApi.get).toHaveBeenCalledWith("/api/documents/tree");
      expect(result[0].id).toBe("doc-1");
      expect(result[0].title).toBe("Getting Started");
    });
  });

  describe("getClientDocumentTree", () => {
    it("fetches and maps the client document tree", async () => {
      mockedApi.get.mockResolvedValueOnce({
        data: [mockDocument],
      } as any);

      const result = await getClientDocumentTree();

      expect(mockedApi.get).toHaveBeenCalledWith(
        "/api/documents/client/tree",
      );
      expect(result[0].slug).toBe("getting-started");
    });
  });

  describe("getPublicDocumentBySlug", () => {
    it("fetches and maps a public document by slug", async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockDocument),
      }) as jest.Mock;

      const result = await getPublicDocumentBySlug("getting-started");

      expect(fetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/api/documents/slug/getting-started`,
      );

      expect(result.id).toBe("doc-1");
      expect(result.title).toBe("Getting Started");
    });

    it("throws when the public document request fails", async () => {
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
      }) as jest.Mock;

      await expect(
        getPublicDocumentBySlug("missing-document"),
      ).rejects.toThrow("Failed to fetch document");
    });
  });

  describe("getClientDocumentBySlug", () => {
    it("fetches and maps a client document by slug", async () => {
      mockedApi.get.mockResolvedValueOnce({
        data: mockDocument,
      } as any);

      const result = await getClientDocumentBySlug("getting-started");

      expect(mockedApi.get).toHaveBeenCalledWith(
        "/api/documents/client/slug/getting-started",
      );

      expect(result.id).toBe("doc-1");
    });
  });

  describe("getAdminDocumentBySlug", () => {
    it("fetches and maps an admin document by slug", async () => {
      mockedApi.get.mockResolvedValueOnce({
        data: mockDocument,
      } as any);

      const result = await getAdminDocumentBySlug("getting-started");

      expect(mockedApi.get).toHaveBeenCalledWith(
        "/api/documents/admin/slug/getting-started",
      );

      expect(result.id).toBe("doc-1");
    });
  });

  describe("updateDocument", () => {
    it("updates a document with the provided payload", async () => {
      const payload = {
        title: "Updated Title",
        content: { type: "doc" },
      };

      mockedApi.patch.mockResolvedValueOnce({
        data: { success: true },
      } as any);

      const result = await updateDocument("doc-1", payload);

      expect(mockedApi.patch).toHaveBeenCalledWith(
        "/api/documents/doc-1",
        payload,
      );

      expect(result).toEqual({ success: true });
    });
  });

  describe("deleteDocument", () => {
    it("deletes the specified document", async () => {
      mockedApi.delete.mockResolvedValueOnce({
        data: { success: true },
      } as any);

      const result = await deleteDocument("doc-1");

      expect(mockedApi.delete).toHaveBeenCalledWith(
        "/api/documents/doc-1",
      );

      expect(result).toEqual({ success: true });
    });
  });
});