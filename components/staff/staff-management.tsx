"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Trash2, Users } from "lucide-react"
import AddUserForm from "./add-staff-form"

interface User {
  id: string
  name: string
  role: "staff" | "student" | "admin"
  department: string
}

const INITIAL_USERS: User[] = [
  {
    id: "1",
    name: "Sarah Williams",
    role: "staff",
    department: "Engineering",
  },
  {
    id: "2",
    name: "Mike Davis",
    role: "staff",
    department: "Sales",
  },
  {
    id: "3",
    name: "Emma Johnson",
    role: "admin",
    department: "HR",
  },
  {
    id: "4",
    name: "James Wilson",
    role: "student",
    department: "Engineering",
  },
  {
    id: "5",
    name: "Lisa Chen",
    role: "student",
    department: "Marketing",
  },
]

export default function StaffManagement() {
  const [users, setUsers] = useState(INITIAL_USERS)
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null)

  const handleAddUser = async (newUser: Omit<User, "id">) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      })
      if (!response.ok) throw new Error("Failed to add user")
      const createdUser = await response.json()
      setUsers([...users, createdUser])
      setOpenAddDialog(false)
    } catch (error) {
      console.error("Error adding user:", error)
      // Fallback to local state if API fails
      setUsers([...users, { ...newUser, id: Date.now().toString() }])
      setOpenAddDialog(false)
    }
  }

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete user")
      setUsers(users.filter((u) => u.id !== id))
      setDeleteConfirmId(null)
      setDeleteConfirmUser(null)
    } catch (error) {
      console.error("Error deleting user:", error)
      // Fallback to local state if API fails
      setUsers(users.filter((u) => u.id !== id))
      setDeleteConfirmId(null)
      setDeleteConfirmUser(null)
    }
  }

  const usersByRole = {
    admin: users.filter((u) => u.role === "admin"),
    staff: users.filter((u) => u.role === "staff"),
    student: users.filter((u) => u.role === "student"),
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm bg-card">
        <CardHeader className="pb-3 sm:pb-6">
          <div className="space-y-4 sm:space-y-0">
            <div>
              <CardTitle className="text-xl sm:text-2xl">User Management</CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1">Manage system users and their roles</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-sm sm:text-base">
                    <Plus className="w-4 h-4" />
                    <span>Add User</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-md mx-auto rounded-lg">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>Fill in the form to add a new user to the system</DialogDescription>
                  </DialogHeader>
                  <AddUserForm onSubmit={handleAddUser} onCancel={() => setOpenAddDialog(false)} />
                </DialogContent>
              </Dialog>

              <Dialog open={openRemoveDialog} onOpenChange={setOpenRemoveDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto gap-2 bg-transparent border-destructive text-destructive hover:bg-destructive/10 text-sm sm:text-base"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove User</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-md mx-auto max-h-[80vh] overflow-y-auto rounded-lg">
                  <DialogHeader>
                    <DialogTitle>Remove User</DialogTitle>
                    <DialogDescription>Select a user to delete</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {Object.entries(usersByRole).map(([role, roleUsers]) =>
                      roleUsers.length > 0 ? (
                        <div key={role} className="space-y-2">
                          <h4 className="text-sm font-semibold text-foreground capitalize">{role}s</h4>
                          <div className="space-y-2">
                            {roleUsers.map((user) => (
                              <div
                                key={user.id}
                                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted transition-colors"
                              >
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-foreground text-sm truncate">{user.name}</p>
                                  <p className="text-xs text-muted-foreground truncate">{user.department}</p>
                                </div>
                                <AlertDialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setDeleteConfirmId(user.id)
                                        setDeleteConfirmUser(user)
                                      }}
                                      className="ml-2 text-destructive hover:bg-destructive/10 flex-shrink-0"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <AlertDialogContent className="w-full max-w-sm mx-auto rounded-lg">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete User</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete {deleteConfirmUser?.name}? This action cannot be
                                        undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="flex flex-col-reverse sm:flex-row gap-3">
                                      <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </div>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null,
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-0">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {Object.entries(usersByRole).map(([role, roleUsers]) => (
              <Card key={role} className="border bg-gradient-to-br from-muted/50 to-muted/30">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex flex-col items-center text-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <p className="text-xs text-muted-foreground capitalize">{role}s</p>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">{roleUsers.length}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
