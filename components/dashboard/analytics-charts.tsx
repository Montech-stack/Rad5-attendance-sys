"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { TrendingUp } from "lucide-react";

interface AnalyticsChartsProps {
    attendance: any[];
    users: any[];
    history?: any[];
}

export default function AnalyticsCharts({ attendance, users, history = [] }: AnalyticsChartsProps) {

    // ----------------------------------------
    // 1. Calculate Weekly Trends (Area Chart)
    // ----------------------------------------
    const weeklyActivity = (() => {
        const days = [];
        const today = new Date();

        for (let i = 4; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

            const records = history.filter((r: any) =>
                r.date === dateStr || r.createdAt?.startsWith(dateStr)
            );

            const present = records.length;
            const late = records.filter((r: any) => r.status?.toLowerCase().includes("late")).length;
            const absent = Math.max(0, users.length - present);

            days.push({ day: dayName, present, late, absent });
        }
        return days;
    })();

    // ----------------------------------------
    // 2. Calculate Today's Status (Pie Chart)
    // ----------------------------------------
    const totalCheckIns = attendance.length;
    const lateCheckIns = attendance.filter((a) => a.status?.toLowerCase().includes("late")).length;
    const onTimeCheckIns = Math.max(0, totalCheckIns - lateCheckIns);
    const absentCount = Math.max(0, users.length - totalCheckIns);

    // Colorful Palette
    const attendanceStatus = [
        { name: "On Time", value: onTimeCheckIns, color: "#9333ea", gradient: "from-purple-500 to-purple-600" }, // Purple
        { name: "Late", value: lateCheckIns, color: "#db2777", gradient: "from-pink-500 to-rose-500" },          // Pink
        { name: "Absent", value: absentCount, color: "#f59e0b", gradient: "from-amber-400 to-amber-500" }         // Amber
    ];

    const hasData = attendanceStatus.some(s => s.value > 0);

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out fill-mode-both">

            {/* Weekly Trends - Area Chart */}
            <Card className="col-span-4 border-none shadow-xl bg-white/70 dark:bg-card/50 backdrop-blur-md overflow-hidden group">
                <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-lg">Weekly Trends</CardTitle>
                            <CardDescription>Daily activity over the last 5 days</CardDescription>
                        </div>
                        <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={weeklyActivity}>
                            <defs>
                                <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                            <Tooltip
                                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                                cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="present"
                                stroke="#7c3aed"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorPresent)"
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Attendance Status - Colorful Pie Chart */}
            <Card className="col-span-3 border-none shadow-xl bg-white/70 dark:bg-card/50 backdrop-blur-md overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500" />
                <CardHeader>
                    <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-lg">Today's Distribution</CardTitle>
                    <CardDescription>Real-time check-in status</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full relative">
                        {hasData ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={attendanceStatus}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                        animationDuration={1500}
                                        animationBegin={200}
                                    >
                                        {attendanceStatus.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                                <p>No activity yet today</p>
                            </div>
                        )}

                        {/* Centered Total */}
                        {hasData && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-4xl font-black text-foreground">{totalCheckIns}</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">Checked In</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4">
                        {attendanceStatus.map((status) => (
                            <div key={status.name} className="flex flex-col items-center p-2 rounded-lg bg-secondary/30">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{status.name}</span>
                                </div>
                                <span className="text-lg font-bold" style={{ color: status.color }}>{status.value}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
