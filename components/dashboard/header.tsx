"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MapPin, LogOut, Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface DashboardHeaderProps {
  user: {
    name: string;
    // We allow string or object here to prevent the 'React Child' crash
    role: string | { name: string }; 
  };
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Helper to ensure we are always rendering a string
  const displayRole = typeof user.role === "object" ? user.role.name : user.role;

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/");
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
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <MapPin className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">RAD5</h1>
            <p className="text-xs text-muted-foreground">Attendance System</p>
          </div>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            {/* FIXED: Use displayRole instead of user.role */}
            <p className="text-xs text-muted-foreground capitalize">{displayRole}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2 bg-transparent cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <button
          className="md:hidden p-2 rounded-md border border-border"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="w-6 h-6 text-foreground" />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          className="md:hidden fixed top-[70px] left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-sm bg-card border border-border rounded-lg shadow-lg p-4 space-y-3"
        >
          <div className="text-center pb-3 border-b border-border">
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            {/* FIXED: Use displayRole instead of user.role */}
            <p className="text-xs text-muted-foreground capitalize">{displayRole}</p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full gap-2 bg-transparent cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      )}
    </header>
  );
}