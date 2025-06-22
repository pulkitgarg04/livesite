import { NextResponse } from "next/server"
import { getSiteById, getSitesByUserId, deleteSite } from "@/lib/mongodb"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const id = url.searchParams.get("id")
  const userId = url.searchParams.get("userId")

  try {
    if (id) {
      const site = await getSiteById(id)

      if (!site) {
        return NextResponse.json({ error: "Site not found" }, { status: 404 })
      }

      return NextResponse.json(site, { status: 200 })
    }

    if (userId) {
      const sites = await getSitesByUserId(userId)
      return NextResponse.json(sites, { status: 200 })
    }

    return NextResponse.json({ error: "Either 'id' or 'userId' parameter is required" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching sites:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Site ID is required" }, { status: 400 })
    }

    const site = await getSiteById(id)
    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 })
    }

    if (site.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized to delete this site" }, { status: 403 })
    }

    await deleteSite(id)

    return NextResponse.json({ message: "Site deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting site:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}