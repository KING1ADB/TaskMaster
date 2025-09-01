"use client"

import { useState, useEffect } from "react"
import { subscribeToTasks, createTask, updateTask, deleteTask } from "@/lib/tasks"
import type { Task } from "@/types/task"
import { useAuth } from "./use-auth"

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setTasks([])
      setLoading(false)
      return
    }

    const unsubscribe = subscribeToTasks(user.uid, (newTasks) => {
      setTasks(newTasks)
      setLoading(false)
    })

    return unsubscribe
  }, [user])

  const addTask = async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "userId">) => {
    if (!user) return

    try {
      await createTask(taskData, user.uid)
    } catch (error) {
      console.error("Error adding task:", error)
      throw error
    }
  }

  const editTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      await updateTask(taskId, updates)
    } catch (error) {
      console.error("Error updating task:", error)
      throw error
    }
  }

  const removeTask = async (taskId: string) => {
    try {
      await deleteTask(taskId)
    } catch (error) {
      console.error("Error deleting task:", error)
      throw error
    }
  }

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      await updateTask(taskId, { completed })
    } catch (error) {
      console.error("Error toggling task:", error)
      throw error
    }
  }

  // Helper functions for filtering tasks
  const todayTasks = tasks.filter((task) => {
    if (!task.dueDate) return false
    const today = new Date()
    const taskDate = new Date(task.dueDate)
    return taskDate.toDateString() === today.toDateString()
  })

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate || task.completed) return false
    return new Date(task.dueDate) < new Date()
  })

  const completedTasks = tasks.filter((task) => task.completed)

  const pendingTasks = tasks.filter((task) => !task.completed)

  return {
    tasks,
    loading,
    addTask,
    editTask,
    removeTask,
    toggleTask,
    todayTasks,
    overdueTasks,
    completedTasks,
    pendingTasks,
  }
}
