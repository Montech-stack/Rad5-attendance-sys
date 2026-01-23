"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { CheckCircle2, AlertCircle, Clock, Trophy } from "lucide-react";
import { useMemo } from "react";

interface UserAnalyticsProps {
    user: any;
    attendance?: any[];
}

export default function UserAnalytics({ user, attendance = [] }: UserAnalyticsProps) {

    const stats = useMemo(() => {
        let onTime = 0;
        let late = 0;

        attendance.forEach(record => {
            const s = record.status ? record.status.toLowerCase() : "";
            if (s.includes("late")) {
                late++;
            } else if (s.includes("on-time") || s.includes("checked_in")) {
                onTime++;
            }
        });

        return [
            { name: "On Time", value: onTime, color: "#9333ea", gradient: "from-purple-500 to-blue-600" }, // Purple
            { name: "Late", value: late, color: "#db2777", gradient: "from-pink-500 to-rose-500" },      // Pink/Rose for slight contrast but consistent
        ];
    }, [attendance]);

    const total = stats.reduce((acc, curr) => acc + curr.value, 0);
    const onTimePercentage = total > 0 ? Math.round((stats[0].value / total) * 100) : 0;
    const showChart = total > 0;

    return (
        <Card className="border-none shadow-xl bg-white/70 dark:bg-card/50 backdrop-blur-md overflow-hidden">
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Performance Metrics</CardTitle>
                        <CardDescription>Punctuality breakdown based on {total} Records</CardDescription>
                    </div>
                    <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600 shadow-inner">
                        <Trophy className="w-5 h-5" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center justify-between gap-8 pt-4">

                {/* Chart */}
                <div className="w-full h-[200px] flex-1 relative">
                    {showChart ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={85}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {stats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm italic">
                            No sufficient data yet
                        </div>
                    )}
                    {/* Center Text */}
                    {showChart && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-black text-foreground">{onTimePercentage}%</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Punctuality</span>
                        </div>
                    )}
                </div>

                {/* Legend / Key Stats */}
                <div className="flex-1 w-full grid grid-cols-2 gap-4">
                    <div className="flex flex-col p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border border-purple-100 dark:border-purple-900 group hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 rounded-full bg-purple-500 text-white shadow-purple-200 shadow-md">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wide">On Time</span>
                        </div>
                        <span className="text-3xl font-black text-purple-800 dark:text-purple-300">{stats[0].value}</span>
                        <span className="text-[10px] text-purple-600/70 font-medium mt-1">Check-ins</span>
                    </div>

                    <div className="flex flex-col p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border border-pink-100 dark:border-pink-900 group hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 rounded-full bg-pink-500 text-white shadow-pink-200 shadow-md">
                                <Clock className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold text-pink-700 dark:text-pink-400 uppercase tracking-wide">Late</span>
                        </div>
                        <span className="text-3xl font-black text-pink-800 dark:text-pink-300">{stats[1].value}</span>
                        <span className="text-[10px] text-pink-600/70 font-medium mt-1">Check-ins</span>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
