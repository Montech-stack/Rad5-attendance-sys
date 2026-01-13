"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MapPin, CheckCircle2, Clock } from "lucide-react"

export default function QuickStats() {
  // Demo statistics
  const stats = [
    {
      title: "Total Employees",
      value: "24",
      description: "Active staff members",
      icon: Users,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      title: "Checked In Today",
      value: "18",
      description: "Currently on location",
      icon: MapPin,
      color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
    },
    {
      title: "On Time",
      value: "16",
      description: "Last 7 days",
      icon: CheckCircle2,
      color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300",
    },
    {
      title: "Late Arrivals",
      value: "2",
      description: "Last 7 days",
      icon: Clock,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
