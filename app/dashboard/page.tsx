import Link from "next/link"
import { Plus, BarChart3, Settings, Globe, Users, Zap, Shield } from "lucide-react"
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

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-gray-400">Common tasks to help you get started</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto p-4 bg-gray-800 border-gray-700 hover:bg-gray-700"
                    asChild
                  >
                    <Link href="/dashboard/create" className="flex flex-col items-center gap-2">
                      <Plus className="h-6 w-6 text-[#cff245]" />
                      <span className="font-medium">Create Site</span>
                      <span className="text-xs text-gray-400">Deploy a new project</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 bg-gray-800 border-gray-700 hover:bg-gray-700"
                    asChild
                  >
                    <Link href="/dashboard/analytics" className="flex flex-col items-center gap-2">
                      <BarChart3 className="h-6 w-6 text-[#cff245]" />
                      <span className="font-medium">View Analytics</span>
                      <span className="text-xs text-gray-400">Track performance</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto p-4 bg-gray-800 border-gray-700 hover:bg-gray-700"
                    asChild
                  >
                    <Link href="/dashboard/settings" className="flex flex-col items-center gap-2">
                      <Settings className="h-6 w-6 text-[#cff245]" />
                      <span className="font-medium">Settings</span>
                      <span className="text-xs text-gray-400">Manage account</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Your Sites</h2>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Globe className="h-4 w-4" />
                  {stats.totalSites} {stats.totalSites === 1 ? "site" : "sites"}
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
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {sites.map((site) => (
                    <SiteCard key={site._id.toString()} site={site} />
                  ))}
                </div>
              )}
            </div>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Platform Features</CardTitle>
                <CardDescription className="text-gray-400">
                  Everything you need to deploy and manage your sites
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-[#cff245]/10 p-2">
                      <Zap className="h-5 w-5 text-[#cff245]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Instant Deploy</h4>
                      <p className="text-sm text-gray-400">
                        Deploy your sites in seconds with our optimized infrastructure
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-[#cff245]/10 p-2">
                      <Shield className="h-5 w-5 text-[#cff245]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">SSL Security</h4>
                      <p className="text-sm text-gray-400">Automatic SSL certificates for all your deployments</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-[#cff245]/10 p-2">
                      <Users className="h-5 w-5 text-[#cff245]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Team Access</h4>
                      <p className="text-sm text-gray-400">Collaborate with your team on projects</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}