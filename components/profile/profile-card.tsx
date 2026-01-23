"use client";

import { Mail, Phone, Briefcase, User, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getUserRoleLabel, getUserFullName } from "@/lib/user-helpers";

interface ProfileCardProps {
  user: {
    firstName?: string;
    lastName?: string;
    email: string;
    role: string | { name: string };
    phone?: string;
    department?: string;
    trackId?: string | null;
    location?: string;
    trackName?: string;
    [key: string]: any;
  };
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const roleLabel = getUserRoleLabel(user);

  // Dynamic gradient based on role or just a nice default
  const isStudent = user.trackId;
  const headerGradient = "from-purple-600 via-fuchsia-600 to-indigo-600";

  return (
    <div className="group relative overflow-hidden rounded-3xl border-0 bg-card shadow-lg ring-1 ring-black/5 transition-all hover:shadow-xl hover:ring-black/10">

      {/* Vibrant Header Banner */}
      <div className={`h-32 w-full bg-gradient-to-r ${headerGradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30 mix-blend-overlay" />
        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-10 left-10 h-20 w-20 rounded-full bg-white/20 blur-2xl" />
      </div>

      <div className="px-8 pb-8">

        {/* Floating Avatar */}
        <div className="relative -mt-16 mb-6 flex justify-between items-end">
          <div className="h-32 w-32 rounded-3xl bg-card p-1.5 shadow-xl ring-4 ring-card/50 rotate-3 transition-transform group-hover:rotate-0 duration-300">
            <div className={`h-full w-full rounded-2xl bg-gradient-to-br ${headerGradient} bg-opacity-10 flex items-center justify-center text-4xl font-bold text-white shadow-inner`}>
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 mb-2">
            <Badge className={`px-4 py-1.5 text-sm font-medium border-0 shadow-lg ${isStudent ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>
              {roleLabel}
            </Badge>
            {user.status === 'checked_in' && (
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </div>
        </div>

        {/* User Identity */}
        <div className="space-y-1 mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            {getUserFullName(user)}
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary/50">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span className="font-medium">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary/50">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium">{user.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Meta Grid */}
        <div className="mt-6 grid grid-cols-1 gap-3">
          {/* Track ID / Staff ID */}
          <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-secondary/50 to-secondary/30 border border-border/50 group/item hover:border-primary/20 transition-colors">
            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover/item:opacity-20 transition-opacity ${isStudent ? 'text-purple-600' : 'text-fuchsia-600'}`}>
              <User className="w-8 h-8" />
            </div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{isStudent ? 'Track' : 'Staff ID'}</span>
            <p className="font-mono font-semibold text-sm mt-0.5 truncate text-foreground tracking-tight">{isStudent ? (user.trackName || user.trackId) : "STAFF-01"}</p>
          </div>

          {/* Location */}
          <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-secondary/50 to-secondary/30 border border-border/50 group/item hover:border-primary/20 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${isStudent ? 'bg-purple-100 text-purple-600' : 'bg-fuchsia-100 text-fuchsia-600'}`}>
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold block">Assigned Location</span>
                <p className="font-medium text-sm text-foreground">Rad5 Tech Hub, Aba</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
