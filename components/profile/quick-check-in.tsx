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
      <Card className="border-0 shadow-lg bg-card/80 backdrop-blur overflow-hidden">
        <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Today's Actions
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          {!attendance ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 blur-2xl opacity-30 animate-pulse rounded-full group-hover:opacity-50 transition-opacity duration-500 pointer-events-none" />
                <Button
                  className="relative z-10 w-48 h-48 rounded-full border-[6px] border-white dark:border-blue-950 bg-gradient-to-tr from-blue-700 via-indigo-600 to-purple-700 hover:from-blue-600 hover:via-indigo-500 hover:to-purple-600 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex flex-col gap-3 items-center justify-center cursor-pointer"
                  onClick={() => {
                    console.log("Check In Button Clicked");
                    setOpen(true);
                  }}
                >
                  <span className="text-5xl filter drop-shadow-md">👋</span>
                  <span className="font-extrabold text-xl tracking-widest uppercase text-shadow-sm">Check In</span>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground font-medium text-center max-w-[200px]">
                Start your day by tapping the button above.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-secondary/30 rounded-2xl p-4 flex items-center justify-between border border-border/50">
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Status</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`h-2.5 w-2.5 rounded-full ${attendance.status === "LATE" ? "bg-amber-500" : "bg-purple-500"} animate-pulse`} />
                    <span className={`text-xl font-bold ${attendance.status === "LATE" ? "text-amber-600" : "text-purple-600"}`}>
                      {attendance.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Check-In Time</span>
                  <p className="text-xl font-mono font-medium text-foreground">
                    {new Date(attendance.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {attendance.checkOutTime ? (
                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 text-center space-y-1">
                  <p className="text-purple-700 dark:text-purple-400 font-bold text-lg flex items-center justify-center gap-2">
                    ✅ Checked Out
                  </p>
                  <p className="text-sm text-purple-600/80 font-mono">
                    {new Date(attendance.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ) : (
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transition-all h-12 text-lg font-semibold tracking-wide"
                  onClick={handleCheckOut}
                  disabled={checkingOut}
                >
                  {checkingOut ? (
                    <span className="flex items-center gap-2">Checking Out...</span>
                  ) : (
                    <span className="flex items-center gap-2">Running off? Check Out 🏃</span>
                  )}
                </Button>
              )}

              {attendance.latitude && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground opacity-70">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Location Verified: {Number(attendance.latitude).toFixed(4)}, {Number(attendance.longitude).toFixed(4)}</span>
                </div>
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
