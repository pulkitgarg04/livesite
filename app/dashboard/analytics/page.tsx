"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Users, Globe, Eye, Clock } from "lucide-react"
import { useUser } from "@clerk/nextjs"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

interface Site {
  _id: string
  title: string
  slug: string
  views: number
  createdAt: string
  updatedAt: string
}

interface Visit {
  _id: string
  siteId: string
  visitorId: string
  device: string
  referrer: string
  country: string
  visitedAt: string
  sessionDuration: number
}

interface AnalyticsData {
  totalViews: number
  totalSites: number
  uniqueVisitors: number
  avgSessionDuration: string
  topSites: Array<{
    name: string
    slug: string
    views: number
    percentage: number
  }>
  deviceData: Array<{
    type: string
    count: number
    percentage: number
  }>
  referrerData: Array<{
    source: string
    count: number
    percentage: number
  }>
  recentVisits: Visit[]
}

export default function AnalyticsPage() {
  const { user } = useUser()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user?.id) return

      try {
        setLoading(true)
        setError(null)

        // Fetch user's sites
        const sitesResponse = await fetch(`/api/sites?userId=${user.id}`)
        if (!sitesResponse.ok) {
          throw new Error("Failed to fetch sites")
        }
        const sites: Site[] = await sitesResponse.json()

        // Fetch all visits for the user (instead of per site)
        let allVisits: Visit[] = []

        if (sites.length > 0) {
          // Try to fetch visits for each site individually
          for (const site of sites) {
            try {
              const visitsResponse = await fetch(`/api/visits?siteId=${site._id}`)
              if (visitsResponse.ok) {
                const siteVisits = await visitsResponse.json()
                allVisits = [...allVisits, ...siteVisits]
              }
            } catch (error) {
              console.warn(`Failed to fetch visits for site ${site._id}:`, error)
            }
          }
        }

        console.log("Sites:", sites)
        console.log("All visits:", allVisits)

        // Calculate analytics
        const totalViews = sites.reduce((sum, site) => sum + (site.views || 0), 0)
        const totalSites = sites.length
        const uniqueVisitors = new Set(allVisits.map((visit) => visit.visitorId)).size

        // Calculate average session duration
        const validSessions = allVisits.filter((visit) => visit.sessionDuration && visit.sessionDuration > 0)
        const totalSessionTime = validSessions.reduce((sum, visit) => sum + (visit.sessionDuration || 0), 0)
        const avgSessionSeconds = validSessions.length > 0 ? totalSessionTime / validSessions.length : 0
        const avgSessionDuration = formatDuration(avgSessionSeconds)

        // Top sites
        const topSites = sites
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 5)
          .map((site) => ({
            name: site.title,
            slug: site.slug,
            views: site.views || 0,
            percentage: totalViews > 0 ? Math.round(((site.views || 0) / totalViews) * 100) : 0,
          }))

        // Device analytics
        const deviceCounts = allVisits.reduce(
          (acc, visit) => {
            const device = visit.device || "unknown"
            acc[device] = (acc[device] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        )

        const deviceData = Object.entries(deviceCounts).map(([type, count]) => ({
          type: type.charAt(0).toUpperCase() + type.slice(1),
          count,
          percentage: allVisits.length > 0 ? Math.round((count / allVisits.length) * 100) : 0,
        }))

        // Referrer analytics
        const referrerCounts = allVisits.reduce(
          (acc, visit) => {
            const referrer = visit.referrer === "direct" || !visit.referrer ? "Direct" : getDomain(visit.referrer)
            acc[referrer] = (acc[referrer] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        )

        const referrerData = Object.entries(referrerCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([source, count]) => ({
            source,
            count,
            percentage: allVisits.length > 0 ? Math.round((count / allVisits.length) * 100) : 0,
          }))

        // Recent visits (last 10)
        const recentVisits = allVisits
          .sort((a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime())
          .slice(0, 10)

        console.log("Analytics data:", {
          totalViews,
          totalSites,
          uniqueVisitors,
          avgSessionDuration,
          topSites,
          deviceData,
          referrerData,
          recentVisits: recentVisits.length,
        })

        setAnalyticsData({
          totalViews,
          totalSites,
          uniqueVisitors,
          avgSessionDuration,
          topSites,
          deviceData,
          referrerData,
          recentVisits,
        })
      } catch (err) {
        console.error("Error fetching analytics:", err)
        setError("Failed to load analytics data")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [user?.id])

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
    return `${minutes}m ${remainingSeconds}s`
  }

  const getDomain = (url: string): string => {
    try {
      return new URL(url).hostname.replace("www.", "")
    } catch {
      return "Unknown"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0e11] text-white">
        <div className="flex">
          <DashboardSidebar />
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="animate-pulse space-y-8">
                <div className="h-8 bg-gray-800 rounded w-1/4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-32 bg-gray-800 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d0e11] text-white">
        <div className="flex">
          <DashboardSidebar />
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4">Analytics</h1>
              <p className="text-red-400">{error}</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-[#0d0e11] text-white">
        <div className="flex">
          <DashboardSidebar />
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto text-center">
              <h1 className="text-3xl font-bold mb-4">Analytics</h1>
              <p className="text-gray-400">No analytics data available</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0d0e11] text-white">
      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">Analytics</h1>
              <p className="text-gray-400 mt-1">Real-time insights from your sites</p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Views</CardTitle>
                  <Eye className="h-4 w-4 text-[#cff245]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{analyticsData.totalViews.toLocaleString()}</div>
                  <p className="text-xs text-[#cff245] mt-1">Across {analyticsData.totalSites} sites</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Unique Visitors</CardTitle>
                  <Users className="h-4 w-4 text-[#cff245]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{analyticsData.uniqueVisitors.toLocaleString()}</div>
                  <p className="text-xs text-[#cff245] mt-1">Tracked visitors</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Avg. Session</CardTitle>
                  <Clock className="h-4 w-4 text-[#cff245]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{analyticsData.avgSessionDuration}</div>
                  <p className="text-xs text-[#cff245] mt-1">Average time on site</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Sites</CardTitle>
                  <Globe className="h-4 w-4 text-[#cff245]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{analyticsData.totalSites}</div>
                  <p className="text-xs text-[#cff245] mt-1">Active deployments</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Top Performing Sites</CardTitle>
                  <CardDescription className="text-gray-400">Sites with the most traffic</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.topSites.length === 0 ? (
                      <div className="text-center py-8">
                        <Globe className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-400">No sites to analyze yet</p>
                      </div>
                    ) : (
                      analyticsData.topSites.map((site, index) => (
                        <div key={site.slug} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#cff245]/10 rounded-lg flex items-center justify-center">
                              <span className="text-sm font-medium text-[#cff245]">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium text-white">{site.name}</p>
                              <p className="text-xs text-gray-400">/{site.slug}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-white">{site.views.toLocaleString()}</p>
                            <p className="text-xs text-[#cff245]">{site.percentage}% of total</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-gray-400">Latest site visits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.recentVisits.length === 0 ? (
                      <div className="text-center py-8">
                        <TrendingUp className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-400">No recent visits</p>
                      </div>
                    ) : (
                      analyticsData.recentVisits.map((visit) => (
                        <div key={visit._id} className="flex items-center justify-between text-sm">
                          <div>
                            <p className="text-white">New visit</p>
                            <p className="text-gray-400">
                              {visit.device} • {visit.referrer || "Direct"}
                            </p>
                          </div>
                          <p className="text-gray-500">{new Date(visit.visitedAt).toLocaleTimeString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Device Types</CardTitle>
                  <CardDescription className="text-gray-400">Visitor device breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.deviceData.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">No device data available</p>
                    ) : (
                      analyticsData.deviceData.map((device) => (
                        <div key={device.type}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-400">{device.type}</span>
                            <span className="text-white">
                              {device.count} ({device.percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2">
                            <div
                              className="bg-[#cff245] h-2 rounded-full"
                              style={{ width: `${device.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Top Referrers</CardTitle>
                  <CardDescription className="text-gray-400">Where visitors come from</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analyticsData.referrerData.length === 0 ? (
                      <p className="text-gray-400 text-center py-4">No referrer data available</p>
                    ) : (
                      analyticsData.referrerData.map((referrer) => (
                        <div key={referrer.source} className="flex justify-between items-center">
                          <span className="text-gray-400">{referrer.source}</span>
                          <span className="text-white">
                            {referrer.count} ({referrer.percentage}%)
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}