"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { apiRequest } from "@/lib/api"

interface Role {
  id: string
  name: string
}

interface Track {
  id: string
  name: string
}

interface AddUserFormProps {
  onUserAdded?: () => void
}

export default function AddUserForm({ onUserAdded }: AddUserFormProps) {
  const [open, setOpen] = useState(false)

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [roleId, setRoleId] = useState("")
  const [trackId, setTrackId] = useState("")

  const [roles, setRoles] = useState<Role[]>([])
  const [tracks, setTracks] = useState<Track[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const selectedRole = roles.find(r => r.id === roleId)
  const isStudent = selectedRole?.name.toLowerCase() === "student"

  // ======================
  // FETCH ROLES (WRAPPED RESPONSE)
  // ======================
  const fetchRoles = async () => {
    try {
      console.log("📡 Fetching roles...")
      const res = await apiRequest("/roles/roles")

      console.log("✅ Roles fetched:", res.data.data)
      setRoles(res.data.data || [])
    } catch (err: any) {
      console.error("❌ Failed to fetch roles:", err)
      setRoles([])
    }
  }

  // ======================
  // FETCH TRACKS (RAW ARRAY RESPONSE ✅)
  // ======================
    const fetchTracks = async () => {
    try {
        console.log("📡 Fetching tracks...")

        const res = await apiRequest("/tracks/tracks")

        console.log("FULL TRACK RESPONSE:", res)

        // 👉 IMPORTANT FIX — because YOUR API returns a raw array
        const tracksArray = Array.isArray(res) ? res : res.data

        setTracks(tracksArray || [])

        console.log("✅ Tracks set in state:", tracksArray)
    } catch (err: any) {
        console.error("❌ Failed to fetch tracks:", err)
        setTracks([])
    }
    }


  useEffect(() => {
    fetchRoles()
    fetchTracks()
  }, [])

  // ======================
  // CREATE ROLE
  // ======================
  const handleAddRole = async () => {
    const name = prompt("Enter role name")
    if (!name) return

    try {
      console.log("📡 Creating new role:", name)
      const res = await apiRequest("/roles/role", {
        method: "POST",
        body: JSON.stringify({ name }),
      })

      alert(`Role "${res.data.data.name}" created successfully!`)
      await fetchRoles()
    } catch (err: any) {
      console.error("❌ Failed to create role:", err)
      alert(err.message || "Failed to create role")
    }
  }

  // ======================
  // CREATE TRACK
  // ======================
  const handleAddTrack = async () => {
    const name = prompt("Enter track name")
    if (!name) return

    try {
      console.log("📡 Creating new track:", name)

      await apiRequest("/tracks/track", {
        method: "POST",
        body: JSON.stringify({ name }),
      })

      alert(`Track "${name}" created successfully!`)
      await fetchTracks()
    } catch (err: any) {
      console.error("❌ Failed to create track:", err)
      alert(err.message || "Failed to create track")
    }
  }

  // ======================
  // CREATE USER
  // ======================
  const handleAddUser = async () => {
    setLoading(true)
    setError("")

    if (isStudent && !trackId) {
      setError("Please select a track for students")
      setLoading(false)
      return
    }

    const [firstName, ...rest] = fullName.trim().split(" ")
    const lastName = rest.join(" ")

    try {
      await apiRequest("/users/user", {
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          roleId,
          trackId: isStudent ? trackId : undefined,
        }),
      })

      setOpen(false)
      setFullName("")
      setEmail("")
      setPassword("")
      setRoleId("")
      setTrackId("")
      onUserAdded?.()
      alert("User added successfully!")
    } catch (err: any) {
      console.error("❌ Failed to add user:", err)
      setError(err.message || "Failed to add user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">Add User</Button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-lg p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Full name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
          />

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          {/* ROLE SELECT */}
          <div className="flex gap-2">
            <Select value={roleId} onValueChange={setRoleId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map(role => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" onClick={handleAddRole}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* TRACK SELECT (ONLY FOR STUDENTS) */}
          {isStudent && (
            <div className="flex gap-2">
              <Select value={trackId} onValueChange={setTrackId}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select track" />
                </SelectTrigger>
                <SelectContent>
                  {tracks.map(track => (
                    <SelectItem key={track.id} value={track.id}>
                      {track.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" onClick={handleAddTrack}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button onClick={handleAddUser} disabled={loading}>
              {loading ? "Adding..." : "Add User"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
