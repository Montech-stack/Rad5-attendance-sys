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
import { Button } from "@/components/ui/button";
import { Search, Loader2, Filter } from "lucide-react";
import AddUserForm from "./add-user-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import UserProfileContent from "@/components/profile/user-profile-content";
import { apiRequest } from "@/lib/api";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  trackId?: string | null;
  trackName?: string; // Add this purely for UI passing
  department?: string;
  status?: "checked_in" | "checked_out" | "late" | "absent";
  phone?: string;
  role?: any;
}

interface Track {
  id: string;
  name: string;
}

interface EmployeeListProps {
  users: User[];
  userRole: string;
  onRefresh?: () => void;
  initialFilter?: "all" | "student" | "staff" | "checked_in" | "late" | "absent";
}

export default function EmployeeList({
  users,
  userRole,
  onRefresh,
  initialFilter = "all",
}: EmployeeListProps) {
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users || []);
  const [filterType, setFilterType] = useState<string>(initialFilter);

  // Track Filtering
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

  // Sheet State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Sync internal filter when prop changes
  useEffect(() => {
    if (initialFilter) {
      setFilterType(initialFilter);
      // Reset track selection when top-level filter changes from props
      if (initialFilter !== 'student') setSelectedTrack(null);
    }
  }, [initialFilter]);

  // Fetch Tracks
  useEffect(() => {
    async function fetchTracks() {
      try {
        const res = await apiRequest("/tracks/tracks");
        const data = Array.isArray(res) ? res : (res.data || []);
        setTracks(data);
      } catch (err) {
        console.error("Failed to fetch tracks", err);
      }
    }
    fetchTracks();
  }, []);

  // Filter Logic
  useEffect(() => {
    let updated = [...users];

    // 1. Primary Filter
    if (filterType === "student") {
      updated = updated.filter((u) => u.trackId);
      // 2. Secondary Filter (Specific Track) - Only applies if viewing students
      if (selectedTrack) {
        updated = updated.filter((u) => u.trackId === selectedTrack);
      }
    } else if (filterType === "staff") {
      updated = updated.filter((u) => !u.trackId);
    } else if (filterType === "checked_in") {
      updated = updated.filter(u => u.status === "checked_in");
    } else if (filterType === "late") {
      updated = updated.filter(u => u.status === "late");
    } else if (filterType === "absent") {
      updated = updated.filter(u => u.status === "absent" || !u.status);
    }

    // 3. Search Filter
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
  }, [users, search, filterType, selectedTrack]);

  const getTrackName = (id?: string | null) => {
    if (!id) return "Staff";
    const found = tracks.find(t => t.id === id);
    return found ? found.name : "Student";
  };

  // Helper to count students in a track (from the full users list, not just filtered)
  const getTrackCount = (trackId: string) => {
    return users.filter(u => u.trackId === trackId).length;
  };

  const handleUserClick = (user: User) => {
    // Inject the track name into the user object for the profile card
    const trackName = getTrackName(user.trackId);
    const safeUser = {
      ...user,
      trackName, // Populate this so ProfileCard can use it
      name: `${user.firstName} ${user.lastName}`,
    };
    setSelectedUser(safeUser);
    setIsSheetOpen(true);
  };

  return (
    <>
      <Card className="border-0 shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>User Directory</CardTitle>
              <CardDescription>
                Manage students and staff members
              </CardDescription>
            </div>
            {userRole === "admin" && onRefresh && (
              <AddUserForm onUserAdded={onRefresh} />
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* SEARCH + MAIN FILTER */}
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                className="pl-10 bg-white dark:bg-card"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Select
              value={filterType}
              onValueChange={(val) => {
                setFilterType(val);
                if (val !== 'student') setSelectedTrack(null);
              }}
            >
              <SelectTrigger className="w-full sm:w-48 mt-2 sm:mt-0 bg-white dark:bg-card">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="checked_in">Checked In</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* TRACK FILTER ROW (Only for Students) */}
          {filterType === "student" && tracks.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Button
                variant={selectedTrack === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTrack(null)}
                className={`rounded-full h-8 text-xs ${selectedTrack === null ? "bg-primary text-primary-foreground" : "bg-white dark:bg-card"}`}
              >
                All Tracks ({users.filter(u => u.trackId).length})
              </Button>
              {tracks.map(track => {
                const count = getTrackCount(track.id);
                return (
                  <Button
                    key={track.id}
                    variant={selectedTrack === track.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTrack(selectedTrack === track.id ? null : track.id)}
                    className={`rounded-full h-8 text-xs ${selectedTrack === track.id ? "bg-purple-600 text-white hover:bg-purple-700" : "bg-white dark:bg-card border-purple-200 text-purple-700"}`}
                  >
                    {track.name} <span className="ml-1 opacity-70">({count})</span>
                  </Button>
                );
              })}
            </div>
          )}

          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <div className="bg-secondary/50 p-4 rounded-full">
                <Search className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground">No users found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-1">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserClick(user)}
                  className="group relative overflow-hidden p-3 sm:p-4 border border-border/60 rounded-xl hover:bg-white/80 dark:hover:bg-card/80 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center gap-4 bg-white/40 dark:bg-card/40 backdrop-blur-sm"
                >
                  {/* Avatar / Initials */}
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center border group-hover:scale-105 transition-transform ${user.trackId ? "bg-purple-100 text-purple-600 border-purple-200" : "bg-blue-100 text-blue-600 border-blue-200"}`}>
                    <span className="font-bold text-sm">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 grid gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-foreground truncate">
                        {user.firstName} {user.lastName}
                      </span>
                      {user.trackId ? (
                        <Badge variant="outline" className="bg-purple-500/10 text-purple-700 border-purple-200 text-[10px] px-2 py-0 h-5 font-medium">
                          {getTrackName(user.trackId)}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-200 text-[10px] px-2 py-0 h-5 font-medium">
                          Staff
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="truncate opacity-80">{user.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end sm:border-0 border-t border-border/50 pt-3 sm:pt-0">
                    <Badge
                      className={`h-7 px-3 capitalize shadow-none ${user.status === "checked_in" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" :
                        user.status === "late" ? "bg-amber-100 text-amber-700 hover:bg-amber-200" :
                          "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      variant="secondary"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${user.status === "checked_in" ? "bg-emerald-500" :
                        user.status === "late" ? "bg-amber-500" :
                          "bg-slate-400"
                        }`} />
                      {user.status ? user.status.replace("_", " ") : "Absent"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-[85vw] md:max-w-[75vw] lg:max-w-[1000px] w-full overflow-y-auto p-0 sm:p-0">
          <div className="p-4 sm:p-6 md:p-8">
            <SheetHeader className="mb-6 md:mb-8 text-left">
              <SheetTitle className="text-2xl md:text-3xl font-bold">User Profile</SheetTitle>
            </SheetHeader>
            {selectedUser && (
              <UserProfileContent
                user={selectedUser}
                showCheckIn={false}
                onDelete={() => {
                  setIsSheetOpen(false);
                  if (onRefresh) onRefresh();
                }}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
