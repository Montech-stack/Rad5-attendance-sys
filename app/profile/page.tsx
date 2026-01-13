"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard/header"
import ProfileCard from "@/components/profile/profile-card"
import AttendanceOverview from "@/components/profile/attendance-overview"
import QuickCheckIn from "@/components/profile/quick-check-in"

interface User {
  email: string
  name: string
  role: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (!storedUser) {
      router.push("/")
      return
    }
    const parsedUser = JSON.parse(storedUser)
    // Restrict profile to staff and students
    if (parsedUser.role === "admin") {
      router.push("/dashboard")
      return
    }
    setUser(parsedUser)
  }, [router])

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader user={user} />
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Profile Card - Full width on mobile, sidebar on desktop */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <ProfileCard user={user} />
          </div>

          {/* Main Content - Full width on mobile */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-1 lg:order-2">
            {/* Quick Check-In */}
            <QuickCheckIn user={user} />

            {/* Attendance Overview */}
            <AttendanceOverview user={user} />
          </div>
        </div>
      </div>
    </main>
  )
}
