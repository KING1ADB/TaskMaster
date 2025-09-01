"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search } from "lucide-react"
import { TaskItem } from "./task-item"
import { TaskForm } from "./task-form"
import { useTasks } from "@/hooks/use-tasks"
import { useToast } from "@/hooks/use-toast"
import type { Task } from "@/types/task"

export function TaskList() {
  const { tasks, loading, addTask, editTask, removeTask, toggleTask } = useTasks()
  const { toast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  const handleAddTask = async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "userId">) => {
    try {
      await addTask(taskData)
      setShowForm(false)
      toast({
        title: "Task created!",
        description: "Your new task has been added successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditTask = async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "userId">) => {
    if (!editingTask) return

    try {
      await editTask(editingTask.id, taskData)
      setEditingTask(null)
      toast({
        title: "Task updated!",
        description: "Your task has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await removeTask(taskId)
      toast({
        title: "Task deleted",
        description: "The task has been removed.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      await toggleTask(taskId, completed)
      toast({
        title: completed ? "Task completed!" : "Task reopened",
        description: completed ? "Great job on completing your task!" : "Task marked as incomplete.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesPriority = filterPriority === "all" || task.priority === filterPriority
    const matchesCategory = filterCategory === "all" || task.category === filterCategory
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "completed" && task.completed) ||
      (filterStatus === "pending" && !task.completed)

    return matchesSearch && matchesPriority && matchesCategory && matchesStatus
  })

  // Get unique categories for filter
  const categories = Array.from(new Set(tasks.map((task) => task.category)))

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (showForm) {
    return <TaskForm onSubmit={handleAddTask} onCancel={() => setShowForm(false)} />
  }

  if (editingTask) {
    return (
      <TaskForm onSubmit={handleEditTask} onCancel={() => setEditingTask(null)} initialTask={editingTask} isEditing />
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <span>My Tasks</span>
              <Badge variant="secondary">{filteredTasks.length}</Badge>
            </CardTitle>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
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

          {/* Task List */}
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {tasks.length === 0
                  ? "No tasks yet. Create your first task to get started!"
                  : "No tasks match your current filters."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  onEdit={setEditingTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
