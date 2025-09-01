"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus, CalendarIcon } from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns"
import { useTasks } from "@/hooks/use-tasks"
import { cn } from "@/lib/utils"
import type { Task } from "@/types/task"

interface CalendarViewProps {
  onDateSelect?: (date: Date) => void
  onTaskClick?: (task: Task) => void
}

export function CalendarView({ onDateSelect, onTaskClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const { tasks } = useTasks()

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Group tasks by date
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

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    onDateSelect?.(date)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(direction === "prev" ? subMonths(currentDate, 1) : addMonths(currentDate, 1))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              {format(currentDate, "MMMM yyyy")}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date) => {
              const dayTasks = getTasksForDate(date)
              const isSelected = selectedDate && isSameDay(date, selectedDate)
              const isCurrentMonth = isSameMonth(date, currentDate)

              return (
                <div
                  key={date.toISOString()}
                  className={cn(
                    "min-h-[100px] p-2 border rounded-lg cursor-pointer transition-colors",
                    isCurrentMonth ? "bg-background" : "bg-muted/50",
                    isSelected && "ring-2 ring-primary",
                    isToday(date) && "bg-primary/10 border-primary",
                    "hover:bg-accent/50",
                  )}
                  onClick={() => handleDateClick(date)}
                >
                  <div
                    className={cn(
                      "text-sm font-medium mb-1",
                      isToday(date) ? "text-primary" : isCurrentMonth ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {format(date, "d")}
                  </div>

                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className={cn(
                          "text-xs p-1 rounded truncate cursor-pointer transition-opacity",
                          task.completed ? "opacity-50 line-through" : "",
                          "hover:opacity-80",
                        )}
                        style={{ backgroundColor: `${getPriorityColor(task.priority)}20` }}
                        onClick={(e) => {
                          e.stopPropagation()
                          onTaskClick?.(task)
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <div className={cn("w-2 h-2 rounded-full", getPriorityColor(task.priority))} />
                          <span className="truncate">{task.title}</span>
                        </div>
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-xs text-muted-foreground">+{dayTasks.length - 3} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Tasks for {format(selectedDate, "MMMM d, yyyy")}</span>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getTasksForDate(selectedDate).length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No tasks scheduled for this date</p>
            ) : (
              <div className="space-y-3">
                {getTasksForDate(selectedDate).map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors",
                      task.completed ? "opacity-60 bg-muted/50" : "hover:bg-accent/50",
                    )}
                    onClick={() => onTaskClick?.(task)}
                  >
                    <div className={cn("w-3 h-3 rounded-full", getPriorityColor(task.priority))} />
                    <div className="flex-1">
                      <h4 className={cn("font-medium", task.completed && "line-through")}>{task.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {task.category} • {task.priority} priority
                      </p>
                    </div>
                    <Badge variant={task.completed ? "secondary" : "outline"}>
                      {task.completed ? "Completed" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
