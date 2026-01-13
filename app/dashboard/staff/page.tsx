"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard/header"
import StaffManagement from "@/components/staff/staff-management"

interface User {
  email: string
  name: string
  role: string
}

export default function StaffPage() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (!storedUser) {
      router.push("/")
      return
    }
    const parsedUser = JSON.parse(storedUser)
    // Restrict staff management to admin only
    if (parsedUser.role !== "admin") {
      router.push("/dashboard")
      return
    }
    setUser(parsedUser)
  }, [router])

  if (!user || user.role !== "admin") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader user={user} />
      <div className="container mx-auto px-4 py-8">
        <StaffManagement />
      </div>
    </main>
  )
}
