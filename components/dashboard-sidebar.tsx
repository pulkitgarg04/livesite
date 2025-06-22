"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  Plus,
  CircleDollarSign,
  ChevronsLeftRight,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";
import UserButtonSkeleton from "@/components/user-button-skeleton";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Sites", href: "/dashboard/sites", icon: Globe },
  { name: "Create Site", href: "/dashboard/create", icon: Plus },
  { name: "Billing", href: "#", icon: CircleDollarSign },
  { name: "Help", href: "#", icon: Info },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { isLoaded, user } = useUser();

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 h-screen sticky top-0 relative">
      {" "}
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <ChevronsLeftRight className="text-[#cff245] h-6 w-6" />
            <span className="text-xl font-bold text-white">LiveSite</span>
          </Link>
        </div>

        <nav className="px-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#cff245]/10 text-[#cff245]"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              </div>
            );
          })}
        </nav>

        {!isLoaded ? (
          <UserButtonSkeleton />
        ) : (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
            <div className="flex items-center gap-3">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.emailAddresses[0]?.emailAddress}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
