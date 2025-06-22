import Link from "next/link"
import { Plus, Globe, TrendingUp } from "lucide-react"
import { currentUser } from "@clerk/nextjs/server"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSitesByUserId } from "@/lib/mongodb"
import { SiteCard } from "@/components/site-card"
import { SiteCardSkeleton } from "@/components/site-card-skeleton"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { StatsCards } from "@/components/stats-cards"

export default async function DashboardPage() {
  const user = await currentUser()
  const sitesPromise = getSitesByUserId(user?.id || "")

  const isLoading = !sitesPromise
  const sites = await sitesPromise

  const stats = {
    totalSites: sites?.length || 0,
    totalViews: sites?.reduce((acc, site) => acc + (site.views || 0), 0) || 0,
    activeDeployments: sites?.filter((site) => site.status === "active")?.length || 0,
  }

  return (
    <div className="min-h-screen bg-[#0d0e11] text-white">
      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-gray-400 mt-1">
                  Welcome back, {user?.firstName || "User"}! Manage your sites and deployments.
                </p>
              </div>
              <Button asChild className="bg-[#cff245] hover:bg-[#b8e03a] text-black font-medium">
                <Link href="/dashboard/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Site
                </Link>
              </Button>
            </div>

            <StatsCards stats={stats} />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Your Sites</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Globe className="h-4 w-4" />
                    {stats.totalSites} {stats.totalSites === 1 ? "site" : "sites"}
                  </div>
                  {sites.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-gray-700 bg-gray-600 text-gray-300 hover:text-gray-300 hover:bg-gray-700"
                    >
                      <Link href="/dashboard/sites">View All</Link>
                    </Button>
                  )}
                </div>
              </div>

              {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SiteCardSkeleton key={i} />
                  ))}
                </div>
              ) : sites.length === 0 ? (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="rounded-full bg-gray-800 p-4 mb-4">
                      <Globe className="h-8 w-8 text-[#cff245]" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Sites Yet</h3>
                    <p className="text-gray-400 mb-6 max-w-md">
                      Get started by creating your first site. Deploy HTML, CSS, and JavaScript projects instantly.
                    </p>
                    <Button asChild className="bg-[#cff245] hover:bg-[#b8e03a] text-black font-medium">
                      <Link href="/dashboard/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First Site
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {sites.slice(0, 6).map((site) => (
                      <SiteCard key={site._id.toString()} site={site} />
                    ))}
                  </div>
                  {sites.length > 6 && (
                    <div className="text-center">
                      <Button variant="outline" asChild className="border-gray-700 text-gray-300 hover:bg-gray-800">
                        <Link href="/dashboard/sites">View All {sites.length} Sites</Link>
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            {sites.length > 0 && (
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[#cff245]" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-gray-400">Latest updates from your sites</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sites.slice(0, 3).map((site) => (
                      <div
                        key={site._id.toString()}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#cff245] to-[#b8e03a] rounded-lg flex items-center justify-center">
                            <Globe className="h-5 w-5 text-black" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{site.title}</p>
                            <p className="text-sm text-gray-400">
                              {site.views || 0} views • Updated{" "}
                              {new Date(site.updatedAt || site.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild className="text-[#cff245] hover:bg-[#cff245]/10">
                          <Link href={`/s/${site.slug}`} target="_blank">
                            Visit
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}