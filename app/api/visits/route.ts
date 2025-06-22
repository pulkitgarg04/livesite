import { NextResponse } from "next/server"
import { recordSiteVisit, getSiteVisits } from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { siteId, userId, visitorId, referrer, userAgent } = body

    if (!siteId || !userId) {
      return NextResponse.json({ error: "siteId and userId are required" }, { status: 400 })
    }

    // Get IP address and other request info
    const forwarded = request.headers.get("x-forwarded-for")
    const ipAddress = forwarded ? forwarded.split(",")[0] : "unknown"

    // Simple device detection
    const device = userAgent?.includes("Mobile") ? "mobile" : userAgent?.includes("Tablet") ? "tablet" : "desktop"

    const visitData = {
      siteId,
      userId,
      visitorId,
      ipAddress,
      userAgent,
      referrer,
      device,
    }

    const visit = await recordSiteVisit(visitData)

    return NextResponse.json(visit, { status: 201 })
  } catch (error) {
    console.error("Error recording visit:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const siteId = url.searchParams.get("siteId")
    const startDate = url.searchParams.get("startDate")
    const endDate = url.searchParams.get("endDate")

    console.log("Fetching visits for siteId:", siteId)

    if (!siteId) {
      return NextResponse.json({ error: "siteId parameter is required" }, { status: 400 })
    }

    let start: Date | undefined
    let end: Date | undefined

    if (startDate) start = new Date(startDate)
    if (endDate) end = new Date(endDate)

    const visits = await getSiteVisits(siteId, start, end)
    console.log(`Found ${visits.length} visits for site ${siteId}`)

    return NextResponse.json(visits, { status: 200 })
  } catch (error) {
    console.error("Error fetching visits:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
