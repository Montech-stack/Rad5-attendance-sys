"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, CheckCircle, AlertCircle } from "lucide-react";

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
  id: string; // Ensure the user object has an ID
}

interface AttendanceOverviewProps {
  user: User;
}

export default function AttendanceOverview({ user }: AttendanceOverviewProps) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://attendance.bookbank.com.ng/api/v1/attendance/attendance/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          const formattedData = data.data.map((record: any) => ({
            id: record.id,
            date: new Date(record.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
            checkInTime: new Date(record.checkInTime).toLocaleTimeString(),
            checkOutTime: record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : "N/A",
            status: record.status.toLowerCase(), // "on-time" or "late"
            latitude: record.latitude,
            longitude: record.longitude,
          }));
          setAttendance(formattedData);
        } else {
          setError("Failed to fetch attendance.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching attendance.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [user.id, token]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">Your Attendance History</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Last 7 days of attendance records</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-sm text-muted-foreground">Loading attendance...</p>}
        {error && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> {error}
          </p>
        )}
        {!loading && !error && (
          <div className="space-y-2 sm:space-y-3">
            {attendance.length === 0 && <p className="text-sm text-muted-foreground">No attendance records found.</p>}
            {attendance.map((record) => (
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
                    <span>In: {record.checkInTime}</span>
                    <span>Out: {record.checkOutTime}</span>
                    {/* <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {record.checkInTime && record.checkOutTime
                        ? `${Math.floor(
                            (new Date(record.checkOutTime).getTime() - new Date(record.checkInTime).getTime()) /
                              (1000 * 60 * 60)
                          )}h ${Math.floor(
                            ((new Date(record.checkOutTime).getTime() - new Date(record.checkInTime).getTime()) %
                              (1000 * 60 * 60)) /
                              (1000 * 60)
                          )}m`
                        : "-"}
                    </span> */}
                  </div>
                </div>
                <Badge
                  variant={record.status === "on-time" ? "default" : "secondary"}
                  className="w-fit flex items-center gap-1"
                >
                  {record.status === "on-time" && <CheckCircle className="w-3 h-3" />}
                  {record.status === "on-time" ? "On Time" : "Late"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
