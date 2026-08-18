import api from "@/lib/api";

type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
export async function registerClient(payload: RegisterPayload) {
  const response = await api.post("/api/auth/register", payload);
  return response.data;
}
export async function changePassword(payload: ChangePasswordPayload) {
  const response = await api.post("/api/auth/change-password", payload);
  return response.data;
}

type ForgotPasswordPayload = {
  email: string;
};

export async function forgotPassword(payload: ForgotPasswordPayload) {
  const response = await api.post("/api/auth/forgot-password", payload);
  return response.data;
}

type ResetPasswordPayload = {
  token: string;
  newPassword: string;
};

export async function resetPassword(payload: ResetPasswordPayload) {
  const response = await api.post("/api/auth/reset-password", payload);
  return response.data;
}
