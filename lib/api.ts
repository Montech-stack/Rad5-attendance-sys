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
    console.log(JSON.stringify(res,null,2));
    throw new Error("API request failed");
  }

  return res.json();
}
