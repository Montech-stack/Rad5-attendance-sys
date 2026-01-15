"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import LocationCheckerModal from "@/components/check-in/location-checker-modal"

const CHECK_OUT_URL = "https://attendance.bookbank.com.ng/api/v1/attendance/check-out" // replace with actual URL

interface Attendance {
  status: string
  checkInTime: string
  latitude: number | string
  longitude: number | string
  checkOutTime?: string
}

export default function QuickCheckIn() {
  const [open, setOpen] = useState(false)
  const [attendance, setAttendance] = useState<Attendance | null>(null)
  const [checkingOut, setCheckingOut] = useState(false)

  const token = localStorage.getItem("token") || ""

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
        // Update attendance with checkout info
        setAttendance(prev => prev ? { ...prev, checkOutTime: checkOutTime } : null)
        alert("Checked out successfully!")
        // Reset after checkout
        setAttendance(null)
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quick Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          {!attendance ? (
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setOpen(true)}
            >
              Check In
            </Button>
          ) : (
            <div className="text-sm space-y-2">
              <p>Status: {attendance.status}</p>
              <p>Check-In Time: {new Date(attendance.checkInTime).toLocaleTimeString()}</p>
              <p>
                Location: {Number(attendance.latitude).toFixed(4)}, {Number(attendance.longitude).toFixed(4)}
              </p>

              {!attendance.checkOutTime && (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white mt-2"
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