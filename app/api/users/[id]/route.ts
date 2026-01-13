import { type NextRequest, NextResponse } from "next/server"

// DELETE /api/users/:id - Delete a user
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // TODO: Replace with actual database delete
    // const result = await db.query(
    //   'DELETE FROM users WHERE id = $1',
    //   [id]
    // )

    return NextResponse.json({ message: "User deleted successfully", id }, { status: 200 })
  } catch (error) {
    console.error("[v0] Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
