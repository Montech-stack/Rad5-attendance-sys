"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard/header"
import AttendanceHistory from "@/components/history/attendance-history"

interface User {
  email: string
  name: string
  role: string
}

export default function HistoryPage() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (!storedUser) {
      router.push("/")
      return
    }
    setUser(JSON.parse(storedUser))
  }, [router])

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader user={user} />
      <div className="container mx-auto px-4 py-8">
        <AttendanceHistory userRole={user.role} />
      </div>
    </main>
  )
}
