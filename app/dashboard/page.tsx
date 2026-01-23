"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/dashboard/header";
import EmployeeList from "@/components/dashboard/employee-list";
import QuickStats from "@/components/dashboard/quick-stats";
import { apiRequest } from "@/lib/api";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  trackId?: string | null;
  department?: string;
  status?: "checked_in" | "checked_out";
  location?: string;
  lastActivity?: string;
  phone?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
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
    if (parsedUser.role !== "admin") {
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
      const res = await apiRequest("/users/users");
      const data = res.data?.data || res.data || [];
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
      setAttendance(res.data || []);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
    }
  }, []);

  // ---------------------
  // Initial fetch
  // ---------------------
  useEffect(() => {
    fetchUsers();
    fetchAttendance();
  }, [fetchUsers, fetchAttendance]);

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader user={{ name: fullName, role: user.role }} />
      <div className="container mx-auto px-4 py-8 space-y-8">
        <QuickStats users={users} attendance={attendance} />
        <EmployeeList
          users={users}
          onRefresh={fetchUsers}
          userRole={user.role}
        />
      </div>
    </main>
  );
}
