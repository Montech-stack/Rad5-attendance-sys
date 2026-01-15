import { apiRequest } from "@/lib/api";

export async function adminLogin(email: string, password: string) {
  return apiRequest("/admins/login-admin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
export async function userLogin(email: string, password: string) {
  return apiRequest("/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
