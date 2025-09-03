import type React from "react"
import { Navbar } from "@/components/layout/navbar"

export default function ProfesionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {children}
    </div>
  )
}
