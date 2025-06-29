import { NextResponse } from "next/server"
import { getSiteBySlug, incrementSiteViews } from "@/lib/mongodb"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const slug = url.searchParams.get("slug")
  const incrementViews = url.searchParams.get("incrementViews") === "true"

  if (!slug) {
    return NextResponse.json({ error: "Slug parameter is required" }, { status: 400 })
  }

  try {
    const site = await getSiteBySlug(slug)

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 })
    }

    if (incrementViews) {
      await incrementSiteViews(site._id.toString())
      site.views = (site.views || 0) + 1
    }

    return NextResponse.json(site, { status: 200 })
  } catch (error) {
    console.error("Error fetching site:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}