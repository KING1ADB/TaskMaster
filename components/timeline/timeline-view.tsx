"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Calendar, ArrowRight } from "lucide-react"
import { format, isToday, isPast, isFuture, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"
import { useTasks } from "@/hooks/use-tasks"
import { cn } from "@/lib/utils"
import type { Task } from "@/types/task"

type TimelineFilter = "all" | "week" | "month" | "overdue" | "upcoming"

export function TimelineView() {
  const [filter, setFilter] = useState<TimelineFilter>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const { tasks } = useTasks()

  const filteredTasks = useMemo(() => {
    let filtered = tasks.filter((task) => task.dueDate)

    // Apply time filter
    const now = new Date()
    switch (filter) {
      case "week":
        const weekStart = startOfWeek(now)
        const weekEnd = endOfWeek(now)
        filtered = filtered.filter((task) => task.dueDate && task.dueDate >= weekStart && task.dueDate <= weekEnd)
        break
      case "month":
        const monthStart = startOfMonth(now)
        const monthEnd = endOfMonth(now)
        filtered = filtered.filter((task) => task.dueDate && task.dueDate >= monthStart && task.dueDate <= monthEnd)
        break
      case "overdue":
        filtered = filtered.filter((task) => task.dueDate && isPast(task.dueDate) && !task.completed)
        break
      case "upcoming":
        filtered = filtered.filter((task) => task.dueDate && isFuture(task.dueDate) && !task.completed)
        break
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((task) => task.category === selectedCategory)
    }

    // Sort by due date
    return filtered.sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0
      return a.dueDate.getTime() - b.dueDate.getTime()
    })
  }, [tasks, filter, selectedCategory])

  const categories = useMemo(() => {
    const cats = Array.from(new Set(tasks.map((task) => task.category)))
    return cats
  }, [tasks])

  const getTaskStatus = (task: Task) => {
    if (task.completed) return "completed"
    if (task.dueDate && isPast(task.dueDate)) return "overdue"
    if (task.dueDate && isToday(task.dueDate)) return "today"
    return "upcoming"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100 border-green-200"
      case "overdue":
        return "text-red-600 bg-red-100 border-red-200"
      case "today":
        return "text-blue-600 bg-blue-100 border-blue-200"
      case "upcoming":
        return "text-gray-600 bg-gray-100 border-gray-200"
      default:
        return "text-gray-600 bg-gray-100 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-l-red-500"
      case "high":
        return "border-l-orange-500"
      case "medium":
        return "border-l-yellow-500"
      case "low":
        return "border-l-green-500"
      default:
        return "border-l-gray-500"
    }
  }

  const groupTasksByDate = (tasks: Task[]) => {
    const grouped: Record<string, Task[]> = {}

    tasks.forEach((task) => {
      if (task.dueDate) {
        const dateKey = format(task.dueDate, "yyyy-MM-dd")
        if (!grouped[dateKey]) {
          grouped[dateKey] = []
        }
        grouped[dateKey].push(task)
      }
    })

    return grouped
  }

  const groupedTasks = groupTasksByDate(filteredTasks)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Timeline View
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={(value: TimelineFilter) => setFilter(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedTasks).length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tasks found for the selected filters</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedTasks).map(([dateKey, dateTasks]) => {
                const date = new Date(dateKey)
                const isDateToday = isToday(date)
                const isDatePast = isPast(date) && !isDateToday

                return (
                  <div key={dateKey} className="relative">
                    {/* Date Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={cn(
                          "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
                          isDateToday
                            ? "bg-primary text-primary-foreground"
                            : isDatePast
                              ? "bg-muted text-muted-foreground"
                              : "bg-accent text-accent-foreground",
                        )}
                      >
                        <Calendar className="h-4 w-4" />
                        {format(date, "EEEE, MMMM d, yyyy")}
                        {isDateToday && " (Today)"}
                      </div>
                      <div className="flex-1 h-px bg-border" />
                    </div>

                    {/* Tasks for this date */}
                    <div className="space-y-3 ml-6">
                      {dateTasks.map((task, index) => {
                        const status = getTaskStatus(task)

                        return (
                          <div key={task.id} className="relative">
                            {/* Timeline connector */}
                            <div className="absolute -left-6 top-0 bottom-0 w-px bg-border" />
                            <div
                              className={cn(
                                "absolute -left-7 top-3 w-2 h-2 rounded-full border-2 bg-background",
                                status === "completed"
                                  ? "border-green-500"
                                  : status === "overdue"
                                    ? "border-red-500"
                                    : status === "today"
                                      ? "border-blue-500"
                                      : "border-gray-400",
                              )}
                            />

                            {/* Task Card */}
                            <div
                              className={cn(
                                "border-l-4 bg-card border rounded-lg p-4 transition-all hover:shadow-md",
                                getPriorityColor(task.priority),
                                task.completed && "opacity-60",
                              )}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className={cn("font-medium", task.completed && "line-through")}>
                                      {task.title}
                                    </h4>
                                    <Badge variant="outline" className="text-xs">
                                      {task.priority}
                                    </Badge>
                                    <Badge variant="secondary" className="text-xs">
                                      {task.category}
                                    </Badge>
                                  </div>

                                  {task.description && (
                                    <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                                  )}

                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {format(task.dueDate!, "h:mm a")}
                                    </span>
                                    {task.tags && task.tags.length > 0 && (
                                      <div className="flex gap-1">
                                        {task.tags.slice(0, 3).map((tag) => (
                                          <Badge key={tag} variant="outline" className="text-xs">
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                  <Badge className={cn("text-xs", getStatusColor(status))}>
                                    {status === "completed"
                                      ? "Completed"
                                      : status === "overdue"
                                        ? "Overdue"
                                        : status === "today"
                                          ? "Due Today"
                                          : "Upcoming"}
                                  </Badge>

                                  {task.parentId && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <ArrowRight className="h-3 w-3" />
                                      Subtask
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
