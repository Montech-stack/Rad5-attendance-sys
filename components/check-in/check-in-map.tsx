"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CheckInMapProps {
  userLocation: { lat: number; lng: number }
}

// Define track locations
const TRACKS = [
  { id: 1, name: "Building A", lat: 37.7849, lng: -122.4094, radius: 100 },
  { id: 2, name: "Building B", lat: 37.7849, lng: -122.3994, radius: 100 },
  { id: 3, name: "Office Main", lat: 37.7649, lng: -122.4194, radius: 150 },
]

export default function CheckInMap({ userLocation }: CheckInMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#f5f5f5"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Set up map bounds
    const minLat = 37.76
    const maxLat = 37.79
    const minLng = -122.43
    const maxLng = -122.39

    const getCanvasCoords = (lat: number, lng: number) => {
      const x = ((lng - minLng) / (maxLng - minLng)) * canvas.width
      const y = canvas.height - ((lat - minLat) / (maxLat - minLat)) * canvas.height
      return { x, y }
    }

    // Draw tracks (zones)
    TRACKS.forEach((track) => {
      const { x, y } = getCanvasCoords(track.lat, track.lng)
      const radiusPixels = (track.radius / 111000) * ((maxLat - minLat) / (canvas.height / canvas.width))

      // Draw zone circle
      ctx.fillStyle = "rgba(59, 130, 246, 0.1)"
      ctx.beginPath()
      ctx.arc(x, y, radiusPixels * canvas.width, 0, Math.PI * 2)
      ctx.fill()

      // Draw zone border
      ctx.strokeStyle = "rgb(59, 130, 246)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw zone center
      ctx.fillStyle = "rgb(59, 130, 246)"
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fill()

      // Draw zone label
      ctx.fillStyle = "rgb(0, 0, 0)"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(track.name, x, y - radiusPixels * canvas.width - 10)
    })

    // Draw user location
    const { x: userX, y: userY } = getCanvasCoords(userLocation.lat, userLocation.lng)
    ctx.fillStyle = "rgb(34, 197, 94)"
    ctx.beginPath()
    ctx.arc(userX, userY, 8, 0, Math.PI * 2)
    ctx.fill()

    // Draw user marker border
    ctx.strokeStyle = "rgb(16, 185, 129)"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw user label
    ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.font = "bold 12px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("You", userX, userY + 20)
  }, [userLocation])

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Location Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted rounded-lg overflow-hidden border border-border">
          <canvas ref={canvasRef} width={600} height={400} className="w-full" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-muted-foreground">Zones</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-muted-foreground">Your Location</span>
          </div>
          <div className="text-muted-foreground text-xs">
            <span>
              {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
