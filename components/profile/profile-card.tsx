"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserProfile {
  email: string;
  name: string;
  role: string;
  trackId?: string | null;
  profileImage?: string;
}

export default function ProfileCard({ user }: { user: UserProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    profileImage: user.profileImage || "",
  });

  const handleSave = async () => {
    setIsEditing(false);
    console.log("Saved data:", formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, profileImage: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your account information</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Avatar */}
        <div className="flex justify-center">
          {formData.profileImage ? (
            <img
              src={formData.profileImage}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold">
              {getInitial(formData.name)}
            </div>
          )}
        </div>

        {!isEditing ? (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium bg-muted">Full Name</td>
                  <td className="p-3">{formData.name}</td>
                </tr>

                <tr className="border-b">
                  <td className="p-3 font-medium bg-muted">Email</td>
                  <td className="p-3">{user.email}</td>
                </tr>

                <tr className="border-b">
                  <td className="p-3 font-medium bg-muted">Role</td>
                  <td className="p-3 capitalize">{user.role}</td>
                </tr>

                {user.role === "Student" && user.trackId && (
                  <tr>
                    <td className="p-3 font-medium bg-muted">Track</td>
                    <td className="p-3">{user.trackId}</td>
                  </tr>
                )}
              </tbody>
            </table>

            <Button className="w-full mt-4 cursor-pointer"  onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground">Full Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2">
              <Button className="flex-1 cursor-pointer" onClick={handleSave}>
                Save Changes
              </Button>
              <Button
                variant="outline"
                className="flex-1 cursor-pointer"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
