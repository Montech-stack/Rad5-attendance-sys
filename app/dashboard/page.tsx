"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/dashboard/header";
import EmployeeList from "@/components/dashboard/employee-list";
import QuickStats from "@/components/dashboard/quick-stats";
import AnalyticsCharts from "@/components/dashboard/analytics-charts";
import { apiRequest } from "@/lib/api";
import { format } from "date-fns";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  role?: string | { name: string };
  trackId?: string | null;
  department?: string;
  status?: "on_time" | "checked_out" | "late" | "absent";
  isLate?: boolean;
  location?: string;
  lastActivity?: string;
  phone?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null); // New stats state
  const [loading, setLoading] = useState(false);
  // Add state for filtering
  const [currentFilter, setCurrentFilter] = useState<"all" | "student" | "staff" | "checked_in" | "on_time" | "late" | "absent">("all");
  const router = useRouter();

  // ---------------------
  // User auth check
  // ---------------------
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) {
      router.push("/");
      return;
    }
    const parsedUser = JSON.parse(storedUser);

    // Check role safely
    const roleName = typeof parsedUser.role === 'object' ? parsedUser.role.name : parsedUser.role;

    if (roleName !== "admin" && roleName !== "Admin") {
      router.push("/profile");
      return;
    }
    setUser(parsedUser);
  }, [router]);

  // ---------------------
  // Fetch users
  // ---------------------
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiRequest("/users/users?limit=1000");
      // Handle various response structures
      const data = Array.isArray(res) ? res : (res.data?.data || res.data || []);
      console.log("Users fetched:", data);
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------------------
  // Fetch today's attendance
  // ---------------------
  const fetchAttendance = useCallback(async () => {
    try {
      const res = await apiRequest("/attendance/today");
      // Handle various response structures (array or object)
      const data = Array.isArray(res) ? res : (res.data || []);
      console.log("Attendance fetched:", data);
      setAttendance(data);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
    }
  }, []);

  // ---------------------
  // Fetch Dashboard Stats (NEW)
  // ---------------------
  const fetchStats = useCallback(async () => {
    try {
      const res = await apiRequest("/admins/dashboard");
      // Response structure: { success: true, data: { totalStaff, totalStudents, ... } }
      setStats(res.data?.data || res.data || null);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    }
  }, []);

  // ---------------------
  // Fetch Full History for Charts
  // ---------------------
  const [history, setHistory] = useState<any[]>([]);
  const fetchHistory = useCallback(async () => {
    try {
      const res = await apiRequest("/attendance/attendance/users"); // Helper for all records
      const data = Array.isArray(res) ? res : (res.data?.data || res.data || []);
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  }, []);

  // ---------------------
  // Initial fetch
  // ---------------------
  useEffect(() => {
    fetchUsers();
    fetchAttendance();
    fetchStats();
    fetchHistory();
  }, [fetchUsers, fetchAttendance, fetchStats, fetchHistory]);

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const fullName = `${user.firstName} ${user.lastName}`;
  const currentDate = format(new Date(), "EEEE, MMMM do, yyyy");

  // Extract role string for props
  const roleProp = typeof user.role === 'object' ? user.role.name : (user.role || "User");

  // ---------------------
  // Derive Users with Status
  // ---------------------
  const derivedUsers = users.map(u => {
    const userId = String(u.id);

    // Try to find attendance record using multiple possible ID fields with loose equality/string conversion
    const record = attendance.find(a => 
      (a.userId && String(a.userId) === userId) || 
      (a.user_id && String(a.user_id) === userId) || 
      (a.employeeId && String(a.employeeId) === userId) ||
      (a.studentId && String(a.studentId) === userId) ||
      (a.user && a.user.id && String(a.user.id) === userId)
    );

    let status: "on_time" | "checked_out" | "late" | "absent" = "absent";
    
    // Only assign a non-absent status if a record for today actually exists
    if (record) {
      const s = record.status ? String(record.status).toLowerCase() : "";

      // Start with the most specific status and move down
      if (record.checkOutTime || s.includes("checked_out") || s.includes("check_out")) {
        status = "checked_out";
      } else if (s.includes("late") || record.isLate) {
        status = "late";
      } else {
        // If a record exists and they aren't checked out or late, they must be on time.
        status = "on_time";
      }
    }

    return { ...u, status };
  });

  // ---------------------
  // Calculate specific stats from derived users for consistency
  // ---------------------
  const calculatedStats = {
    totalStaff: derivedUsers.filter(u => !u.trackId).length,
    totalStudents: derivedUsers.filter(u => !!u.trackId).length,
    checkedIn: derivedUsers.filter(u => u.status === "on_time" || u.status === "late").length,
    onTime: derivedUsers.filter(u => u.status === "on_time").length,
    lateArrivals: derivedUsers.filter(u => u.status === "late").length,
    absent: derivedUsers.filter(u => u.status === "absent").length
  };

  return (
    <main className="min-h-screen bg-background pb-12">
      <DashboardHeader user={{ name: fullName, role: roleProp, firstName: user.firstName, lastName: user.lastName }} />
      <div className="container mx-auto px-4 py-8 space-y-8">

        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user.firstName}. Here's what's happening today.
            </p>
          </div>
          <div className="text-sm font-medium px-4 py-2 rounded-full bg-secondary text-secondary-foreground shadow-sm">
            {currentDate}
          </div>
        </div>

        {/* Stats & Analytics Layer */}
        <div className="space-y-6">
          <QuickStats
            users={users}
            attendance={attendance}
            stats={stats}
            calculatedStats={calculatedStats}
            onFilterChange={(filter) => {
              document.getElementById('employee-list-section')?.scrollIntoView({ behavior: 'smooth' });
              setCurrentFilter(filter);
            }}
          />

          <AnalyticsCharts
            attendance={attendance}
            history={history}
            users={users}
            stats={stats}
            calculatedStats={calculatedStats}
            onStatusSelect={(status) => {
              // set filter and scroll to employee list
              setCurrentFilter(status as any);
              document.getElementById('employee-list-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>

        {/* Data Management Layer */}
        <div id="employee-list-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Personnel Management</h2>
          </div>
          <EmployeeList
            users={derivedUsers}
            onRefresh={fetchUsers}
            userRole={roleProp}
            initialFilter={currentFilter}
          />
        </div>
      </div>
    </main>
  );
}
