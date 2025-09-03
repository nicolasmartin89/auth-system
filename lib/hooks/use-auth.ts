"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const isLoading = status === "loading"
  const isAuthenticated = !!session?.user
  const user = session?.user

  const requireAuth = () => {
    if (!isAuthenticated && !isLoading) {
      router.push("/auth/signin")
      return false
    }
    return true
  }

  const requireRole = (role: string) => {
    if (!requireAuth()) return false

    if (user?.role !== role) {
      // Redirect to appropriate dashboard
      if (user?.role === "cliente") {
        router.push("/cliente")
      } else if (user?.role === "profesional") {
        router.push("/profesional")
      } else {
        router.push("/select-role")
      }
      return false
    }
    return true
  }

  const redirectToDashboard = () => {
    if (!user?.role) {
      router.push("/select-role")
      return
    }

    if (user.role === "cliente") {
      router.push("/cliente")
    } else if (user.role === "profesional") {
      router.push("/profesional")
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    requireAuth,
    requireRole,
    redirectToDashboard,
  }
}
