"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import AddUserForm from "./add-user-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  trackId?: string | null;
  department?: string;
  status?: "checked_in" | "checked_out";
  phone?: string;
}

interface Attendance {
  id: string;
  userId: string;
  date: string;
  checkInTime: string;
  checkOutTime: string | null;
  status: string;
}

interface EmployeeListProps {
  users: User[];
  userRole: string;
  onRefresh?: () => void;
}

export default function EmployeeList({
  users,
  userRole,
  onRefresh,
}: EmployeeListProps) {
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users || []);
  const [filterType, setFilterType] = useState<"all" | "student" | "staff">(
    "all"
  );

  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [attendanceMap, setAttendanceMap] = useState<
    Record<string, Attendance[]>
  >({});
  const [loadingUser, setLoadingUser] = useState<string | null>(null);

  const BASE_URL =
    "https://attendance.bookbank.com.ng/api/v1/attendance/attendance/users";

  // ---- FILTER + SEARCH LOGIC (your original behavior preserved) ----
  useEffect(() => {
    let updated = [...users];

    if (filterType === "student") {
      updated = updated.filter((u) => u.trackId);
    } else if (filterType === "staff") {
      updated = updated.filter((u) => !u.trackId);
    }

    if (search.trim()) {
      updated = updated.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (user.department?.toLowerCase() || "").includes(
            search.toLowerCase()
          )
      );
    }

    setFilteredUsers(updated);
  }, [users, search, filterType]);

  // ---- HANDLE EXPAND + FETCH ATTENDANCE ----
  const handleExpand = async (userId: string) => {
    // Close if clicking same user again
    if (expandedUserId === userId) {
      setExpandedUserId(null);
      return;
    }

    setExpandedUserId(userId);

    // If already fetched before, don't refetch
    if (attendanceMap[userId]) return;

    try {
      setLoadingUser(userId);

      const res = await fetch(`${BASE_URL}/${userId}`);
      const data = await res.json();

      setAttendanceMap((prev) => ({
        ...prev,
        [userId]: data.data || [],
      }));
    } catch (error) {
      console.error("Failed to fetch attendance", error);
    } finally {
      setLoadingUser(null);
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>User Directory</CardTitle>
            <CardDescription>
              Click a user to view attendance history
            </CardDescription>
          </div>
          {userRole === "admin" && onRefresh && (
            <AddUserForm onUserAdded={onRefresh} />
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* SEARCH + FILTER */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name..."
              className="pl-10 bg-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select
            value={filterType}
            onValueChange={(val) =>
              setFilterType(val as "all" | "student" | "staff")
            }
          >
            <SelectTrigger className="w-40 mt-2 sm:mt-0">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="student">Students</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredUsers.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No users found.
          </p>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => {
              const isExpanded = expandedUserId === user.id;
              const attendance = attendanceMap[user.id];

              return (
                <div key={user.id}>
                  {/* USER ROW */}
                  <div
                    onClick={() => handleExpand(user.id)}
                    className="p-4 border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {user.firstName} {user.lastName}
                        </span>

                        <Badge
                          className="sm:hidden"
                          variant={
                            user.status === "checked_in"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {user.status === "checked_in"
                            ? "Checked In"
                            : "Checked Out"}
                        </Badge>

                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-2 sm:mt-0">
                        <span className="text-sm text-muted-foreground">
                          {user.email}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                          {user.trackId ? "Student" : "Staff"}
                        </span>
                      </div>
                    </div>

                    <div className="hidden sm:flex-shrink-0 sm:flex sm:self-auto">
                      <Badge
                        variant={
                          user.status === "checked_in"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {user.status === "checked_in"
                          ? "Checked In"
                          : "Checked Out"}
                      </Badge>
                    </div>
                  </div>

                  {/* EXPANDED ATTENDANCE PANEL */}
                  {isExpanded && (
                    <div className="ml-4 mt-2 p-4 border border-border rounded-lg bg-muted">
                      {loadingUser === user.id ? (
                        <div className="flex items-center gap-2 text-sm">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading attendance...
                        </div>
                      ) : attendance && attendance.length > 0 ? (
                        <div className="space-y-2">
                          {attendance.map((att) => (
                            <div
                              key={att.id}
                              className="text-sm flex justify-between border-b pb-2"
                            >
                              <span>{att.date}</span>
                              <span>
                                {new Date(
                                  att.checkInTime
                                ).toLocaleTimeString()}{" "}
                                →
                                {att.checkOutTime
                                  ? new Date(
                                      att.checkOutTime
                                    ).toLocaleTimeString()
                                  : "—"}
                              </span>
                              <span className="font-medium">
                                {att.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No attendance records found.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
