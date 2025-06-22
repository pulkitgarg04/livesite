"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Loader2 } from "lucide-react"

type SiteData = {
  _id: string
  title: string
  html: string
  css: string
  js: string
  description: string
  userId: string
}

const SitePage = () => {
  const { slug: rawSlug } = useParams()
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug
  const [siteData, setSiteData] = useState<SiteData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      fetch(`/api/site?slug=${encodeURIComponent(slug)}&incrementViews=true`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch site data")
          }
          return response.json()
        })
        .then((data) => {
          setSiteData(data)
          setIsLoading(false)

          if (data.title) {
            document.title = data.title
          }

          recordVisit(data._id, data.userId)
        })
        .catch((error) => {
          console.error("Error fetching site data:", error)
          setIsLoading(false)
        })
    }
  }, [slug])

  const recordVisit = async (siteId: string, userId: string) => {
    try {
      const visitorId = localStorage.getItem("visitorId") || generateVisitorId()
      localStorage.setItem("visitorId", visitorId)

      await fetch("/api/visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          siteId,
          userId,
          visitorId,
          referrer: document.referrer || "direct",
          userAgent: navigator.userAgent,
        }),
      })
    } catch (error) {
      console.error("Error recording visit:", error)
    }
  }

  const generateVisitorId = () => {
    return "visitor_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
  }

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Loader2 className="inline h-10 w-10 animate-spin" />
      </div>
    )
  }

  if (!siteData) {
    return <div className="text-center py-10 text-red-500">Site not found!</div>
  }

  return (
    <div className="w-screen h-screen">
      <iframe
        title={siteData.title}
        srcDoc={`<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${siteData.title}</title>
            <style>${siteData.css}</style>
          </head>
          <body>${siteData.html}<script>${siteData.js}</script></body>
        </html>`}
        className="w-full h-full border-none"
      />
    </div>
  )
}

export default SitePage