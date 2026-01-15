import { apiRequest } from "@/lib/api";

export function createTrack(name: string) {
  return apiRequest("/tracks/track", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}
