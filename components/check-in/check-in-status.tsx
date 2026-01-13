"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, CheckCircle2, AlertCircle } from "lucide-react"

interface CheckInStatusProps {
  userLocation: { lat: number; lng: number }
  userName: string
}

// Define zones
const ZONES = [
  { id: 1, name: "Building A", lat: 37.7849, lng: -122.4094, radius: 100 },
  { id: 2, name: "Building B", lat: 37.7849, lng: -122.3994, radius: 100 },
  { id: 3, name: "Office Main", lat: 37.7649, lng: -122.4194, radius: 150 },
]

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function CheckInStatus({ userLocation, userName }: CheckInStatusProps) {
  const [checkedIn, setCheckedIn] = useState(false)
  const [selectedZone, setSelectedZone] = useState<(typeof ZONES)[0] | null>(null)
  const [checkInTime, setCheckInTime] = useState<Date | null>(null)

  // Check which zones user is in range
  const nearbyZones = ZONES.filter((zone) => {
    const distance = calculateDistance(userLocation.lat, userLocation.lng, zone.lat, zone.lng)
    return distance <= zone.radius
  })

  const handleCheckIn = (zone: (typeof ZONES)[0]) => {
    setSelectedZone(zone)
    setCheckedIn(true)
    setCheckInTime(new Date())
  }

  const handleCheckOut = () => {
    setCheckedIn(false)
    setSelectedZone(null)
    setCheckInTime(null)
  }

  return (
    <Card className="border-0 shadow-sm sticky top-24">
      <CardHeader>
        <CardTitle className="text-lg">Check-In Status</CardTitle>
        <CardDescription>Location-based attendance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            {checkedIn ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span className="font-medium text-foreground">Checked In</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Not Checked In</span>
              </>
            )}
          </div>
          {checkedIn && selectedZone && checkInTime && (
            <>
              <p className="text-sm text-muted-foreground mb-1">{selectedZone.name}</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{checkInTime.toLocaleTimeString()}</span>
              </div>
            </>
          )}
        </div>

        {/* Available Zones */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Available Zones</h3>
          {nearbyZones.length > 0 ? (
            <div className="space-y-2">
              {nearbyZones.map((zone) => (
                <div
                  key={zone.id}
                  className="p-3 border border-border rounded-lg bg-card hover:bg-muted transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-accent" />
                      <span className="font-medium text-foreground">{zone.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      In Range
                    </Badge>
                  </div>
                  {!checkedIn && (
                    <Button
                      size="sm"
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={() => handleCheckIn(zone)}
                    >
                      Check In
                    </Button>
                  )}
                  {checkedIn && selectedZone?.id === zone.id && (
                    <Button size="sm" variant="outline" className="w-full bg-transparent" onClick={handleCheckOut}>
                      Check Out
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 text-center">
              <p className="text-sm text-muted-foreground">No zones in range</p>
              <p className="text-xs text-muted-foreground mt-1">Move closer to a location to check in</p>
            </div>
          )}
        </div>

        {/* All Zones */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">All Zones</h3>
          <div className="space-y-2">
            {ZONES.map((zone) => {
              const distance = calculateDistance(userLocation.lat, userLocation.lng, zone.lat, zone.lng)
              const inRange = distance <= zone.radius
              return (
                <div key={zone.id} className="text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground">{zone.name}</span>
                    <span className={inRange ? "text-accent font-medium" : "text-muted-foreground"}>
                      {Math.round(distance)}m
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
