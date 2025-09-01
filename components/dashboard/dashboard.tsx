"use client"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TaskList } from "@/components/tasks/task-list"
import { AnalyticsOverview } from "@/components/analytics/analytics-overview"
import { ProductivityCharts } from "@/components/analytics/productivity-charts"
import { ProductivityInsights } from "@/components/analytics/productivity-insights"
import { PomodoroTimer } from "@/components/pomodoro/pomodoro-timer"
import { GamificationPanel } from "@/components/gamification/gamification-panel"
import { AISuggestions } from "@/components/ai/ai-suggestions"
import { CalendarView } from "@/components/calendar/calendar-view"
import { TimelineView } from "@/components/timeline/timeline-view"
import { WeeklyView } from "@/components/calendar/weekly-view"
import { useTasks } from "@/hooks/use-tasks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart3,
  CheckCircle,
  Clock,
  Calendar,
  Settings,
  Timer,
  Trophy,
  Lightbulb,
  CalendarDays,
  Baseline as Timeline,
} from "lucide-react"

export function Dashboard() {
  const { user, logout } = useAuth()
  const { todayTasks, overdueTasks, completedTasks } = useTasks()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">TaskMaster Pro</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Welcome back, {user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button variant="outline" size="sm" className="sm:hidden bg-transparent">
              <Settings className="h-4 w-4" />
            </Button>
            <Button onClick={logout} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </header>

        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-9 w-full min-w-max sm:min-w-0">
              <TabsTrigger value="overview" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Overview</span>
                <span className="sm:hidden">Home</span>
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="today" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                Today
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Calendar</span>
                <span className="sm:hidden">Cal</span>
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Timeline className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden lg:inline">Timeline</span>
                <span className="lg:hidden">Time</span>
              </TabsTrigger>
              <TabsTrigger value="pomodoro" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Timer className="h-3 w-3 sm:h-4 sm:w-4" />
                Focus
              </TabsTrigger>
              <TabsTrigger value="gamification" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden lg:inline">Progress</span>
                <span className="lg:hidden">XP</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4" />
                AI
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden lg:inline">Analytics</span>
                <span className="lg:hidden">Stats</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="animate-in fade-in-50 duration-300">
            <TabsContent value="overview" className="space-y-4 sm:space-y-6">
              <AnalyticsOverview />
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                  <ProductivityCharts />
                </div>
                <div className="space-y-4 sm:space-y-6">
                  <AISuggestions />
                  <ProductivityInsights />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="animate-in slide-in-from-right-5 duration-300">
              <TaskList />
            </TabsContent>

            <TabsContent value="today" className="animate-in slide-in-from-left-5 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    Today's Tasks
                  </CardTitle>
                  <CardDescription className="text-sm">Focus on what's due today</CardDescription>
                </CardHeader>
                <CardContent>
                  {todayTasks.length === 0 ? (
                    <div className="text-center py-6 sm:py-8">
                      <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                      <p className="text-sm sm:text-base text-muted-foreground">
                        No tasks due today. Great job staying on top of things!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {todayTasks.map((task) => (
                        <div
                          key={task.id}
                          className={`p-3 sm:p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${
                            task.completed ? "opacity-60 bg-muted/50" : "bg-card hover:bg-accent/5"
                          }`}
                        >
                          <div className="flex items-start sm:items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h3
                                className={`font-medium text-sm sm:text-base ${task.completed ? "line-through" : ""}`}
                              >
                                {task.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                {task.category} • {task.priority} priority
                                {task.description && ` • ${task.description.slice(0, 30)}...`}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {task.completed ? (
                                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                              ) : (
                                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="calendar"
              className="space-y-4 sm:space-y-6 animate-in slide-in-from-bottom-5 duration-300"
            >
              <Tabs defaultValue="month" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="month">Month View</TabsTrigger>
                  <TabsTrigger value="week">Week View</TabsTrigger>
                </TabsList>
                <TabsContent value="month">
                  <CalendarView />
                </TabsContent>
                <TabsContent value="week">
                  <WeeklyView />
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="timeline" className="animate-in slide-in-from-top-5 duration-300">
              <TimelineView />
            </TabsContent>

            <TabsContent value="pomodoro" className="space-y-4 sm:space-y-6 animate-in zoom-in-95 duration-300">
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <PomodoroTimer />
                </div>
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Focus Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="p-3 bg-primary/10 rounded-lg transition-colors hover:bg-primary/15">
                        <p className="font-medium text-primary">🎯 Stay Focused</p>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                          Eliminate distractions and focus on one task at a time.
                        </p>
                      </div>
                      <div className="p-3 bg-accent/10 rounded-lg transition-colors hover:bg-accent/15">
                        <p className="font-medium text-accent">☕ Take Breaks</p>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                          Regular breaks help maintain productivity and prevent burnout.
                        </p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-lg transition-colors hover:bg-green-200/50">
                        <p className="font-medium text-green-700">📱 Minimize Interruptions</p>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                          Turn off notifications during focus sessions.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="gamification" className="animate-in slide-in-from-right-5 duration-300">
              <GamificationPanel />
            </TabsContent>

            <TabsContent value="ai" className="space-y-4 sm:space-y-6 animate-in fade-in-50 duration-500">
              <AISuggestions />
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">AI Features</CardTitle>
                  <CardDescription>Intelligent productivity assistance</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                  <div className="p-3 sm:p-4 border rounded-lg transition-all duration-200 hover:shadow-md hover:bg-accent/5">
                    <h3 className="font-medium mb-2 text-sm sm:text-base">Smart Prioritization</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      AI analyzes your tasks and suggests optimal priority levels based on deadlines and importance.
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 border rounded-lg transition-all duration-200 hover:shadow-md hover:bg-accent/5">
                    <h3 className="font-medium mb-2 text-sm sm:text-base">Productivity Insights</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Get personalized recommendations to improve your workflow and completion rates.
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 border rounded-lg transition-all duration-200 hover:shadow-md hover:bg-accent/5">
                    <h3 className="font-medium mb-2 text-sm sm:text-base">Schedule Optimization</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      AI suggests the best times to work on different types of tasks based on your patterns.
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 border rounded-lg transition-all duration-200 hover:shadow-md hover:bg-accent/5">
                    <h3 className="font-medium mb-2 text-sm sm:text-base">Habit Formation</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Intelligent suggestions to help you build consistent productivity habits.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent
              value="analytics"
              className="space-y-4 sm:space-y-6 animate-in slide-in-from-left-5 duration-300"
            >
              <AnalyticsOverview />
              <ProductivityCharts />
              <ProductivityInsights />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
