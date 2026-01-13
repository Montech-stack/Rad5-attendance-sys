"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, LogIn, Eye, EyeOff } from "lucide-react"

const DEMO_USERS = [
  { email: "admin@rad5.com", password: "admin123", name: "Alex Johnson", role: "admin" },
  { email: "staff1@rad5.com", password: "staff123", name: "Sarah Williams", role: "staff" },
  { email: "staff2@rad5.com", password: "staff123", name: "Mike Davis", role: "staff" },
  { email: "student1@rad5.com", password: "student123", name: "John Doe", role: "student" },
]

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simulate authentication delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = DEMO_USERS.find((u) => u.email === email && u.password === password)
    if (user) {
      // Store user session in localStorage for now
      localStorage.setItem("currentUser", JSON.stringify({ email: user.email, name: user.name, role: user.role }))
      router.push(user.role === "admin" ? "/dashboard" : "/profile")
    } else {
      if (!DEMO_USERS.find((u) => u.email === email)) {
        setError("Email not found. Try: admin@rad5.com, staff1@rad5.com, staff2@rad5.com, or student1@rad5.com")
      } else {
        setError("Invalid password. Please check and try again.")
      }
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary p-3 rounded-lg">
              <MapPin className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">RAD5</h1>
          <p className="text-muted-foreground">Attendance System</p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in with your email and password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
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
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/50 rounded text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading} size="lg">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </span>
                )}
              </Button>
            </form>

            {/* Demo Users Info */}
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-3">Demo Users:</p>
              <div className="space-y-2">
                {DEMO_USERS.map((user) => (
                  <button
                    key={user.email}
                    onClick={() => {
                      setEmail(user.email)
                      setPassword(user.password)
                      setError("")
                    }}
                    className="w-full text-left p-2 rounded hover:bg-secondary transition-colors"
                  >
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>This is a demo system. No real data is stored.</p>
        </div>
      </div>
    </main>
  )
}
