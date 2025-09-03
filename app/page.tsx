import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/utils/auth"

export default async function HomePage() {
  const user = await getCurrentUser()

  // If user is not authenticated, redirect to signin
  if (!user) {
    redirect("/auth/signin")
  }

  // If user has no role, redirect to role selection
  if (!user.role) {
    redirect("/select-role")
  }

  // Redirect to appropriate dashboard based on role
  if (user.role === "cliente") {
    redirect("/cliente")
  }

  if (user.role === "profesional") {
    redirect("/profesional")
  }

  // Fallback redirect
  redirect("/auth/signin")
}
