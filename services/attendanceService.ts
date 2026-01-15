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

  const res = await fetch(
    "https  ://attendance.bookbank.com.ng/attendance/check-in",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  )

  const data = await res.json()

  console.log("📥 Backend response:", data)

  if (!res.ok) {
    throw new Error(data.message || "Check-in failed")
  }

  return data
}
