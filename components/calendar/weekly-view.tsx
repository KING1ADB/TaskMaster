"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isToday } from "date-fns"
import { useTasks } from "@/hooks/use-tasks"
import { cn } from "@/lib/utils"
import type { Task } from "@/types/task"

export function WeeklyView() {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const { tasks } = useTasks()

  const weekStart = startOfWeek(currentWeek)
  const weekEnd = endOfWeek(currentWeek)
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const tasksByDate = useMemo(() => {
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
  }, [tasks])

  const getTasksForDate = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd")
    return tasksByDate[dateKey] || []
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeek(direction === "prev" ? subWeeks(currentWeek, 1) : addWeeks(currentWeek, 1))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Week of {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateWeek("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentWeek(new Date())}>
              This Week
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateWeek("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((date) => {
            const dayTasks = getTasksForDate(date)
            const isCurrentDay = isToday(date)

            return (
              <div key={date.toISOString()} className="space-y-2">
                {/* Day Header */}
                <div
                  className={cn(
                    "text-center p-2 rounded-lg",
                    isCurrentDay ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  <div className="text-sm font-medium">{format(date, "EEE")}</div>
                  <div className="text-lg font-bold">{format(date, "d")}</div>
                </div>

                {/* Tasks for the day */}
                <div className="space-y-2 min-h-[200px]">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        "p-2 rounded-lg text-xs border cursor-pointer transition-all hover:shadow-sm",
                        task.completed ? "opacity-50 line-through bg-muted" : "bg-card",
                      )}
                      style={{
                        borderLeftColor: getPriorityColor(task.priority).replace("bg-", "#"),
                        borderLeftWidth: "3px",
                      }}
                    >
                      <div className="font-medium truncate mb-1">{task.title}</div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {task.category}
                        </Badge>
                        <div className={cn("w-2 h-2 rounded-full", getPriorityColor(task.priority))} />
                      </div>
                      {task.dueDate && (
                        <div className="text-xs text-muted-foreground mt-1">{format(task.dueDate, "h:mm a")}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
