"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Phone, Building } from "lucide-react"

interface UserProfile {
  email: string
  name: string
  role: string
}

export default function ProfileCard({ user }: { user: UserProfile }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    phone: "+1 234 567 8900",
    department: "Engineering",
  })

  const handleSave = () => {
    // In a real app, this would save to the database
    setIsEditing(false)
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">Profile</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Your account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="w-16 sm:w-20 h-16 sm:h-20 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <Mail className="w-8 sm:w-10 h-8 sm:h-10 text-primary-foreground" />
          </div>
        </div>

        {/* Profile Info */}
        {!isEditing ? (
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Full Name</p>
              <p className="text-sm sm:text-base font-medium text-foreground break-words">{formData.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2 break-all">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>{user.email}</span>
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                {formData.phone}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Department</p>
              <p className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2">
                <Building className="w-4 h-4 flex-shrink-0" />
                {formData.department}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="text-xs sm:text-sm font-medium text-foreground capitalize bg-primary/10 px-2 py-1 rounded w-fit">
                {user.role}
              </p>
            </div>
            <Button className="w-full text-sm sm:text-base" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="text-xs text-muted-foreground">Full Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Department</label>
              <Input
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="mt-1 text-sm"
              />
            </div>
            <div className="flex gap-2 flex-col sm:flex-row">
              <Button className="flex-1 text-sm" onClick={handleSave}>
                Save Changes
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent text-sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
