"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserProfile {
  email: string;
  name: string;
  role: string;
  profileImage?: string; // optional profile image URL
}

export default function ProfileCard({ user }: { user: UserProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    profileImage: user.profileImage || "", // default empty
  });

  const handleSave = async () => {
    // TODO: Call backend endpoint to update name & profileImage
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
    reader.readAsDataURL(file); // convert to base64 for preview
  };

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <Card className="w-full">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">Profile</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Your account information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Profile Avatar */}
        <div className="flex justify-center">
          {formData.profileImage ? (
            <img
              src={formData.profileImage}
              alt="Profile"
              className="w-16 sm:w-20 h-16 sm:h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold">
              {getInitial(formData.name)}
            </div>
          )}
        </div>

        {!isEditing ? (
          <div className="space-y-3 sm:space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Full Name</p>
              <p className="text-sm sm:text-base font-medium text-foreground">{formData.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-xs sm:text-sm font-medium text-foreground">{user.email}</p>
            </div>
            <div>
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
            {/* Name Input */}
            <div>
              <label className="text-xs text-muted-foreground">Full Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 text-sm"
              />
            </div>

            {/* Profile Image Input */}
            <div>
              <label className="text-xs text-muted-foreground">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 text-sm"
              />
            </div>

            <div className="flex gap-2 flex-col sm:flex-row">
              <Button className="flex-1 text-sm" onClick={handleSave}>Save Changes</Button>
              <Button variant="outline" className="flex-1 bg-transparent text-sm" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
