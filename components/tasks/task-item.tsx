"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, MoreVertical, Edit, Trash2, Plus } from "lucide-react"
import { format, isToday, isPast } from "date-fns"
import { cn } from "@/lib/utils"
import type { Task } from "@/types/task"

interface TaskItemProps {
  task: Task
  onToggle: (taskId: string, completed: boolean) => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onAddSubtask?: (parentId: string) => void
  level?: number
}

export function TaskItem({ task, onToggle, onEdit, onDelete, onAddSubtask, level = 0 }: TaskItemProps) {
  const [showSubtasks, setShowSubtasks] = useState(true)

  const priorityColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    urgent: "bg-red-100 text-red-800 border-red-200",
  }

  const priorityDotColors = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
    urgent: "bg-red-500",
  }

  const isOverdue = task.dueDate && isPast(task.dueDate) && !task.completed
  const isDueToday = task.dueDate && isToday(task.dueDate)

  return (
    <div className={cn("space-y-2", level > 0 && "ml-6 border-l-2 border-muted pl-4")}>
      <Card
        className={cn(
          "transition-all duration-200 hover:shadow-md",
          task.completed && "opacity-60",
          isOverdue && "border-destructive/50 bg-destructive/5",
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) => onToggle(task.id, checked as boolean)}
              className="mt-1"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className={cn("font-medium text-sm", task.completed && "line-through text-muted-foreground")}>
                    {task.title}
                  </h3>

                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                  )}

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      <div className={cn("w-2 h-2 rounded-full", priorityDotColors[task.priority])} />
                      <Badge variant="outline" className={cn("text-xs", priorityColors[task.priority])}>
                        {task.priority}
                      </Badge>
                    </div>

                    <Badge variant="secondary" className="text-xs">
                      {task.category}
                    </Badge>

                    {task.dueDate && (
                      <div
                        className={cn(
                          "flex items-center gap-1 text-xs",
                          isOverdue ? "text-destructive" : isDueToday ? "text-accent" : "text-muted-foreground",
                        )}
                      >
                        <Calendar className="w-3 h-3" />
                        {format(task.dueDate, "MMM d")}
                        {isOverdue && " (Overdue)"}
                        {isDueToday && " (Today)"}
                      </div>
                    )}

                    {task.tags && task.tags.length > 0 && (
                      <div className="flex gap-1">
                        {task.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {task.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{task.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(task)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    {onAddSubtask && (
                      <DropdownMenuItem onClick={() => onAddSubtask(task.id)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Subtask
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => onDelete(task.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {task.subtasks && task.subtasks.length > 0 && (
            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {showSubtasks ? "Hide" : "Show"} {task.subtasks.length} subtask{task.subtasks.length !== 1 ? "s" : ""}
              </Button>

              {showSubtasks && (
                <div className="mt-2 space-y-2">
                  {task.subtasks.map((subtask) => (
                    <TaskItem
                      key={subtask.id}
                      task={subtask}
                      onToggle={onToggle}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      level={level + 1}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
