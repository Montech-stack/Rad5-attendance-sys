"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard/header"
import EmployeeList from "@/components/dashboard/employee-list"
import QuickStats from "@/components/dashboard/quick-stats"

interface User {
  email: string
  name: string
  role: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (!storedUser) {
      router.push("/")
      return
    }
    const parsedUser = JSON.parse(storedUser)
    if (parsedUser.role !== "admin") {
      router.push("/profile")
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
      <div className="container mx-auto px-4 py-8">
        <QuickStats />
        <div className="mt-8">
          <EmployeeList userRole={user.role} />
        </div>
      </div>
    </main>
  )
}
