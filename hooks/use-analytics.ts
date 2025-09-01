"use client"

import { useMemo } from "react"
import { useTasks } from "./use-tasks"
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format, subDays, isWithinInterval } from "date-fns"

export function useAnalytics() {
  const { tasks } = useTasks()

  const analytics = useMemo(() => {
    const now = new Date()
    const weekStart = startOfWeek(now)
    const weekEnd = endOfWeek(now)
    const monthStart = startOfMonth(now)
    const monthEnd = endOfMonth(now)

    // Basic stats
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((task) => task.completed)
    const pendingTasks = tasks.filter((task) => !task.completed)
    const overdueTasks = tasks.filter((task) => task.dueDate && new Date(task.dueDate) < now && !task.completed)

    // Time-based completion data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(now, 6 - i)
      const dayTasks = tasks.filter((task) => {
        const taskDate = new Date(task.updatedAt)
        return taskDate.toDateString() === date.toDateString() && task.completed
      })
      return {
        date: format(date, "MMM dd"),
        completed: dayTasks.length,
        total: tasks.filter((task) => {
          const createdDate = new Date(task.createdAt)
          return createdDate <= date
        }).length,
      }
    })

    // Priority distribution
    const priorityStats = {
      urgent: tasks.filter((task) => task.priority === "urgent").length,
      high: tasks.filter((task) => task.priority === "high").length,
      medium: tasks.filter((task) => task.priority === "medium").length,
      low: tasks.filter((task) => task.priority === "low").length,
    }

    // Category distribution
    const categoryStats = tasks.reduce(
      (acc, task) => {
        acc[task.category] = (acc[task.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Completion rate by category
    const categoryCompletion = Object.keys(categoryStats).map((category) => {
      const categoryTasks = tasks.filter((task) => task.category === category)
      const completed = categoryTasks.filter((task) => task.completed).length
      return {
        category,
        total: categoryTasks.length,
        completed,
        rate: categoryTasks.length > 0 ? Math.round((completed / categoryTasks.length) * 100) : 0,
      }
    })

    // Weekly and monthly stats
    const thisWeekTasks = tasks.filter((task) =>
      isWithinInterval(new Date(task.createdAt), { start: weekStart, end: weekEnd }),
    )
    const thisMonthTasks = tasks.filter((task) =>
      isWithinInterval(new Date(task.createdAt), { start: monthStart, end: monthEnd }),
    )

    const weeklyCompletion = thisWeekTasks.filter((task) => task.completed).length
    const monthlyCompletion = thisMonthTasks.filter((task) => task.completed).length

    // Productivity streaks
    const completionDates = completedTasks
      .map((task) => new Date(task.updatedAt).toDateString())
      .filter((date, index, arr) => arr.indexOf(date) === index)
      .sort()

    let currentStreak = 0
    let maxStreak = 0
    let tempStreak = 0

    for (let i = 0; i < 30; i++) {
      const checkDate = subDays(now, i).toDateString()
      if (completionDates.includes(checkDate)) {
        tempStreak++
        if (i === 0) currentStreak = tempStreak
      } else {
        maxStreak = Math.max(maxStreak, tempStreak)
        tempStreak = 0
      }
    }
    maxStreak = Math.max(maxStreak, tempStreak)

    return {
      totalTasks,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      overdueTasks: overdueTasks.length,
      completionRate: totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0,
      last7Days,
      priorityStats,
      categoryStats,
      categoryCompletion,
      thisWeekTasks: thisWeekTasks.length,
      thisMonthTasks: thisMonthTasks.length,
      weeklyCompletion,
      monthlyCompletion,
      weeklyCompletionRate: thisWeekTasks.length > 0 ? Math.round((weeklyCompletion / thisWeekTasks.length) * 100) : 0,
      monthlyCompletionRate:
        thisMonthTasks.length > 0 ? Math.round((monthlyCompletion / thisMonthTasks.length) * 100) : 0,
      currentStreak,
      maxStreak,
    }
  }, [tasks])

  return analytics
}
