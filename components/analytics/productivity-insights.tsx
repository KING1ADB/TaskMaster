"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAnalytics } from "@/hooks/use-analytics"
import { useTasks } from "@/hooks/use-tasks"
import { Lightbulb, TrendingUp, Target, AlertCircle } from "lucide-react"

export function ProductivityInsights() {
  const analytics = useAnalytics()
  const { todayTasks, overdueTasks } = useTasks()

  const insights = []

  // Generate insights based on data
  if (analytics.completionRate >= 80) {
    insights.push({
      type: "success",
      title: "Excellent Productivity!",
      description: `You have an ${analytics.completionRate}% completion rate. Keep up the great work!`,
      icon: TrendingUp,
    })
  } else if (analytics.completionRate < 50) {
    insights.push({
      type: "warning",
      title: "Room for Improvement",
      description: `Your completion rate is ${analytics.completionRate}%. Consider breaking tasks into smaller chunks.`,
      icon: Target,
    })
  }

  if (analytics.currentStreak >= 7) {
    insights.push({
      type: "success",
      title: "Amazing Streak!",
      description: `You've been consistent for ${analytics.currentStreak} days. You're building great habits!`,
      icon: TrendingUp,
    })
  }

  if (overdueTasks.length > 0) {
    insights.push({
      type: "alert",
      title: "Overdue Tasks Alert",
      description: `You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? "s" : ""}. Consider prioritizing these first.`,
      icon: AlertCircle,
    })
  }

  if (todayTasks.length > 0) {
    const completedToday = todayTasks.filter((task) => task.completed).length
    const todayRate = Math.round((completedToday / todayTasks.length) * 100)
    insights.push({
      type: "info",
      title: "Today's Progress",
      description: `You've completed ${completedToday} of ${todayTasks.length} tasks today (${todayRate}%).`,
      icon: Target,
    })
  }

  // Most productive category
  const topCategory = analytics.categoryCompletion.reduce((prev, current) =>
    prev.rate > current.rate ? prev : current,
    { name: "None", rate: 0 }
  )
  if (topCategory && topCategory.rate > 0) {
    insights.push({
      type: "info",
      title: "Top Performing Category",
      description: `You're most productive in "${topCategory.category}" with ${topCategory.rate}% completion rate.`,
      icon: Lightbulb,
    })
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50 text-green-800"
      case "warning":
        return "border-yellow-200 bg-yellow-50 text-yellow-800"
      case "alert":
        return "border-red-200 bg-red-50 text-red-800"
      default:
        return "border-blue-200 bg-blue-50 text-blue-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-accent" />
          Productivity Insights
        </CardTitle>
        <CardDescription>Personalized recommendations based on your activity</CardDescription>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">Complete more tasks to unlock personalized insights!</p>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon
              return (
                <div key={index} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">{insight.title}</h4>
                      <p className="text-sm opacity-90">{insight.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
