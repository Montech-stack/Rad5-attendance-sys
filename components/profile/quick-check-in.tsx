"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, LogOut } from "lucide-react"
import LocationCheckerModal from "@/components/check-in/location-checker-modal"

interface User {
  email: string
  name: string
  role: string
}

interface CheckInRecord {
  checkInTime: string
  checkInLocation: { lat: number; lng: number }
}

export default function QuickCheckIn({ user }: { user: User }) {
  const [checkedIn, setCheckedIn] = useState(false)
  const [checkInRecord, setCheckInRecord] = useState<CheckInRecord | null>(null)
  const [showLocationModal, setShowLocationModal] = useState(false)

  const handleCheckInSuccess = (location: { lat: number; lng: number; timestamp: string }) => {
    setShowLocationModal(false)
    setCheckedIn(true)
    setCheckInRecord({
      checkInTime: new Date(location.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      checkInLocation: location,
    })
  }

  const handleCheckInFailed = () => {
    // Modal will show the error message
  }

  const handleCheckOut = () => {
    setCheckedIn(false)
    setCheckInRecord(null)
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Check In / Check Out</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!checkedIn ? (
            <div>
              <p className="text-sm text-muted-foreground mb-4">You are currently checked out</p>
              <Button
                className="w-full bg-accent hover:bg-accent/90"
                size="lg"
                onClick={() => setShowLocationModal(true)}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Check In
              </Button>
            </div>
          ) : (
            <div>
              <div className="bg-accent/10 border border-accent rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-accent mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">Checked In</span>
                </div>
                {checkInRecord && (
                  <>
                    <p className="text-xs text-muted-foreground">Check-in time: {checkInRecord.checkInTime}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Location: ({checkInRecord.checkInLocation.lat.toFixed(4)},{" "}
                      {checkInRecord.checkInLocation.lng.toFixed(4)})
                    </p>
                  </>
                )}
              </div>
              <Button className="w-full bg-destructive hover:bg-destructive/90" size="lg" onClick={handleCheckOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Check Out
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <LocationCheckerModal
        isOpen={showLocationModal}
        onCheckInSuccess={handleCheckInSuccess}
        onCheckInFailed={handleCheckInFailed}
        onClose={() => setShowLocationModal(false)}
      />
    </>
  )
}
