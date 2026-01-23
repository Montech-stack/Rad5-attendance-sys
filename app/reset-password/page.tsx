"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { apiRequest } from "@/lib/api";
import { Loader2, KeyRound, CheckCircle2 } from "lucide-react";

function ResetPasswordForm() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token"); // Assuming link has ?token=...

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            // Assuming typical endpoint
            await apiRequest("/users/reset-password", {
                method: "POST",
                body: JSON.stringify({ token, password }),
            });
            setSuccess(true);
            setTimeout(() => router.push("/"), 3000); // Redirect to login
        } catch (err: any) {
            setError("Failed to reset password. Link may be expired.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md space-y-6">
            <div className="flex justify-center">
                <div className="relative w-32 h-16">
                    <Image
                        src="/logo.png"
                        alt="RAD5 Tech Hub"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>
            <Card className="border-0 shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle>Set new password</CardTitle>
                    <CardDescription>
                        Create a strong password for your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center animate-in fade-in zoom-in duration-300">
                            <div className="p-3 bg-green-100 rounded-full text-green-600">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-semibold text-lg">Password Reset!</h3>
                                <p className="text-sm text-muted-foreground">Redirecting to login...</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="new-password" className="text-sm font-medium">New Password</label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>

                            {error && <p className="text-sm text-destructive">{error}</p>}

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <KeyRound className="w-4 h-4 mr-2" />}
                                Reset Password
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
            <Suspense fallback={<div className="flex items-center gap-2"><Loader2 className="animate-spin" /> Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </main>
    );
}
