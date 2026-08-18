import api from "@/lib/api";
import {
  getClients,
  getDocumentPermissions,
  updateUserStatus,
  deleteUser,
  promoteUserToAdmin,
} from "@/app/services/userService";

jest.mock("@/lib/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe("userService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getClients", () => {
    it("fetches clients and maps them correctly", async () => {
      mockedApi.get.mockResolvedValue({
        data: [
          {
            _id: "123",
            fullName: "John Doe",
            email: "john@example.com",
            role: "ADMIN",
            isActive: true,
            isEmailVerified: true,
            createdAt: "2026-08-18",
            updatedAt: "2026-08-18",
          },
          {
            _id: "456",
            fullName: "Jane Doe",
            email: "jane@example.com",
            role: "CLIENT",
            isActive: false,
            isEmailVerified: true,
            createdAt: "2026-08-17",
            updatedAt: "2026-08-17",
          },
        ],
      } as never);

      const result = await getClients();

      expect(mockedApi.get).toHaveBeenCalledWith("/api/users/clients");

      expect(result).toEqual([
        {
          id: "123",
          name: "John Doe",
          email: "john@example.com",
          role: "Admin",
          isDeactivated: false,
          createdAt: "2026-08-18",
        },
        {
          id: "456",
          name: "Jane Doe",
          email: "jane@example.com",
          role: "User",
          isDeactivated: true,
          createdAt: "2026-08-17",
        },
      ]);
    });
  });

  describe("getDocumentPermissions", () => {
    it("fetches permissions for a document", async () => {
      const permissions = {
        accessLevel: "CLIENT",
        canEdit: true,
      };

      mockedApi.get.mockResolvedValue({
        data: permissions,
      } as never);

      const result = await getDocumentPermissions("doc-123");

      expect(mockedApi.get).toHaveBeenCalledWith(
        "/api/documents/doc-123/permissions",
      );

      expect(result).toEqual(permissions);
    });
  });

  describe("updateUserStatus", () => {
    it("updates the user's active status", async () => {
      const responseData = {
        message: "User status updated successfully",
      };

      mockedApi.patch.mockResolvedValue({
        data: responseData,
      } as never);

      const result = await updateUserStatus("user-123", false);

      expect(mockedApi.patch).toHaveBeenCalledWith(
        "/api/users/user-123/status",
        {
          isActive: false,
        },
      );

      expect(result).toEqual(responseData);
    });
  });

  describe("deleteUser", () => {
    it("deletes the specified user", async () => {
      const responseData = {
        message: "User deleted successfully",
      };

      mockedApi.delete.mockResolvedValue({
        data: responseData,
      } as never);

      const result = await deleteUser("user-123");

      expect(mockedApi.delete).toHaveBeenCalledWith(
        "/api/users/user-123",
      );

      expect(result).toEqual(responseData);
    });
  });

  describe("promoteUserToAdmin", () => {
    it("promotes the specified user to admin", async () => {
      const responseData = {
        message: "User promoted to admin successfully",
      };

      mockedApi.patch.mockResolvedValue({
        data: responseData,
      } as never);

      const result = await promoteUserToAdmin("user-123");

      expect(mockedApi.patch).toHaveBeenCalledWith(
        "/api/users/user-123/promote",
      );

      expect(result).toEqual(responseData);
    });
  });
});