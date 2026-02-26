import { apiRequest } from "@/lib/api";

export function createUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  trackId: string;
}) {
  return apiRequest("/users/user", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteUser(userId: string) {
  return apiRequest(`/users/delete/${userId}`, {
    method: "DELETE",
  });
}
