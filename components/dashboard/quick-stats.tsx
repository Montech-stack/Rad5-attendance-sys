"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, CheckCircle2, Clock, BookOpen } from "lucide-react";

interface Stat {
  title: string;
  value: string | number;
  description: string;
  icon: any;
  color: string;
}

interface QuickStatsProps {
  users: any[];
  attendance: any[];
}

export default function QuickStats({ users, attendance }: QuickStatsProps) {
  const totalStaff = users.filter(u => !u.trackId).length;
  const totalStudents = users.filter(u => !!u.trackId).length;

  const checkedIn = attendance.filter(a => a.status === "checked_in").length;
  const onTime = attendance.filter(a => a.status === "checked_in" && !a.isLate).length;
  const lateArrivals = attendance.filter(a => a.status === "checked_in" && a.isLate).length;

  const stats: Stat[] = [
    {
      title: "Total Staff",
      value: totalStaff,
      description: "Active staff members",
      icon: Users,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      title: "Total Students",
      value: totalStudents,
      description: "Active students",
      icon: BookOpen,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      title: "Checked In Today",
      value: checkedIn,
      description: "Currently on location",
      icon: MapPin,
      color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
    },
    {
      title: "On Time",
      value: onTime,
      description: "Last 7 days",
      icon: CheckCircle2,
      color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300",
    },
    {
      title: "Late Arrivals",
      value: lateArrivals,
      description: "Last 7 days",
      icon: Clock,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {stats.map(stat => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="border-0 shadow-sm hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2 flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
