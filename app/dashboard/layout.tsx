import type React from "react"
import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { Globe, LayoutDashboard, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-purple-500" />
            <span className="text-xl font-bold">LiveSite</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/dashboard/create">
                <Plus className="mr-2 h-4 w-4" />
                New Site
              </Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </nav>
        </div>
      </header>
      <main className="flex-1 bg-slate-50">{children}</main>
    </div>
  )
}