"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Square, RotateCcw, Timer, Coffee } from "lucide-react"
import { usePomodoro } from "@/hooks/use-pomodoro"
import { useTasks } from "@/hooks/use-tasks"

export function PomodoroTimer() {
  const {
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
  } = usePomodoro()

  const { pendingTasks } = useTasks()
  const [selectedTaskId, setSelectedTaskId] = useState<string>("")

  const selectedTask = pendingTasks.find((task) => task.id === selectedTaskId)

  const handleStart = () => {
    if (selectedTask) {
      startTimer(selectedTask.id, selectedTask.title)
    } else {
      startTimer()
    }
  }

  const getSessionTypeColor = () => {
    switch (currentSession.type) {
      case "work":
        return "text-primary"
      case "short-break":
        return "text-green-600"
      case "long-break":
        return "text-blue-600"
      default:
        return "text-primary"
    }
  }

  const getSessionTypeIcon = () => {
    switch (currentSession.type) {
      case "work":
        return <Timer className="h-5 w-5" />
      case "short-break":
      case "long-break":
        return <Coffee className="h-5 w-5" />
      default:
        return <Timer className="h-5 w-5" />
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          {getSessionTypeIcon()}
          Pomodoro Timer
        </CardTitle>
        <CardDescription>
          {currentSession.type === "work" ? "Focus Time" : "Break Time"}
          {selectedTask && currentSession.type === "work" && (
            <span className="block mt-1 font-medium text-foreground">{selectedTask.title}</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center">
          <div className={`text-6xl font-mono font-bold ${getSessionTypeColor()}`}>{formatTime(timeLeft)}</div>
          <Progress value={getProgress()} className="mt-4 h-2" />
        </div>

        {/* Session Type Badge */}
        <div className="flex justify-center">
          <Badge variant={currentSession.type === "work" ? "default" : "secondary"} className="text-sm px-3 py-1">
            {currentSession.type === "work"
              ? "Work Session"
              : currentSession.type === "short-break"
                ? "Short Break"
                : "Long Break"}
          </Badge>
        </div>

        {/* Task Selection */}
        {!isActive && currentSession.type === "work" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Focus on a task (optional)</label>
            <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a task to focus on" />
              </SelectTrigger>
              <SelectContent>
                {pendingTasks.slice(0, 10).map((task) => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Duration Selection */}
        {!isActive && currentSession.type === "work" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Session Duration</label>
            <Select
              value={currentSession.duration.toString()}
              onValueChange={(value) => setCustomDuration(Number.parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="25">25 minutes (Classic)</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex justify-center gap-2">
          {!isActive ? (
            <Button onClick={handleStart} size="lg" className="px-8">
              <Play className="mr-2 h-4 w-4" />
              Start
            </Button>
          ) : (
            <>
              {isPaused ? (
                <Button onClick={resumeTimer} size="lg">
                  <Play className="mr-2 h-4 w-4" />
                  Resume
                </Button>
              ) : (
                <Button onClick={pauseTimer} size="lg" variant="secondary">
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </Button>
              )}
              <Button onClick={stopTimer} size="lg" variant="outline">
                <Square className="mr-2 h-4 w-4" />
                Stop
              </Button>
            </>
          )}
          {currentSession.type !== "work" && (
            <Button onClick={resetToWork} size="lg" variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Back to Work
            </Button>
          )}
        </div>

        {/* Quick Actions */}
        {!isActive && currentSession.type === "work" && (
          <div className="flex justify-center gap-2">
            <Button onClick={() => startBreak(false)} variant="outline" size="sm">
              <Coffee className="mr-2 h-4 w-4" />
              Short Break (5m)
            </Button>
            <Button onClick={() => startBreak(true)} variant="outline" size="sm">
              <Coffee className="mr-2 h-4 w-4" />
              Long Break (15m)
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{sessionsCompleted}</div>
            <div className="text-sm text-muted-foreground">Sessions Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{Math.round(totalFocusTime / 60)}h</div>
            <div className="text-sm text-muted-foreground">Focus Time</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
