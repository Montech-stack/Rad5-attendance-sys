"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/dashboard/header";
import ProfileCard from "@/components/profile/profile-card";
import AttendanceOverview from "@/components/profile/attendance-overview";
import QuickCheckIn from "@/components/profile/quick-check-in";

interface User {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  trackId?: string | null;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) {
      router.push("/");
      return;
    }

    try {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
      router.push("/");
    }
  }, [router]);

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader user={{ ...user, name: fullName }} />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

          {/* PROFILE CARD — TOP on mobile, RIGHT on desktop */}
          <div className="order-1 lg:order-2 lg:col-span-1">
            <ProfileCard
              user={{
                ...user,
                name: fullName,
                trackId: user.trackId ?? null,
              }}
            />
          </div>

          {/* MAIN CONTENT — BELOW on mobile, LEFT on desktop */}
          <div className="order-2 lg:order-1 lg:col-span-2 space-y-4 sm:space-y-6">
            <QuickCheckIn user={{ ...user, name: fullName }} />
            <AttendanceOverview user={{ ...user, name: fullName }} />
          </div>

        </div>
      </div>
    </main>
  );
}
