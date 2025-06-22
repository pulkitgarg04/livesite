import { NextResponse } from "next/server"
import { getAnalyticsByUserId, getAnalyticsBySiteId } from "@/lib/mongodb"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const siteId = url.searchParams.get("siteId")
    const startDate = url.searchParams.get("startDate")
    const endDate = url.searchParams.get("endDate")

    let start: Date | undefined
    let end: Date | undefined

    if (startDate) start = new Date(startDate)
    if (endDate) end = new Date(endDate)

    let analytics

    if (siteId) {
      analytics = await getAnalyticsBySiteId(siteId, start, end)
    } else {
      analytics = await getAnalyticsByUserId(userId, start, end)
    }

    return NextResponse.json(analytics, { status: 200 })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}