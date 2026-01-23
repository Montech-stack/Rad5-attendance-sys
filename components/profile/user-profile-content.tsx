"use client";

import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";
import ProfileCard from "@/components/profile/profile-card";
import AttendanceOverview from "@/components/profile/attendance-overview";
import QuickCheckIn from "@/components/profile/quick-check-in";
import UserAnalytics from "@/components/profile/user-analytics";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, Trash2, AlertTriangle, ShieldAlert, CalendarIcon, Clock } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserProfileContentProps {
    user: any;
    showCheckIn?: boolean; // if false, we assume it's Admin View
    onDelete?: () => void;
}

export default function UserProfileContent({ user, showCheckIn = true, onDelete }: UserProfileContentProps) {
    const [attendance, setAttendance] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Manual Check-In/Out State
    const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<"check-in" | "check-out">("check-in");
    const [actionDate, setActionDate] = useState("");
    const [actionTime, setActionTime] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, [user?.id]);

    async function fetchHistory() {
        if (!user?.id) return;
        try {
            setLoadingHistory(true);
            const res = await apiRequest(`/attendance/attendance/users/${user.id}`);
            setAttendance(res.data?.data || res.data || []);
        } catch (e) {
            console.error("Failed to fetch user attendance history", e);
        } finally {
            setLoadingHistory(false);
        }
    }

    const handleDeleteUser = async () => {
        if (!user.id) return;
        setIsDeleting(true);
        try {
            // DELETE {{url}}/users/delete/:id
            await apiRequest(`/users/delete/${user.id}`, { method: "DELETE" });
            if (onDelete) onDelete();
        } catch (err) {
            console.error("Failed to delete user", err);
            alert("Failed to delete user. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleManualAction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!actionDate || !actionTime) {
            alert("Please select both date and time.");
            return;
        }
        setActionLoading(true);
        try {
            const endpoint = actionType === "check-in"
                ? "/attendance/manual-checkin"
                : "/attendance/manual-checkout";

            await apiRequest(endpoint, {
                method: "POST",
                body: JSON.stringify({
                    email: user.email,
                    date: actionDate,
                    time: actionTime
                })
            });

            setIsActionDialogOpen(false);
            // Refresh history
            fetchHistory();
            // Reset form
            setActionDate("");
            setActionTime("");
            alert(`Manual ${actionType.replace("-", " ")} recorded successfully.`);
        } catch (err) {
            console.error(`Manual ${actionType} failed`, err);
            alert(`Failed to record ${actionType.replace("-", " ")}.`);
        } finally {
            setActionLoading(false);
        }
    };

    const openActionDialog = (type: "check-in" | "check-out") => {
        const now = new Date();
        setActionType(type);
        setActionDate(now.toISOString().split('T')[0]); // YYYY-MM-DD
        setActionTime(now.toTimeString().slice(0, 5)); // HH:MM
        setIsActionDialogOpen(true);
    };

    const isAdminView = !showCheckIn;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 min-h-full">

            {/* Main Content Column */}
            <div className={`space-y-6 lg:col-span-2 ${showCheckIn ? 'order-1 lg:order-2' : 'order-1 lg:order-2'}`}>
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                    {loadingHistory && <p className="text-sm text-muted-foreground animate-pulse">Syncing data...</p>}
                </div>

                {/* User View: Quick Check In */}
                {showCheckIn && (
                    <>
                        <QuickCheckIn user={user} />
                        {/* Mobile: Profile Card appears here */}
                        <div className="lg:hidden mt-6">
                            <ProfileCard user={user} />
                        </div>
                    </>
                )}

                {/* Admin View: Actions Panel */}
                {isAdminView && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-secondary/20 border-primary/10">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <ShieldAlert className="w-4 h-4 text-primary" /> Admin Controls
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <Button
                                    variant="outline"
                                    className="bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20 w-full justify-start"
                                    onClick={() => openActionDialog("check-in")}
                                >
                                    <LogIn className="w-4 h-4 mr-2" /> Manual Check-In
                                </Button>
                                <Button
                                    variant="outline"
                                    className="bg-amber-500/10 text-amber-600 border-amber-200 hover:bg-amber-500/20 w-full justify-start"
                                    onClick={() => openActionDialog("check-out")}
                                >
                                    <LogOut className="w-4 h-4 mr-2" /> Manual Check-Out
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-destructive/5 border-destructive/20">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium flex items-center gap-2 text-destructive">
                                    <AlertTriangle className="w-4 h-4" /> Danger Zone
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors shadow-sm">
                                            <Trash2 className="w-4 h-4 mr-2" /> Delete User
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete User Account?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete
                                                <strong> {user.firstName} {user.lastName}</strong> and remove their data.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                {isDeleting ? "Deleting..." : "Delete Account"}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <UserAnalytics user={user} attendance={attendance} />

                <AttendanceOverview user={user} attendance={attendance} />

                {/* Manual Check-In/Out Dialog */}
                <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="capitalize">Manual {actionType.replace("-", " ")}</DialogTitle>
                            <DialogDescription>
                                Manually record {actionType.replace("-", " ")} for {user.firstName}.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleManualAction} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="date">Date</Label>
                                <div className="relative">
                                    <Input
                                        id="date"
                                        type="date"
                                        value={actionDate}
                                        onChange={(e) => setActionDate(e.target.value)}
                                        required
                                    />
                                    <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="time">Time</Label>
                                <div className="relative">
                                    <Input
                                        id="time"
                                        type="time"
                                        value={actionTime}
                                        onChange={(e) => setActionTime(e.target.value)}
                                        required
                                    />
                                    <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsActionDialogOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={actionLoading}>
                                    {actionLoading ? "Recording..." : `Record ${actionType === "check-in" ? "Check-In" : "Check-Out"}`}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Profile Side Column (Desktop Only) */}
            <div className={`space-y-6 lg:col-span-1 hidden lg:block ${showCheckIn ? 'order-2 lg:order-1' : 'order-1 lg:order-1'}`}>
                <ProfileCard user={user} />
            </div>

        </div>
    );
}
