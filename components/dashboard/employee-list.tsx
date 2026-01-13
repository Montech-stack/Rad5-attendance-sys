"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Clock, MoreVertical } from "lucide-react"

interface Employee {
  id: string
  name: string
  department: string
  status: "checked_in" | "checked_out"
  location: string
  lastActivity: string
  phone: string
}

const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "1",
    name: "Sarah Williams",
    department: "Engineering",
    status: "checked_in",
    location: "Building A",
    lastActivity: "10:45 AM",
    phone: "+1 234 567 8901",
  },
  {
    id: "2",
    name: "Mike Davis",
    department: "Sales",
    status: "checked_in",
    location: "Building B",
    lastActivity: "09:30 AM",
    phone: "+1 234 567 8902",
  },
  {
    id: "3",
    name: "Emma Johnson",
    department: "HR",
    status: "checked_out",
    location: "Off-site",
    lastActivity: "05:15 PM (Yesterday)",
    phone: "+1 234 567 8903",
  },
  {
    id: "4",
    name: "James Wilson",
    department: "Engineering",
    status: "checked_in",
    location: "Building A",
    lastActivity: "08:00 AM",
    phone: "+1 234 567 8904",
  },
  {
    id: "5",
    name: "Lisa Brown",
    department: "Marketing",
    status: "checked_out",
    location: "Off-site",
    lastActivity: "04:45 PM (Yesterday)",
    phone: "+1 234 567 8905",
  },
]

export default function EmployeeList({ userRole }: { userRole: string }) {
  const [search, setSearch] = useState("")
  const [filteredEmployees, setFilteredEmployees] = useState(MOCK_EMPLOYEES)

  const handleSearch = (value: string) => {
    setSearch(value)
    const filtered = MOCK_EMPLOYEES.filter(
      (emp) =>
        emp.name.toLowerCase().includes(value.toLowerCase()) ||
        emp.department.toLowerCase().includes(value.toLowerCase()),
    )
    setFilteredEmployees(filtered)
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Employee Directory</CardTitle>
            <CardDescription>Manage and track employee attendance status</CardDescription>
          </div>
          {userRole === "admin" && <Button>Add Employee</Button>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or department..."
              className="pl-10 bg-input"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredEmployees.map((employee) => (
            <div key={employee.id} className="p-4 border border-border rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-foreground">{employee.name}</h3>
                    <Badge variant={employee.status === "checked_in" ? "default" : "secondary"}>
                      {employee.status === "checked_in" ? "Checked In" : "Checked Out"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{employee.department}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{employee.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{employee.lastActivity}</span>
                    </div>
                    <div className="text-muted-foreground">
                      <span>{employee.phone}</span>
                    </div>
                  </div>
                </div>
                {userRole === "admin" && (
                  <button className="p-2 hover:bg-muted rounded transition-colors">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
