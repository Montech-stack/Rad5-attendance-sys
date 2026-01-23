"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/dashboard/header";
import UserProfileContent from "@/components/profile/user-profile-content";

interface User {
  id: string; // Added ID
  email: string;
  firstName: string;
  lastName: string;
  role: { name: string } | string;
  trackId?: string | null;
  [key: string]: any;
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
      setUser(parsedUser);
    } catch (err) {
      console.error("❌ Failed to parse user from localStorage:", err);
      router.push("/");
    }
  }, [router]);

  if (!user) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  // Construct a user object that satisfies DashboardHeader (needs 'name')
  // and UserProfileContent (needs 'firstName', 'lastName', etc)
  const userForHeader = {
    ...user,
    name: `${user.firstName} ${user.lastName}`,
  };

  return (
    <main className="min-h-screen bg-gray-50/50 dark:bg-background pb-12 relative">
      {/* Decorative Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-100/40 via-transparent to-blue-100/40 dark:from-purple-900/10 dark:to-blue-900/10" />

      <DashboardHeader user={userForHeader} />

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <UserProfileContent user={user} />
      </div>
    </main>
  );
}