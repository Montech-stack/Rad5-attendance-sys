"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
  name: string
  role: "staff" | "student" | "admin"
  department: string
}

interface AddUserFormProps {
  onSubmit: (data: User) => void
  onCancel: () => void
}

export default function AddUserForm({ onSubmit, onCancel }: AddUserFormProps) {
  const [formData, setFormData] = useState<User>({
    name: "",
    role: "staff",
    department: "Engineering",
  })

  const handleChange = (field: keyof User, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Full Name</label>
        <Input
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="John Doe"
          className="bg-input"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Role</label>
        <Select
          value={formData.role}
          onValueChange={(value) => handleChange("role", value as "staff" | "student" | "admin")}
        >
          <SelectTrigger className="bg-input">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Department</label>
        <Select value={formData.department} onValueChange={(value) => handleChange("department", value)}>
          <SelectTrigger className="bg-input">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Sales">Sales</SelectItem>
            <SelectItem value="HR">HR</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
          Add User
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
          Cancel
        </Button>
      </div>
    </form>
  )
}
