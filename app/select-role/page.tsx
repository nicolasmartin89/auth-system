import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/utils/auth"
import { RoleSelection } from "@/components/auth/role-selection"

export default async function SelectRolePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/signin")
  }

  // If user already has a role, redirect to appropriate dashboard
  if (user.role === "cliente") {
    redirect("/cliente")
  }

  if (user.role === "profesional") {
    redirect("/profesional")
  }

  return <RoleSelection />
}
