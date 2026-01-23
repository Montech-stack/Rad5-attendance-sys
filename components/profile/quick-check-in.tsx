"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import LocationCheckerModal from "@/components/check-in/location-checker-modal"

const CHECK_OUT_URL =
  "https://attendance.bookbank.com.ng/api/v1/attendance/check-out"

const GET_ATTENDANCE_BY_USER =
  "https://attendance.bookbank.com.ng/api/v1/attendance/attendance/users"

interface Attendance {
  id?: string
  userId?: string
  date?: string
  status: string
  checkInTime: string
  latitude: number | string
  longitude: number | string
  checkOutTime?: string | null
}

export default function QuickCheckIn() {
  const [open, setOpen] = useState(false)
  const [attendance, setAttendance] = useState<Attendance | null>(null)
  const [checkingOut, setCheckingOut] = useState(false)
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem("token") || ""
  const storedUser = localStorage.getItem("currentUser")
  const userId = storedUser ? JSON.parse(storedUser).id : null

  // ----------------------------------------
  // FETCH TODAY'S ATTENDANCE ON LOAD
  // ----------------------------------------
  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    async function fetchMyAttendance() {
      try {
        const res = await fetch(`${GET_ATTENDANCE_BY_USER}/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const result = await res.json()

        if (result.success) {
          const today = new Date().toISOString().split("T")[0]

          const todayRecord = result.data.find(
            (a: any) => a.date === today
          )

          setAttendance(todayRecord || null)
        }
      } catch (err) {
        console.error("Failed to fetch attendance:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMyAttendance()
  }, [userId, token])

  // ----------------------------------------
  // CHECK OUT HANDLER
  // ----------------------------------------
  const handleCheckOut = async () => {
    if (!attendance) return
    setCheckingOut(true)

    try {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      const checkOutTime = `${hours}:${minutes}`

      const response = await fetch(CHECK_OUT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ checkOutTime }),
      })

      const data = await response.json()
      console.log("📌 Checkout response:", data)

      if (data.success) {
        // Re-fetch attendance so we stay in sync with backend
        const res = await fetch(`${GET_ATTENDANCE_BY_USER}/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        const result = await res.json()

        if (result.success) {
          const today = new Date().toISOString().split("T")[0]
          const todayRecord = result.data.find(
            (a: any) => a.date === today
          )

          setAttendance(todayRecord || null)
        }

        alert("Checked out successfully!")
      } else {
        alert(data.message || "Checkout failed")
      }
    } catch (err) {
      console.error(err)
      alert("Failed to checkout. Try again.")
    } finally {
      setCheckingOut(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quick Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading attendance...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quick Attendance</CardTitle>
        </CardHeader>

        <CardContent>
          {!attendance ? (
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              onClick={() => setOpen(true)}
            >
              Check In
            </Button>
          ) : (
            <div className="text-sm space-y-2">
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    attendance.status === "LATE"
                      ? "text-red-500"
                      : "text-green-600"
                  }
                >
                  {attendance.status}
                </span>
              </p>

              <p>
                <strong>Check-In:</strong>{" "}
                {new Date(attendance.checkInTime).toLocaleTimeString()}
              </p>

              {attendance.latitude && attendance.longitude && (
                <p>
                  <strong>Location:</strong>{" "}
                  {Number(attendance.latitude).toFixed(4)},{" "}
                  {Number(attendance.longitude).toFixed(4)}
                </p>
              )}

              {attendance.checkOutTime ? (
                <p className="text-green-600 font-medium">
                  ✅ Checked Out:{" "}
                  {new Date(attendance.checkOutTime).toLocaleTimeString()}
                </p>
              ) : (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white mt-2 cursor-pointer"
                  onClick={handleCheckOut}
                  disabled={checkingOut}
                >
                  {checkingOut ? "Checking Out..." : "Check Out"}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <LocationCheckerModal
        isOpen={open}
        token={token}
        onCheckInSuccess={(data) => {
          console.log("📌 Final attendance data:", data)
          setAttendance(data)
          setOpen(false)
        }}
        onCheckInFailed={() => {
          console.log("❌ Check-in failed")
          setOpen(false)
        }}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
