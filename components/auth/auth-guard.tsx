"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: string
  redirectTo?: string
}

export function AuthGuard({ children, requiredRole, redirectTo = "/auth/signin" }: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading

    if (!session) {
      router.push(redirectTo)
      return
    }

    if (!session.user.role) {
      router.push("/select-role")
      return
    }

    if (requiredRole && session.user.role !== requiredRole) {
      // Redirect to appropriate dashboard based on user's role
      if (session.user.role === "cliente") {
        router.push("/cliente")
      } else if (session.user.role === "profesional") {
        router.push("/profesional")
      } else {
        router.push(redirectTo)
      }
    }
  }, [session, status, router, requiredRole, redirectTo])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (!session.user.role) {
    return null
  }

  if (requiredRole && session.user.role !== requiredRole) {
    return null
  }

  return <>{children}</>
}
