"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAnalytics } from "@/hooks/use-analytics"
import { CheckCircle2, Clock, AlertTriangle, Target, TrendingUp, Calendar } from "lucide-react"

export function AnalyticsOverview() {
  const analytics = useAnalytics()

  const stats = [
    {
      title: "Total Tasks",
      value: analytics.totalTasks,
      description: "All time tasks created",
      icon: Target,
      color: "text-primary",
    },
    {
      title: "Completed",
      value: analytics.completedTasks,
      description: `${analytics.completionRate}% completion rate`,
      icon: CheckCircle2,
      color: "text-green-600",
    },
    {
      title: "In Progress",
      value: analytics.pendingTasks,
      description: "Active tasks remaining",
      icon: Clock,
      color: "text-blue-600",
    },
    {
      title: "Overdue",
      value: analytics.overdueTasks,
      description: "Need immediate attention",
      icon: AlertTriangle,
      color: "text-destructive",
    },
    {
      title: "This Week",
      value: analytics.thisWeekTasks,
      description: `${analytics.weeklyCompletion} completed`,
      icon: Calendar,
      color: "text-accent",
    },
    {
      title: "Current Streak",
      value: analytics.currentStreak,
      description: "Days of consistent progress",
      icon: TrendingUp,
      color: "text-primary",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
