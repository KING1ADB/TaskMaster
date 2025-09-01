"use client"

import { AuthForm } from "@/components/auth/auth-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Toaster } from "@/components/ui/toaster"

export default function AuthPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </div>
      <AuthForm />
      <Toaster />
    </div>
  )
}
