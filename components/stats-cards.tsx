import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Eye, Zap, TrendingUp } from "lucide-react"

interface StatsCardsProps {
  stats: {
    totalSites: number
    totalViews: number
    activeDeployments: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Sites",
      value: stats.totalSites.toString(),
      icon: Globe,
      description: "Active deployments",
      trend: "+12% from last month",
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      description: "Across all sites",
      trend: "+25% from last month",
    },
    {
      title: "Active Deployments",
      value: stats.activeDeployments.toString(),
      icon: Zap,
      description: "Currently live",
      trend: "100% uptime",
    },
    {
      title: "Performance",
      value: "99.9%",
      icon: TrendingUp,
      description: "Average uptime",
      trend: "Excellent",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <Card key={card.title} className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-[#cff245]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{card.value}</div>
            <p className="text-xs text-gray-400 mt-1">{card.description}</p>
            <p className="text-xs text-[#cff245] mt-1">{card.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}