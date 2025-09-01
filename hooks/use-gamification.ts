"use client"

import { useState, useEffect } from "react"
import { useTasks } from "./use-tasks"
import { useAuth } from "./use-auth"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface UserStats {
  points: number
  level: number
  badges: string[]
  streak: number
  tasksCompleted: number
  pomodorosCompleted: number
  totalFocusTime: number // in minutes
}

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  requirement: (stats: UserStats) => boolean
}

const badges: Badge[] = [
  {
    id: "first-task",
    name: "Getting Started",
    description: "Complete your first task",
    icon: "🎯",
    requirement: (stats) => stats.tasksCompleted >= 1,
  },
  {
    id: "task-master",
    name: "Task Master",
    description: "Complete 10 tasks",
    icon: "🏆",
    requirement: (stats) => stats.tasksCompleted >= 10,
  },
  {
    id: "productivity-pro",
    name: "Productivity Pro",
    description: "Complete 50 tasks",
    icon: "⭐",
    requirement: (stats) => stats.tasksCompleted >= 50,
  },
  {
    id: "streak-starter",
    name: "Streak Starter",
    description: "Maintain a 3-day streak",
    icon: "🔥",
    requirement: (stats) => stats.streak >= 3,
  },
  {
    id: "streak-master",
    name: "Streak Master",
    description: "Maintain a 7-day streak",
    icon: "🚀",
    requirement: (stats) => stats.streak >= 7,
  },
  {
    id: "focus-champion",
    name: "Focus Champion",
    description: "Complete 10 Pomodoro sessions",
    icon: "🧠",
    requirement: (stats) => stats.pomodorosCompleted >= 10,
  },
  {
    id: "time-warrior",
    name: "Time Warrior",
    description: "Focus for 10 hours total",
    icon: "⏰",
    requirement: (stats) => stats.totalFocusTime >= 600,
  },
]

export function useGamification() {
  const [userStats, setUserStats] = useState<UserStats>({
    points: 0,
    level: 1,
    badges: [],
    streak: 0,
    tasksCompleted: 0,
    pomodorosCompleted: 0,
    totalFocusTime: 0,
  })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { completedTasks } = useTasks()

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    loadUserStats()
  }, [user])

  useEffect(() => {
    if (!user || loading) return

    // Update stats based on completed tasks
    const newTasksCompleted = completedTasks.length
    if (newTasksCompleted !== userStats.tasksCompleted) {
      updateUserStats({
        tasksCompleted: newTasksCompleted,
        points: userStats.points + (newTasksCompleted - userStats.tasksCompleted) * 10,
      })
    }
  }, [completedTasks, user, loading])

  const loadUserStats = async () => {
    if (!user) return

    try {
      const statsDoc = await getDoc(doc(db, "userStats", user.uid))
      if (statsDoc.exists()) {
        setUserStats(statsDoc.data() as UserStats)
      } else {
        // Create initial stats
        const initialStats: UserStats = {
          points: 0,
          level: 1,
          badges: [],
          streak: 0,
          tasksCompleted: 0,
          pomodorosCompleted: 0,
          totalFocusTime: 0,
        }
        await setDoc(doc(db, "userStats", user.uid), initialStats)
        setUserStats(initialStats)
      }
    } catch (error) {
      console.error("Error loading user stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserStats = async (updates: Partial<UserStats>) => {
    if (!user) return

    const newStats = { ...userStats, ...updates }

    // Calculate level based on points
    const newLevel = Math.floor(newStats.points / 100) + 1
    newStats.level = newLevel

    // Check for new badges
    const newBadges = badges
      .filter((badge) => badge.requirement(newStats) && !newStats.badges.includes(badge.id))
      .map((badge) => badge.id)

    if (newBadges.length > 0) {
      newStats.badges = [...newStats.badges, ...newBadges]
    }

    try {
      await updateDoc(doc(db, "userStats", user.uid), newStats)
      setUserStats(newStats)

      // Return new badges for notification
      return newBadges.map((badgeId) => badges.find((b) => b.id === badgeId)!).filter(Boolean)
    } catch (error) {
      console.error("Error updating user stats:", error)
      return []
    }
  }

  const addPoints = async (points: number) => {
    return await updateUserStats({
      points: userStats.points + points,
    })
  }

  const completePomodoroSession = async (focusTime: number) => {
    return await updateUserStats({
      pomodorosCompleted: userStats.pomodorosCompleted + 1,
      totalFocusTime: userStats.totalFocusTime + focusTime,
      points: userStats.points + 25, // Bonus points for Pomodoro
    })
  }

  const updateStreak = async (streak: number) => {
    return await updateUserStats({ streak })
  }

  const getAvailableBadges = () => {
    return badges.filter((badge) => !userStats.badges.includes(badge.id))
  }

  const getEarnedBadges = () => {
    return badges.filter((badge) => userStats.badges.includes(badge.id))
  }

  return {
    userStats,
    loading,
    addPoints,
    completePomodoroSession,
    updateStreak,
    getAvailableBadges,
    getEarnedBadges,
    badges,
  }
}
