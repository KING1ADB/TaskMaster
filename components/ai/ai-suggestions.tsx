"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Plus, Clock, AlertTriangle, Target } from "lucide-react"
import { useTasks } from "@/hooks/use-tasks"
import { useAnalytics } from "@/hooks/use-analytics"

interface Suggestion {
  id: string
  type: "task" | "priority" | "schedule" | "break"
  title: string
  description: string
  action?: () => void
  priority?: "low" | "medium" | "high"
  icon: React.ReactNode
}

export function AISuggestions() {
  const { tasks, addTask, editTask, todayTasks, overdueTasks } = useTasks()
  const analytics = useAnalytics()
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  useEffect(() => {
    generateSuggestions()
  }, [tasks, analytics])

  const generateSuggestions = () => {
    const newSuggestions: Suggestion[] = []

    // Overdue task suggestions
    if (overdueTasks.length > 0) {
      newSuggestions.push({
        id: "overdue-priority",
        type: "priority",
        title: "Prioritize Overdue Tasks",
        description: `You have ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? "s" : ""}. Consider tackling these first.`,
        priority: "high",
        icon: <AlertTriangle className="h-4 w-4 text-destructive" />,
      })
    }

    // Break suggestion based on work patterns
    const workingSessions = analytics.last7Days.reduce((sum, day) => sum + day.completed, 0)
    if (workingSessions > 5) {
      newSuggestions.push({
        id: "take-break",
        type: "break",
        title: "Take a Well-Deserved Break",
        description: "You've been productive! Consider taking a short break to recharge.",
        priority: "medium",
        icon: <Clock className="h-4 w-4 text-blue-600" />,
      })
    }

    // Task creation suggestions based on patterns
    const categories = Object.keys(analytics.categoryStats)
    const mostUsedCategory = categories.reduce((a, b) =>
      analytics.categoryStats[a] > analytics.categoryStats[b] ? a : b,
      { name: "None", rate: 0 }
    )

    if (todayTasks.length < 3) {
      newSuggestions.push({
        id: "add-daily-tasks",
        type: "task",
        title: "Plan Your Day",
        description: `Add a few more tasks for today. Consider adding tasks in your most productive category: ${mostUsedCategory}.`,
        priority: "medium",
        icon: <Plus className="h-4 w-4 text-primary" />,
        action: () => {
          // This would trigger the task creation form
        },
      })
    }

    // Priority optimization suggestions
    const urgentTasks = tasks.filter((task) => task.priority === "urgent" && !task.completed)
    const highTasks = tasks.filter((task) => task.priority === "high" && !task.completed)

    if (urgentTasks.length === 0 && highTasks.length > 3) {
      newSuggestions.push({
        id: "reprioritize",
        type: "priority",
        title: "Review Task Priorities",
        description: "You have many high-priority tasks. Consider promoting the most important ones to urgent.",
        priority: "medium",
        icon: <Target className="h-4 w-4 text-accent" />,
      })
    }

    // Productivity pattern suggestions
    if (analytics.completionRate < 60) {
      newSuggestions.push({
        id: "break-down-tasks",
        type: "task",
        title: "Break Down Large Tasks",
        description: "Your completion rate could improve. Try breaking larger tasks into smaller, manageable subtasks.",
        priority: "medium",
        icon: <Lightbulb className="h-4 w-4 text-accent" />,
      })
    }

    // Time-based suggestions
    const currentHour = new Date().getHours()
    if (currentHour >= 9 && currentHour <= 11 && todayTasks.filter((t) => !t.completed).length > 0) {
      newSuggestions.push({
        id: "morning-focus",
        type: "schedule",
        title: "Morning Focus Time",
        description: "It's peak productivity hours! Consider tackling your most challenging tasks now.",
        priority: "high",
        icon: <Clock className="h-4 w-4 text-primary" />,
      })
    }

    setSuggestions(newSuggestions.slice(0, 5)) // Limit to 5 suggestions
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50"
      case "medium":
        return "border-yellow-200 bg-yellow-50"
      default:
        return "border-blue-200 bg-blue-50"
    }
  }

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            AI Suggestions
          </CardTitle>
          <CardDescription>Smart recommendations to boost your productivity</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            You're doing great! Keep up the good work and check back later for personalized suggestions.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-accent" />
          AI Suggestions
        </CardTitle>
        <CardDescription>Smart recommendations based on your productivity patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className={`p-4 rounded-lg border ${getPriorityColor(suggestion.priority)}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  {suggestion.icon}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{suggestion.title}</h4>
                      {suggestion.priority && (
                        <Badge
                          variant={
                            suggestion.priority === "high"
                              ? "destructive"
                              : suggestion.priority === "medium"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {suggestion.priority}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm opacity-90">{suggestion.description}</p>
                  </div>
                </div>
                {suggestion.action && (
                  <Button size="sm" variant="outline" onClick={suggestion.action}>
                    Apply
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
