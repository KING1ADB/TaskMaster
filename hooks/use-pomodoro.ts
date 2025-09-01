"use client"

import { useState, useEffect, useRef } from "react"
import { useGamification } from "./use-gamification"
import { useToast } from "./use-toast"

interface PomodoroSession {
  taskId?: string
  taskTitle?: string
  duration: number // in minutes
  type: "work" | "short-break" | "long-break"
}

export function usePomodoro() {
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [currentSession, setCurrentSession] = useState<PomodoroSession>({
    duration: 25,
    type: "work",
  })
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [totalFocusTime, setTotalFocusTime] = useState(0)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { completePomodoroSession } = useGamification()
  const { toast } = useToast()

  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, isPaused, timeLeft])

  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      handleSessionComplete()
    }
  }, [timeLeft, isActive])

  const handleSessionComplete = async () => {
    setIsActive(false)
    setIsPaused(false)

    if (currentSession.type === "work") {
      setSessionsCompleted((prev) => prev + 1)
      setTotalFocusTime((prev) => prev + currentSession.duration)

      // Award gamification points
      await completePomodoroSession(currentSession.duration)

      toast({
        title: "Pomodoro Complete!",
        description: `Great focus session! You earned 25 points.`,
      })

      // Auto-start break
      const isLongBreak = (sessionsCompleted + 1) % 4 === 0
      startBreak(isLongBreak)
    } else {
      toast({
        title: "Break Complete!",
        description: "Ready for another focus session?",
      })
      resetToWork()
    }
  }

  const startTimer = (taskId?: string, taskTitle?: string) => {
    setCurrentSession({
      ...currentSession,
      taskId,
      taskTitle,
    })
    setIsActive(true)
    setIsPaused(false)
  }

  const pauseTimer = () => {
    setIsPaused(true)
  }

  const resumeTimer = () => {
    setIsPaused(false)
  }

  const stopTimer = () => {
    setIsActive(false)
    setIsPaused(false)
    setTimeLeft(currentSession.duration * 60)
  }

  const startBreak = (isLong = false) => {
    const breakDuration = isLong ? 15 : 5
    setCurrentSession({
      duration: breakDuration,
      type: isLong ? "long-break" : "short-break",
    })
    setTimeLeft(breakDuration * 60)
    setIsActive(true)
    setIsPaused(false)
  }

  const resetToWork = () => {
    setCurrentSession({
      duration: 25,
      type: "work",
    })
    setTimeLeft(25 * 60)
    setIsActive(false)
    setIsPaused(false)
  }

  const setCustomDuration = (minutes: number) => {
    if (!isActive) {
      setCurrentSession({
        ...currentSession,
        duration: minutes,
      })
      setTimeLeft(minutes * 60)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getProgress = () => {
    const totalSeconds = currentSession.duration * 60
    return ((totalSeconds - timeLeft) / totalSeconds) * 100
  }

  return {
    isActive,
    isPaused,
    timeLeft,
    currentSession,
    sessionsCompleted,
    totalFocusTime,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    startBreak,
    resetToWork,
    setCustomDuration,
    formatTime,
    getProgress,
  }
}
