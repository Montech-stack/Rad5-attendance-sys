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
  calculatedStats?: {
    totalStaff: number;
    totalStudents: number;
    checkedIn: number;
    onTime: number;
    lateArrivals: number;
    absent: number;
  };
  onFilterChange?: (filter: "all" | "student" | "staff" | "checked_in" | "on_time" | "late" | "absent") => void;
}

export default function QuickStats({ users, attendance, stats, calculatedStats, onFilterChange }: QuickStatsProps) {
  // Use calculated stats if available (most accurate from frontend derived state), 
  // otherwise fallback to backend stats or local calculation
  
  // Prefer Backend Stats for aggregate counts if frontend calculation seems empty/suspicious (e.g., matching failed)
  const useBackendStats = stats && (!calculatedStats || calculatedStats.checkedIn === 0) && stats.checkedInToday > 0;

  const totalStaff = useBackendStats ? stats.totalStaff : (calculatedStats ? calculatedStats.totalStaff : ((stats ? stats.totalStaff : users.filter(u => !u.trackId).length) || 0));
  const totalStudents = useBackendStats ? stats.totalStudents : (calculatedStats ? calculatedStats.totalStudents : ((stats ? stats.totalStudents : users.filter(u => !!u.trackId).length) || 0));

  const checkedIn = useBackendStats ? (stats.checkedInToday || 0) : (calculatedStats ? calculatedStats.checkedIn : ((stats ? stats.checkedInToday : attendance.filter(a => a.status === "checked_in" || a.status?.toLowerCase().includes("late")).length) || 0));
  
  const lateArrivals = useBackendStats ? (stats.lateArrivals || 0) : (calculatedStats ? calculatedStats.lateArrivals : attendance.filter(a => a.status && a.status.toLowerCase().includes("late")).length);
  
  // Ensure we are working with numbers to prevent NaN
  const safeCheckedIn = Number(checkedIn) || 0;
  const safeLateArrivals = Number(lateArrivals) || 0;

  const onTime = useBackendStats 
    ? (stats.onTime || Math.max(0, safeCheckedIn - safeLateArrivals)) 
    : (calculatedStats ? calculatedStats.onTime : Math.max(0, safeCheckedIn - safeLateArrivals));

  // Calculate Absent
  const totalUsers = (Number(totalStaff) || 0) + (Number(totalStudents) || 0);
  const absentCount = useBackendStats 
    ? (stats.absent || Math.max(0, totalUsers - safeCheckedIn)) 
    : (calculatedStats ? calculatedStats.absent : Math.max(0, totalUsers - safeCheckedIn));

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
      filterType: "on_time",
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
