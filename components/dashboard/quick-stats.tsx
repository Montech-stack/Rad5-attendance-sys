"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MapPin, CheckCircle2, Clock, BookOpen, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface Stat {
  title: string;
  value: string | number;
  description: string;
  icon: any;
  trend?: { value: number; label: string; positive: boolean };
  gradient: string;
  filterType: string;
}

interface QuickStatsProps {
  users: any[];
  attendance: any[];
  stats?: any;
  onFilterChange?: (filter: "all" | "student" | "staff" | "checked_in" | "late" | "absent") => void;
}

export default function QuickStats({ users, attendance, stats, onFilterChange }: QuickStatsProps) {
  // Use backend stats if available, otherwise fallback to local calculation
  const totalStaff = stats ? stats.totalStaff : users.filter(u => !u.trackId).length;
  // If stats.totalStudents is 0 but we have users, it might be a data sync issue. 
  // Trusted source -> stats (backend), fallback -> users
  const totalStudents = stats ? stats.totalStudents : users.filter(u => !!u.trackId).length;

  const checkedIn = stats ? stats.checkedInToday : attendance.filter(a => a.status === "checked_in").length;
  const onTime = stats ? stats.onTimeLast7Days : attendance.filter(a => a.status === "checked_in" && !a.isLate).length;
  const lateArrivals = stats ? stats.lateLast7Days : attendance.filter(a => a.status === "checked_in" && a.isLate).length;

  // Calculate Absent: Total Users (Staff + Students) - Checked In
  const totalUsers = totalStaff + totalStudents;
  const absentCount = totalUsers - checkedIn;

  const statCards: Stat[] = [
    {
      title: "Total Staff",
      value: totalStaff,
      description: "Active employees",
      icon: Users,
      trend: { value: 2, label: "vs last month", positive: true },
      gradient: "from-blue-500/10 to-blue-500/5 border-blue-200/50 dark:border-blue-800/50",
      filterType: "staff",
    },
    {
      title: "Total Students",
      value: totalStudents,
      description: "Enrolled students",
      icon: BookOpen,
      trend: { value: 12, label: "vs last month", positive: true },
      gradient: "from-purple-500/10 to-purple-500/5 border-purple-200/50 dark:border-purple-800/50",
      filterType: "student",
    },
    {
      title: "Checked In",
      value: checkedIn,
      description: "Present today",
      icon: MapPin,
      gradient: "from-emerald-500/10 to-emerald-500/5 border-emerald-200/50 dark:border-emerald-800/50",
      filterType: "checked_in",
    },
    {
      title: "On Time",
      value: onTime,
      description: "Punctual arrivals",
      icon: CheckCircle2,
      trend: { value: 5, label: "vs yesterday", positive: true },
      gradient: "from-teal-500/10 to-teal-500/5 border-teal-200/50 dark:border-teal-800/50",
      filterType: "checked_in",
    },
    {
      title: "Late Arrivals",
      value: lateArrivals,
      description: "Needs attention",
      icon: Clock,
      trend: { value: 2, label: "vs yesterday", positive: false },
      gradient: "from-amber-500/10 to-amber-500/5 border-amber-200/50 dark:border-amber-800/50",
      filterType: "late",
    },
    {
      title: "Absent",
      value: Math.max(0, absentCount),
      description: "Not checked in",
      icon: AlertCircle,
      gradient: "from-red-500/10 to-red-500/5 border-red-200/50 dark:border-red-800/50",
      filterType: "absent",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            onClick={() => onFilterChange?.(stat.filterType as any)}
            className={`border shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br ${stat.gradient} backdrop-blur-sm cursor-pointer active:scale-[0.95]`}
          >
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="p-2 bg-background/50 rounded-lg backdrop-blur-md shadow-sm">
                <Icon className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                {stat.trend && (
                  <span className={`flex items-center ${stat.trend.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {stat.trend.positive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {stat.trend.value}%
                  </span>
                )}
                <span className="opacity-80 line-clamp-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
