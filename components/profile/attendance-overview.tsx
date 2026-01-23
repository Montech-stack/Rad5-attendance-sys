"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, MapPin, ArrowRight } from "lucide-react";

interface AttendanceRecord {
  id: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  status: string;
  latitude?: string;
  longitude?: string;
}

interface User {
  email: string;
  name: string;
  role: string;
  id: string;
}

interface AttendanceOverviewProps {
  user: User;
  attendance?: any[];
}

export default function AttendanceOverview({ user, attendance: propAttendance }: AttendanceOverviewProps) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    if (propAttendance) {
      const formattedData = propAttendance.map((record: any) => ({
        id: record.id,
        date: new Date(record.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        checkInTime: new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        checkOutTime: record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A",
        status: record.status ? record.status.toLowerCase() : "unknown",
        latitude: record.latitude,
        longitude: record.longitude,
      }));
      setAttendance(formattedData);
    }
  }, [propAttendance]);

  return (
    <Card className="w-full border-none shadow-xl bg-white/70 dark:bg-card/50 backdrop-blur-md overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Activity History</CardTitle>
            <CardDescription className="text-sm mt-1">Timeline of your recent attendance</CardDescription>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 shadow-inner">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6">
        <div className="space-y-0 relative border-l-2 border-blue-500/20 ml-3 pl-8 pb-4">
          {attendance.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 opacity-60">
              <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-muted-foreground/40" />
              </div>
              <p className="text-muted-foreground italic">No recent activity recorded.</p>
            </div>
          )}
          {attendance.map((record, index) => {
            const isOnTime = record.status === "on-time" || record.status === "checked_in";
            const isLate = record.status.includes("late");

            return (
              <div
                key={record.id}
                className="relative mb-8 last:mb-0 group"
              >
                {/* Timeline Dot */}
                <div className={`absolute -left-[41px] top-1 h-5 w-5 rounded-full border-4 border-background shadow-md z-10 transition-all duration-300 group-hover:scale-125 ${isOnTime ? "bg-purple-500" : isLate ? "bg-amber-500" : "bg-gray-400"}`} />
                {/* Pulse Effect behind dot */}
                <div className={`absolute -left-[41px] top-1 h-5 w-5 rounded-full animate-ping opacity-20 ${isOnTime ? "bg-purple-500" : isLate ? "bg-amber-500" : "bg-gray-400"}`} />

                <div className="bg-gradient-to-br from-card to-secondary/10 p-4 rounded-2xl border border-white/20 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-x-1 group-hover:border-primary/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                    <span className="text-base font-bold text-foreground flex items-center gap-2">
                      {record.date}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] uppercase px-2 py-0.5 h-6 font-bold tracking-wider shadow-sm border-0 ${isOnTime ? "bg-purple-100 text-purple-700" : isLate ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"}`}
                    >
                      {record.status.replace("_", " ")}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-background/50 p-2 rounded-lg flex items-center gap-3">
                      <div className={`p-1.5 rounded-full ${isOnTime ? 'bg-purple-100 text-purple-600' : 'bg-amber-100 text-amber-600'}`}>
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">In</p>
                        <p className="font-semibold">{record.checkInTime}</p>
                      </div>
                    </div>

                    {record.checkOutTime !== "N/A" ? (
                      <div className="bg-background/50 p-2 rounded-lg flex items-center gap-3">
                        <div className="p-1.5 rounded-full bg-blue-100 text-blue-600">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Out</p>
                          <p className="font-semibold">{record.checkOutTime}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-background/50 p-2 rounded-lg flex items-center gap-2 opacity-50">
                        <span className="text-xs italic">Active Session</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
}
