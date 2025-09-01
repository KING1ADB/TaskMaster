"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  BarChart3,
  Timer,
  Trophy,
  Lightbulb,
  Calendar,
  Target,
  Zap,
  Users,
  Shield,
  ArrowRight,
  Star,
} from "lucide-react"

interface LandingPageProps {
  onGetStarted: () => void
  onSignIn: () => void
}

export function LandingPage({ onGetStarted, onSignIn }: LandingPageProps) {
  const features = [
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: "Smart Task Management",
      description: "Organize tasks with categories, priorities, due dates, and subtasks for complete project control.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-accent" />,
      title: "Advanced Analytics",
      description: "Track productivity patterns, completion rates, and get insights to optimize your workflow.",
    },
    {
      icon: <Timer className="h-6 w-6 text-orange-500" />,
      title: "Pomodoro Timer",
      description: "Built-in focus timer with task integration to maximize concentration and productivity.",
    },
    {
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      title: "Gamification",
      description: "Earn points, unlock badges, and track streaks to stay motivated and engaged.",
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-primary" />,
      title: "AI-Powered Suggestions",
      description: "Get intelligent recommendations for task prioritization and schedule optimization.",
    },
    {
      icon: <Calendar className="h-6 w-6 text-accent" />,
      title: "Multiple Views",
      description: "Switch between list, calendar, timeline, and weekly views to match your workflow.",
    },
  ]

  const stats = [
    { label: "Tasks Completed", value: "10M+", icon: <CheckCircle className="h-5 w-5" /> },
    { label: "Active Users", value: "50K+", icon: <Users className="h-5 w-5" /> },
    { label: "Productivity Boost", value: "40%", icon: <Target className="h-5 w-5" /> },
    { label: "Focus Sessions", value: "2M+", icon: <Timer className="h-5 w-5" /> },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm font-medium">
                <Zap className="h-3 w-3 mr-1" />
                Professional Task Management
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance">
                Master Your Tasks with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  TaskMaster Pro
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                The ultimate productivity platform for students and professionals. Organize, prioritize, and accomplish
                more with AI-powered insights, gamification, and advanced analytics.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" onClick={onGetStarted} className="text-base px-8 py-3 group">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" onClick={onSignIn} className="text-base px-8 py-3 bg-transparent">
                Sign In
              </Button>
            </div>

            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="ml-2">Trusted by 50,000+ users worldwide</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 border-y bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="flex items-center justify-center text-primary mb-2">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance">Everything You Need to Stay Productive</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Powerful features designed to help you organize, focus, and achieve your goals with unprecedented
              efficiency.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance">Ready to Transform Your Productivity?</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Join thousands of students and professionals who have already revolutionized their task management with
              TaskMaster Pro.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" onClick={onGetStarted} className="text-base px-8 py-3 group">
              Start Your Free Journey
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg" onClick={onSignIn} className="text-base px-8 py-3 bg-transparent">
              Already have an account?
            </Button>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              <span>No Credit Card Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="text-2xl font-bold text-primary">TaskMaster Pro</div>
            <p className="text-sm text-muted-foreground">
              © 2024 TaskMaster Pro. Built with precision for productivity excellence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
