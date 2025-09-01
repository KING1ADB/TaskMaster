"use client"

import { useAuth } from "@/hooks/use-auth"
import { Dashboard } from "@/components/dashboard/dashboard"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading TaskMaster Pro...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to auth
  }

  return (
    <>
      <Dashboard />
      <Toaster />
    </>
  )
}
