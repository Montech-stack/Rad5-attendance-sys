"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";
import { Loader2, Mail } from "lucide-react";

export default function ForgotPasswordDialog() {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            // POST {{url}}/users/forgot-password
            await apiRequest("/users/forgot-password", {
                method: "POST",
                body: JSON.stringify({ email }),
            });
            setSuccess(true);
        } catch (err: any) {
            setError("Failed to send reset link. Please check the email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="link" className="px-0 font-normal text-xs text-muted-foreground hover:text-primary">
                    Forgot password?
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                        Enter your email address and we'll send you a link to reset your password.
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center animate-in fade-in zoom-in duration-300">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                            <Mail className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold text-lg">Check your email</h3>
                            <p className="text-sm text-muted-foreground">We have sent a password reset link to <span className="font-medium text-foreground">{email}</span></p>
                        </div>
                        <Button onClick={() => setOpen(false)} variant="outline" className="mt-2">
                            Close
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                        <div className="space-y-2">
                            <label htmlFor="reset-email" className="text-sm font-medium">Email Address</label>
                            <Input
                                id="reset-email"
                                type="email"
                                placeholder="Ex. prince.bassey@test.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="text-sm text-destructive">{error}</p>}

                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={loading || !email}>
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Send Reset Link
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
