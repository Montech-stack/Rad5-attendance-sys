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
import { Search } from "lucide-react";
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

interface EmployeeListProps {
  users: User[];
  userRole: string;
  onRefresh?: () => void; // callback to refresh users from parent
}

export default function EmployeeList({
  users,
  userRole,
  onRefresh,
}: EmployeeListProps) {
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users || []);
  const [filterType, setFilterType] = useState<"all" | "student" | "staff">("all");

  // Update filtered users when users or filter changes
  useEffect(() => {
    let updated = [...users];

    // Filter by type
    if (filterType === "student") {
      updated = updated.filter((u) => u.trackId);
    } else if (filterType === "staff") {
      updated = updated.filter((u) => !u.trackId);
    }

    // Apply search filter
    if (search.trim()) {
      updated = updated.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (user.department?.toLowerCase() || "").includes(search.toLowerCase())
      );
    }

    setFilteredUsers(updated);
  }, [users, search, filterType]);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>User Directory</CardTitle>
            <CardDescription>
              Manage and track user attendance status
            </CardDescription>
          </div>
          {userRole === "admin" && onRefresh && (
            <AddUserForm onUserAdded={onRefresh} />
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Search + Filter */}
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

          {/* Filter dropdown */}
          <Select
            value={filterType}
            onValueChange={(val) => setFilterType(val as "all" | "student" | "staff")}
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
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="p-4 border border-border rounded-lg hover:bg-muted transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                {/* Left side: Name + email */}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:gap-4">
                  {/* Name + status on mobile */}
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      {user.firstName} {user.lastName}
                    </span>
                    <Badge
                      className="sm:hidden"
                      variant={
                        user.status === "checked_in" ? "default" : "secondary"
                      }
                    >
                      {user.status === "checked_in"
                        ? "Checked In"
                        : "Checked Out"}
                    </Badge>
                  </div>

                  {/* Email + role badge */}
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      {user.trackId ? "Student" : "Staff"}
                    </span>
                  </div>
                </div>

                {/* Right side: Status badge for desktop */}
                <div className="hidden sm:flex-shrink-0 sm:flex sm:self-auto">
                  <Badge
                    variant={
                      user.status === "checked_in" ? "default" : "secondary"
                    }
                  >
                    {user.status === "checked_in"
                      ? "Checked In"
                      : "Checked Out"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
