"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard/header"
import CheckInMap from "@/components/check-in/check-in-map"
import CheckInStatus from "@/components/check-in/check-in-status"

interface User {
  email: string
  name: string
  role: string
}

export default function CheckInPage() {
  const [user, setUser] = useState<User | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (!storedUser) {
      router.push("/")
      return
    }
    setUser(JSON.parse(storedUser))

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          // Use San Francisco as fallback
          setUserLocation({ lat: 37.7749, lng: -122.4194 })
        },
      )
    }
  }, [router])

  if (!user || !userLocation) {
    return <div className="flex items-center justify-center min-h-screen">Loading location...</div>
  }

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader user={user} />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckInMap userLocation={userLocation} />
          </div>
          <div>
            <CheckInStatus userLocation={userLocation} userName={user.name} />
          </div>
        </div>
      </div>
    </main>
  )
}
