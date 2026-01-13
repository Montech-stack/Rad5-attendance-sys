"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Download } from "lucide-react"

interface AttendanceRecord {
  id: string
  employee: string
  department: string
  date: string
  checkIn: string
  checkOut: string | null
  location: string
  duration: string
  status: "on_time" | "late" | "absent"
}

const MOCK_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "1",
    employee: "Sarah Williams",
    department: "Engineering",
    date: "2024-01-12",
    checkIn: "09:00 AM",
    checkOut: "05:30 PM",
    location: "Building A",
    duration: "8h 30m",
    status: "on_time",
  },
  {
    id: "2",
    employee: "Mike Davis",
    department: "Sales",
    date: "2024-01-12",
    checkIn: "09:15 AM",
    checkOut: "05:45 PM",
    location: "Building B",
    duration: "8h 30m",
    status: "late",
  },
  {
    id: "3",
    employee: "Emma Johnson",
    department: "HR",
    date: "2024-01-12",
    checkIn: "09:00 AM",
    checkOut: null,
    location: "Building A",
    duration: "4h 30m",
    status: "on_time",
  },
  {
    id: "4",
    employee: "James Wilson",
    department: "Engineering",
    date: "2024-01-12",
    checkIn: "08:45 AM",
    checkOut: "05:15 PM",
    location: "Building A",
    duration: "8h 30m",
    status: "on_time",
  },
  {
    id: "5",
    employee: "Lisa Brown",
    department: "Marketing",
    date: "2024-01-12",
    checkIn: "-",
    checkOut: "-",
    location: "-",
    duration: "-",
    status: "absent",
  },
  {
    id: "6",
    employee: "Sarah Williams",
    department: "Engineering",
    date: "2024-01-11",
    checkIn: "09:05 AM",
    checkOut: "05:35 PM",
    location: "Building A",
    duration: "8h 30m",
    status: "on_time",
  },
  {
    id: "7",
    employee: "Mike Davis",
    department: "Sales",
    date: "2024-01-11",
    checkIn: "09:30 AM",
    checkOut: "06:00 PM",
    location: "Building B",
    duration: "8h 30m",
    status: "late",
  },
  {
    id: "8",
    employee: "James Wilson",
    department: "Engineering",
    date: "2024-01-11",
    checkIn: "08:50 AM",
    checkOut: "05:20 PM",
    location: "Building A",
    duration: "8h 30m",
    status: "on_time",
  },
]

function getStatusColor(status: string) {
  switch (status) {
    case "on_time":
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
    case "late":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
    case "absent":
      return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "on_time":
      return "On Time"
    case "late":
      return "Late"
    case "absent":
      return "Absent"
    default:
      return status
  }
}

export default function AttendanceHistory({ userRole }: { userRole: string }) {
  const [filterDate, setFilterDate] = useState("2024-01-12")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredRecords = MOCK_ATTENDANCE.filter((record) => {
    const dateMatch = record.date === filterDate
    const departmentMatch = filterDepartment === "all" || record.department === filterDepartment
    const statusMatch = filterStatus === "all" || record.status === filterStatus
    return dateMatch && departmentMatch && statusMatch
  })

  const statistics = {
    total: filteredRecords.length,
    onTime: filteredRecords.filter((r) => r.status === "on_time").length,
    late: filteredRecords.filter((r) => r.status === "late").length,
    absent: filteredRecords.filter((r) => r.status === "absent").length,
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-2xl font-bold text-foreground">{statistics.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">On Time</p>
              <p className="text-2xl font-bold text-green-600">{statistics.onTime}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Late</p>
              <p className="text-2xl font-bold text-amber-600">{statistics.late}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Absent</p>
              <p className="text-2xl font-bold text-red-600">{statistics.absent}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and History */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Attendance History</CardTitle>
              <CardDescription>View and manage employee attendance records</CardDescription>
            </div>
            {userRole === "admin" && (
              <Button variant="outline" className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Export
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="pl-10 bg-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Department</label>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="bg-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="on_time">On Time</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* History Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium text-foreground text-sm">Employee</th>
                  <th className="text-left p-3 font-medium text-foreground text-sm">Department</th>
                  <th className="text-left p-3 font-medium text-foreground text-sm">Check In</th>
                  <th className="text-left p-3 font-medium text-foreground text-sm">Check Out</th>
                  <th className="text-left p-3 font-medium text-foreground text-sm">Duration</th>
                  <th className="text-left p-3 font-medium text-foreground text-sm">Location</th>
                  <th className="text-left p-3 font-medium text-foreground text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b border-border hover:bg-muted transition-colors">
                    <td className="p-3">
                      <span className="font-medium text-foreground">{record.employee}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-muted-foreground">{record.department}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {record.checkIn}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-muted-foreground">{record.checkOut || "-"}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-foreground">{record.duration}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {record.location}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={`${getStatusColor(record.status)}`}>{getStatusLabel(record.status)}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No records found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
