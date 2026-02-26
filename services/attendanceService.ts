import { apiRequest } from "@/lib/api"

export async function checkInAttendance({
  latitude,
  longitude,
  token,
}: {
  latitude: number
  longitude: number
  token: string
}) {
  const payload = {
    // ⚠️ Temporary: backend currently expects this
    loginTime: new Date().toISOString(),
    latitude,
    longitude,
  }

  console.log("📤 Sending check-in payload:", payload)

  return apiRequest("/attendance/check-in", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
}

export function manualCheckIn(data: {
  email: string
  date: string
  time: string
}) {
  return apiRequest("/attendance/manual-checkin", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function manualCheckOut(data: {
  email: string
  date: string
  time: string
}) {
  return apiRequest("/attendance/manual-checkout", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function getAttendanceHistory(userId: string) {
  return apiRequest(`/attendance/attendance/users/${userId}`)
}

