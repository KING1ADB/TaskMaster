"use client"

import { useAuth } from "@/hooks/use-auth"
import { AuthForm } from "@/components/auth/auth-form"
import { Dashboard } from "@/components/dashboard/dashboard"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  const { user, loading } = useAuth()

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

  return (
    <>
      {user ? <Dashboard /> : <AuthForm />}
      <Toaster />
    </>
  )
}
