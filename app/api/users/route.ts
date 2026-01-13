import { type NextRequest, NextResponse } from "next/server"

// Mock database - replace with actual database queries
const mockUsers = [
  {
    id: "1",
    name: "Sarah Williams",
    role: "staff",
    department: "Engineering",
    email: "sarah@rad5.com",
  },
  {
    id: "2",
    name: "Mike Davis",
    role: "staff",
    department: "Sales",
    email: "mike@rad5.com",
  },
  {
    id: "3",
    name: "Emma Johnson",
    role: "admin",
    department: "HR",
    email: "admin@rad5.com",
  },
]

// GET /api/users - Fetch all users
export async function GET() {
  try {
    // TODO: Replace with actual database query
    // const users = await db.query('SELECT * FROM users')
    return NextResponse.json(mockUsers, { status: 200 })
  } catch (error) {
    console.error("[v0] Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, role, department } = body

    // Validate input
    if (!name || !role || !department) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // TODO: Replace with actual database insert
    // const result = await db.query(
    //   'INSERT INTO users (name, role, department, email) VALUES ($1, $2, $3, $4) RETURNING *',
    //   [name, role, department, email]
    // )

    const newUser = {
      id: Date.now().toString(),
      name,
      role,
      department,
      email: `${name.toLowerCase().replace(/\s+/g, "")}@rad5.com`,
    }

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
