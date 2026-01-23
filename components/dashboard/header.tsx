"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MapPin, LogOut, Menu, UserCog } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getUserRoleLabel } from "@/lib/user-helpers";
import EditProfileDialog from "@/components/profile/edit-profile-dialog";

interface DashboardHeaderProps {
  user: {
    name: string;
    role: string | { name: string };
    firstName?: string;
    lastName?: string;
    [key: string]: any;
  };
}

export default function DashboardHeader({ user: initialUser }: DashboardHeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [user, setUser] = useState(initialUser);
  const menuRef = useRef<HTMLDivElement>(null);

  // Helper to ensure we are always rendering a clean role string
  const displayRole = getUserRoleLabel(user);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/");
  };

  const onUserUpdated = (updatedUser: any) => {
    // Re-construct the user object to match the simplified prop structure if needed, 
    // or just pass the full object if we trust it.
    // Ideally, we'd refetch from source, but for now we update local state.
    setUser(updatedUser);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-6 flex items-center">
              <Image
                src="/logo.png"
                alt="RAD5 Tech Hub"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs text-muted-foreground font-medium tracking-wide">Attendance System</p>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                {(user.firstName && user.firstName !== "undefined") ? user.firstName : (user.name && user.name !== "undefined undefined" ? user.name : "Admin")}
              </p>
              <p className="text-xs text-muted-foreground font-medium bg-secondary/50 px-2 py-0.5 rounded-full inline-block">
                {displayRole}
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditProfileOpen(true)}
              title="Edit Profile"
              className="text-muted-foreground hover:text-primary"
            >
              <UserCog className="w-5 h-5" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 bg-transparent cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          <button
            className="md:hidden p-2 rounded-md border border-border hover:bg-accent"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div
            ref={menuRef}
            className="md:hidden fixed top-[70px] left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-sm bg-card border border-border rounded-lg shadow-xl p-4 space-y-3 animate-in fade-in slide-in-from-top-5"
          >
            <div className="text-center pb-3 border-b border-border">
              <p className="text-sm font-semibold text-foreground">
                {(user.firstName && user.firstName !== "undefined") ? user.firstName : (user.name && user.name !== "undefined undefined" ? user.name : "Admin")}
              </p>
              <p className="text-xs text-muted-foreground">{displayRole}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditProfileOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full gap-2 justify-start"
            >
              <UserCog className="w-4 h-4" />
              Edit Profile
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full gap-2 justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        )}
      </header>

      <EditProfileDialog
        user={user}
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
        onUserUpdated={onUserUpdated}
      />
    </>
  );
}
