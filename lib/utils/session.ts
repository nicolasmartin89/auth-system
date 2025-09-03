import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import type { Session } from "next-auth"

export async function getSession(): Promise<Session | null> {
  return await getServerSession(authOptions)
}

export async function requireSession(): Promise<Session> {
  const session = await getSession()
  if (!session) {
    throw new Error("Authentication required")
  }
  return session
}

export async function requireUserWithRole(role: string) {
  const session = await requireSession()
  if (session.user.role !== role) {
    throw new Error(`Role ${role} required`)
  }
  return session.user
}
