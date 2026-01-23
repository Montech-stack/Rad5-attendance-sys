"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { userLogin } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LogIn, Eye, EyeOff, MapPin } from "lucide-react";
import ForgotPasswordDialog from "@/components/auth/forgot-password-dialog";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await userLogin(email, password);

      if (!res.success || !res.data) {
        throw new Error(res.message || "Login failed");
      }

      const { token, user } = res.data;

      if (!token || !user) {
        throw new Error("Invalid login response from server");
      }

      // Save token & user
      localStorage.setItem("token", token);
      localStorage.setItem("currentUser", JSON.stringify(user));

      console.log("Login successful:", user);

      // Determine role
      let role = "unknown";


      // Redirect based on role
      if (role === "admin") router.push("/dashboard");
      else router.push("/profile");

    } catch (err: any) {
      console.error("Login Error:", err);
      // Ensure we set a string error message, not an object
      const errorMessage = err?.message || (typeof err === "string" ? err : "Login failed. Please check your credentials.");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
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
          {/* Logo replaces the text header */}
          <p className="text-muted-foreground">Attendance System</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in with your email and password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="bg-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="bg-input pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-end">
                  <ForgotPasswordDialog />
                </div>
              </div>

              {error && <div className="p-3 bg-destructive/10 border border-destructive/50 rounded text-sm text-destructive">{error}</div>}

              <Button type="submit" className="w-full cursor-pointer" disabled={loading} size="lg">
                {loading ? (
                  <span className="flex items-center gap-2"><span className="animate-spin">⏳</span> Signing in...</span>
                ) : (
                  <span className="flex items-center gap-2"><LogIn className="w-4 h-4" /> Sign In</span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
