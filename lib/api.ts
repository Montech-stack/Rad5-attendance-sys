// lib/api.ts
const BASE_URL = "https://attendance.bookbank.com.ng/api/v1";

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("API Error:", errorData);
    throw new Error(errorData.message || errorData.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}
