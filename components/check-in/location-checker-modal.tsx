"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle2, MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// Building location (example: RAD5 headquarters)
const BUILDING_LOCATION = {
  latitude: 40.7128,
  longitude: -74.006,
  radius: 150, // meters
}

interface LocationCheckerModalProps {
  isOpen: boolean
  onCheckInSuccess: (location: { lat: number; lng: number; timestamp: string }) => void
  onCheckInFailed: () => void
  onClose: () => void
}

type CheckingStatus = "checking" | "success" | "failed" | "idle"

export default function LocationCheckerModal({
  isOpen,
  onCheckInSuccess,
  onCheckInFailed,
  onClose,
}: LocationCheckerModalProps) {
  const [status, setStatus] = useState<CheckingStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000 // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  const checkLocation = async () => {
    setStatus("checking")
    setErrorMessage("")

    // Simulate checking delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 2000))

    try {
      // Get user's current location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude
          const userLng = position.coords.longitude
          const accuracy = position.coords.accuracy

          // Calculate distance from user to building
          const distance = calculateDistance(userLat, userLng, BUILDING_LOCATION.latitude, BUILDING_LOCATION.longitude)

          // Check if user is within the building radius + geolocation accuracy
          if (distance <= BUILDING_LOCATION.radius + accuracy) {
            setStatus("success")
            setTimeout(() => {
              onCheckInSuccess({
                lat: userLat,
                lng: userLng,
                timestamp: new Date().toISOString(),
              })
              setStatus("idle")
            }, 1500)
          } else {
            setStatus("failed")
            setErrorMessage(
              `You are ${Math.round(distance - BUILDING_LOCATION.radius)} meters away from the building. Please move closer to check in.`,
            )
          }
        },
        (error) => {
          setStatus("failed")
          if (error.code === error.PERMISSION_DENIED) {
            setErrorMessage("Location permission denied. Please enable location access in your browser settings.")
          } else {
            setErrorMessage("Unable to get your location. Please ensure location services are enabled.")
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    } catch (err) {
      setStatus("failed")
      setErrorMessage("An error occurred while checking your location.")
    }
  }

  useEffect(() => {
    if (isOpen && status === "idle") {
      checkLocation()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg shadow-lg max-w-sm w-full p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {status === "checking" && (
              <div className="bg-primary/10 p-4 rounded-full">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            )}
            {status === "success" && (
              <div className="bg-accent/10 p-4 rounded-full">
                <CheckCircle2 className="w-8 h-8 text-accent" />
              </div>
            )}
            {status === "failed" && (
              <div className="bg-destructive/10 p-4 rounded-full">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
            )}
          </div>

          <h3 className="text-lg font-semibold text-foreground">
            {status === "checking" && "Checking Location..."}
            {status === "success" && "Check-In Successful!"}
            {status === "failed" && "Check-In Failed"}
          </h3>

          {status === "checking" && <p className="text-sm text-muted-foreground mt-2">Verifying your location...</p>}
          {status === "success" && (
            <p className="text-sm text-accent mt-2 flex items-center justify-center gap-1">
              <MapPin className="w-4 h-4" />
              You are in the correct location
            </p>
          )}
          {status === "failed" && (
            <p className="text-sm text-destructive mt-2 flex items-center justify-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errorMessage}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {(status === "failed" || status === "idle") && (
            <>
              <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={checkLocation}
                disabled={status === "checking"}
              >
                Try Again
              </Button>
            </>
          )}
          {status === "success" && (
            <Button className="w-full bg-primary hover:bg-primary/90" onClick={onClose}>
              Close
            </Button>
          )}
          {status === "checking" && (
            <Button className="w-full" disabled>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Checking...
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
