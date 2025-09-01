"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useAnalytics } from "@/hooks/use-analytics"
import { TrendingUp, Target, Calendar, Award } from "lucide-react"

export function ProductivityCharts() {
  const analytics = useAnalytics()

  const priorityData = [
    { name: "Urgent", value: analytics.priorityStats.urgent, color: "#ef4444" },
    { name: "High", value: analytics.priorityStats.high, color: "#f97316" },
    { name: "Medium", value: analytics.priorityStats.medium, color: "#eab308" },
    { name: "Low", value: analytics.priorityStats.low, color: "#22c55e" },
  ]

  const categoryData = Object.entries(analytics.categoryStats).map(([category, count]) => ({
    category,
    count,
  }))

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Completion Trend */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            7-Day Completion Trend
          </CardTitle>
          <CardDescription>Your task completion over the last week</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              completed: {
                label: "Completed Tasks",
                color: "hsl(var(--primary))",
              },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.last7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Priority Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />
            Priority Distribution
          </CardTitle>
          <CardDescription>Tasks by priority level</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              urgent: { label: "Urgent", color: "#ef4444" },
              high: { label: "High", color: "#f97316" },
              medium: { label: "Medium", color: "#eab308" },
              low: { label: "Low", color: "#22c55e" },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="flex flex-wrap gap-2 mt-4">
            {priorityData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-muted-foreground">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Performance */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Category Performance
          </CardTitle>
          <CardDescription>Completion rates by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.categoryCompletion.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{category.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {category.completed}/{category.total}
                    </span>
                    <Badge
                      variant={category.rate >= 80 ? "default" : category.rate >= 50 ? "secondary" : "destructive"}
                    >
                      {category.rate}%
                    </Badge>
                  </div>
                </div>
                <Progress value={category.rate} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Productivity Streaks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-accent" />
            Productivity Streaks
          </CardTitle>
          <CardDescription>Your consistency tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{analytics.currentStreak}</div>
            <p className="text-sm text-muted-foreground">Current Streak (days)</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{analytics.maxStreak}</div>
            <p className="text-sm text-muted-foreground">Best Streak</p>
          </div>
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">This Week</span>
              <Badge variant="outline">{analytics.weeklyCompletionRate}%</Badge>
            </div>
            <Progress value={analytics.weeklyCompletionRate} className="h-2 mb-4" />
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">This Month</span>
              <Badge variant="outline">{analytics.monthlyCompletionRate}%</Badge>
            </div>
            <Progress value={analytics.monthlyCompletionRate} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
