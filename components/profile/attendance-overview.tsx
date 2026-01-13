"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, CheckCircle } from "lucide-react"

interface User {
  email: string
  name: string
  role: string
}

const MOCK_ATTENDANCE = [
  {
    id: "1",
    date: "Today",
    checkIn: "09:00 AM",
    checkOut: "05:30 PM",
    duration: "8h 30m",
    status: "on-time",
  },
  {
    id: "2",
    date: "Yesterday",
    checkIn: "08:45 AM",
    checkOut: "05:15 PM",
    duration: "8h 30m",
    status: "on-time",
  },
  {
    id: "3",
    date: "Dec 10",
    checkIn: "09:30 AM",
    checkOut: "06:00 PM",
    duration: "8h 30m",
    status: "late",
  },
]

export default function AttendanceOverview({ user }: { user: User }) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">Your Attendance History</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Last 7 days of attendance records</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 sm:space-y-3">
          {MOCK_ATTENDANCE.map((record) => (
            <div
              key={record.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 sm:p-3 border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-foreground">{record.date}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-muted-foreground">
                  <span>In: {record.checkIn}</span>
                  <span>Out: {record.checkOut}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {record.duration}
                  </span>
                </div>
              </div>
              <Badge variant={record.status === "on-time" ? "default" : "secondary"} className="w-fit">
                {record.status === "on-time" ? <CheckCircle className="w-3 h-3 mr-1" /> : null}
                {record.status === "on-time" ? "On Time" : "Late"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
