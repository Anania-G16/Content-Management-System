import api from "@/lib/api";

type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

export async function registerClient(payload: RegisterPayload) {
  const response = await api.post("/api/auth/register", payload);
  return response.data;
}