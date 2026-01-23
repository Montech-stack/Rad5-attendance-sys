export interface UserPartial {
    firstName?: string;
    lastName?: string;
    role?: string | { name: string };
    [key: string]: any;
}

export function getUserFullName(user: UserPartial | null | undefined): string {
    if (!user) return "Guest";
    return `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
}

export function getUserRoleLabel(user: UserPartial | null | undefined): string {
    if (!user) return "Guest";

    // Extract role string safely
    let roleStr = "";
    if (typeof user?.role === "string") {
        roleStr = user.role;
    } else if (typeof user?.role === "object" && user.role?.name) {
        roleStr = user.role.name;
    }

    // Normalization
    const lower = roleStr.toLowerCase();

    if (lower === "admin" || lower === "administrator") {
        return "System Admin";
    }
    if (lower === "student") {
        return "Student";
    }
    if (lower === "staff") {
        return "Staff";
    }

    // Fallback: capitalized original string
    return roleStr.charAt(0).toUpperCase() + roleStr.slice(1);
}
