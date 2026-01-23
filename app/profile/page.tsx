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
  role: { name: string } | string; // Updated to handle both
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
      const parsedUser = JSON.parse(storedUser);
      
      // DEBUG LOGS to prevent future headache
      console.log("🛠️ Parsed User:", parsedUser);
      console.log("🛠️ Role Type:", typeof parsedUser.role);

      setUser(parsedUser);
    } catch (err) {
      console.error("❌ Failed to parse user from localStorage:", err);
      router.push("/");
    }
  }, [router]);

  if (!user) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  // 1. Extract the role name safely (prevents the Object error)
  const roleName = typeof user.role === 'object' ? user.role.name : user.role;
  
  // 2. Format the full name
  const fullName = `${user.firstName} ${user.lastName}`;

  // 3. Create a clean user object for children components
  const cleanUser = {
    ...user,
    name: fullName,
    role: roleName // Now it's a string, not an object
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Passing cleanUser ensures children receive strings, not objects */}
      <DashboardHeader user={cleanUser} />

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          
          <div className="order-1 lg:order-2 lg:col-span-1">
            <ProfileCard user={cleanUser} />
          </div>

          <div className="order-2 lg:order-1 lg:col-span-2 space-y-4 sm:space-y-6">
            <QuickCheckIn user={cleanUser} />
            <AttendanceOverview user={cleanUser} />
          </div>

        </div>
      </div>
    </main>
  );
}