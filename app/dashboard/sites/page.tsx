import Link from "next/link"
import { Plus, Globe, Eye, Calendar, MoreHorizontal, ExternalLink, Edit, Trash2 } from "lucide-react"
import { currentUser } from "@clerk/nextjs/server"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getSitesByUserId } from "@/lib/mongodb"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default async function SitesPage() {
  const user = await currentUser()
  const sites = await getSitesByUserId(user?.id || "")

  return (
    <div className="min-h-screen bg-[#0d0e11] text-white">
      <div className="flex">
        <DashboardSidebar />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">All Sites</h1>
                <p className="text-gray-400 mt-1">Manage and monitor all your deployed sites</p>
              </div>
              <Button asChild className="bg-[#cff245] hover:bg-[#b8e03a] text-black font-medium">
                <Link href="/dashboard/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Site
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Sites</p>
                      <p className="text-2xl font-bold text-white">{sites?.length || 0}</p>
                    </div>
                    <Globe className="h-8 w-8 text-[#cff245]" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Active</p>
                      <p className="text-2xl font-bold text-white">
                        {sites?.filter((s) => s.status === "active")?.length || 0}
                      </p>
                    </div>
                    <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Views</p>
                      <p className="text-2xl font-bold text-white">
                        {sites?.reduce((acc, site) => acc + (site.views || 0), 0) || 0}
                      </p>
                    </div>
                    <Eye className="h-8 w-8 text-[#cff245]" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">This Month</p>
                      <p className="text-2xl font-bold text-white">+{Math.floor(Math.random() * 50) + 10}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-[#cff245]" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Your Sites</CardTitle>
                <CardDescription className="text-gray-400">All your deployed sites in one place</CardDescription>
              </CardHeader>
              <CardContent>
                {sites?.length === 0 ? (
                  <div className="text-center py-12">
                    <Globe className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No sites yet</h3>
                    <p className="text-gray-400 mb-6">Create your first site to get started</p>
                    <Button asChild className="bg-[#cff245] hover:bg-[#b8e03a] text-black">
                      <Link href="/dashboard/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Site
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sites?.map((site) => (
                      <div
                        key={site._id.toString()}
                        className="flex items-center justify-between p-4 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#cff245] to-[#b8e03a] rounded-lg flex items-center justify-center">
                            <Globe className="h-6 w-6 text-black" />
                          </div>
                          <div>
                            <h3 className="font-medium text-white">{site.title}</h3>
                            <p className="text-sm text-gray-400">yourlivesite.vercel.app/s/{site.slug}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                                Active
                              </Badge>
                              <span className="text-xs text-gray-500">
                                Updated {new Date(site.updatedAt || site.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" asChild className="text-gray-400 hover:text-black">
                            <Link href={`/s/${site.slug}`} target="_blank">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-black">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                              <DropdownMenuItem asChild className="text-white hover:bg-gray-700">
                                <Link href={`/dashboard/edit/${site._id}`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild className="text-white hover:bg-gray-700">
                                <Link href={`/s/${site.slug}`} target="_blank">
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  View Site
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-700" />
                              <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}