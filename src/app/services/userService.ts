import api from "@/lib/api";
import { User } from "@/data/userData";

type ApiClient = {
  _id: string;
  fullName: string;
  email: string;
  role: "CLIENT" | "ADMIN";
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

const mapClient = (user: ApiClient): User => {
  return {
    id: user._id,
    name: user.fullName,
    email: user.email,
    role: user.role === "ADMIN" ? "Admin" : "User",
    isDeactivated: !user.isActive,
    createdAt: user.createdAt,
  };
};

export async function getClients(): Promise<User[]> {
  const response = await api.get("/api/users/clients");

  return response.data.map(mapClient);
}

export async function getDocumentPermissions(documentId: string) {
  const response = await api.get(`/api/documents/${documentId}/permissions`);
  return response.data;
}

export async function updateUserStatus(id: string, isActive: boolean) {
  const response = await api.patch(`/api/users/${id}/status`, {
    isActive,
  });

  return response.data;
}

export async function deleteUser(id: string) {
  const response = await api.delete(`/api/users/${id}`);

  return response.data;
}