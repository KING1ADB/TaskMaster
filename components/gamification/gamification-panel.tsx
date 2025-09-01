"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Zap, Target } from "lucide-react"
import { useGamification } from "@/hooks/use-gamification"

export function GamificationPanel() {
  const { userStats, loading, getEarnedBadges, getAvailableBadges } = useGamification()

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
            <div className="h-2 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const earnedBadges = getEarnedBadges()
  const availableBadges = getAvailableBadges()
  const pointsToNextLevel = userStats.level * 100 - userStats.points
  const levelProgress = userStats.points % 100

  return (
    <div className="space-y-6">
      {/* Level and Points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-accent" />
            Your Progress
          </CardTitle>
          <CardDescription>Level up by completing tasks and staying productive!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary">Level {userStats.level}</div>
              <div className="text-sm text-muted-foreground">{userStats.points} points</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{pointsToNextLevel} points to next level</div>
              <div className="text-xs text-muted-foreground">Level {userStats.level + 1}</div>
            </div>
          </div>
          <Progress value={levelProgress} className="h-3" />
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{userStats.tasksCompleted}</div>
            <div className="text-xs text-muted-foreground">Tasks Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-6 w-6 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-accent">{userStats.streak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{userStats.pomodorosCompleted}</div>
            <div className="text-xs text-muted-foreground">Pomodoros</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{Math.round(userStats.totalFocusTime / 60)}</div>
            <div className="text-xs text-muted-foreground">Focus Hours</div>
          </CardContent>
        </Card>
      </div>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            Achievements
          </CardTitle>
          <CardDescription>
            {earnedBadges.length} of {earnedBadges.length + availableBadges.length} badges earned
          </CardDescription>
        </CardHeader>
        <CardContent>
          {earnedBadges.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Complete tasks to start earning badges!</p>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-3 text-green-600">Earned Badges</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {earnedBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <span className="text-2xl">{badge.icon}</span>
                      <div>
                        <div className="font-medium text-sm text-green-800">{badge.name}</div>
                        <div className="text-xs text-green-600">{badge.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {availableBadges.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 text-muted-foreground">Available Badges</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableBadges.slice(0, 6).map((badge) => (
                      <div
                        key={badge.id}
                        className="flex items-center gap-3 p-3 bg-muted/50 border border-muted rounded-lg opacity-60"
                      >
                        <span className="text-2xl grayscale">{badge.icon}</span>
                        <div>
                          <div className="font-medium text-sm">{badge.name}</div>
                          <div className="text-xs text-muted-foreground">{badge.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
