import Link from "next/link"
import { Plus } from "lucide-react"
import { currentUser } from "@clerk/nextjs/server"

import { Button } from "@/components/ui/button"
import { getSitesByUserId } from "@/lib/mongodb"
import { SiteCard } from "@/components/site-card"

export default async function DashboardPage() {
  const user = await currentUser()
  const sites = await getSitesByUserId(user?.id || "")

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Your Sites</h1>
        <Button asChild className="bg-purple-600 hover:bg-purple-700">
          <Link href="/dashboard/create">
            <Plus className="mr-2 h-4 w-4" />
            New Site
          </Link>
        </Button>
      </div>

      {sites.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h2 className="text-2xl font-semibold">No sites yet</h2>
          <p className="mt-2 text-muted-foreground">Create your first site to get started.</p>
          <Button asChild className="mt-6 bg-purple-600 hover:bg-purple-700">
            <Link href="/dashboard/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Site
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <SiteCard key={site._id.toString()} site={site} />
          ))}
        </div>
      )}
    </div>
  )
}