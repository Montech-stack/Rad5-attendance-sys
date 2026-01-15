import { apiRequest } from "@/lib/api";

export function createAdmin(data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) {
  return apiRequest("/admins/admin", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function adminLogin(email: string, password: string) {
  return apiRequest("/admins/login-admin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
