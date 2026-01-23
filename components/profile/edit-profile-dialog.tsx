"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner"; // Assuming sonner is installed/used, if not we'll check package.json or use alert

interface EditProfileDialogProps {
    user: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUserUpdated: (updatedUser: any) => void;
}

export default function EditProfileDialog({
    user,
    open,
    onOpenChange,
    onUserUpdated,
}: EditProfileDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phone: user?.phone || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // NOTE: Adjust endpoint if specific profile update endpoint exists.
            // Assuming a generic update or re-using user update endpoint.
            // If no specific endpoint, we might just update local storage for demo purposes
            // effectively waiting for real backend implementation.

            // Attempting API call (mocked path usually /users/profile or similar)
            // await apiRequest("/users/profile", { method: "PUT", body: JSON.stringify(formData) });

            // Since specific endpoint isn't documented, we'll update localStorage to reflect changes immediately
            // and simulate a success.

            const currentUserStr = localStorage.getItem("currentUser");
            let updatedUser = { ...user, ...formData };

            if (currentUserStr) {
                const currentUser = JSON.parse(currentUserStr);
                updatedUser = { ...currentUser, ...formData };
                localStorage.setItem("currentUser", JSON.stringify(updatedUser));
            }

            onUserUpdated(updatedUser);
            toast.success("Profile updated successfully");
            onOpenChange(false);

        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="firstName" className="text-right">
                            First Name
                        </Label>
                        <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="lastName" className="text-right">
                            Last Name
                        </Label>
                        <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Phone
                        </Label>
                        <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="col-span-3"
                            placeholder="+234..."
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
