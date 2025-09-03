"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Briefcase, ArrowRight, Check } from "lucide-react"

export function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { data: session, update } = useSession()

  const roles = [
    {
      id: "cliente",
      title: "Cliente",
      description: "Busco servicios profesionales para mis necesidades",
      icon: Users,
      features: ["Buscar profesionales", "Solicitar cotizaciones", "Gestionar proyectos", "Calificar servicios"],
      color: "bg-primary/10 border-primary/20 hover:bg-primary/20",
      iconColor: "text-primary",
    },
    {
      id: "profesional",
      title: "Profesional",
      description: "Ofrezco mis servicios profesionales a clientes",
      icon: Briefcase,
      features: ["Crear perfil profesional", "Recibir solicitudes", "Gestionar clientes", "Mostrar portafolio"],
      color: "bg-secondary/10 border-secondary/20 hover:bg-secondary/20",
      iconColor: "text-secondary",
    },
  ]

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
  }

  const handleConfirmRole = async () => {
    if (!selectedRole) return

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: selectedRole }),
      })

      if (response.ok) {
        // Update the session with the new role
        await update({ role: selectedRole })

        // Redirect to the appropriate dashboard
        if (selectedRole === "cliente") {
          router.push("/cliente")
        } else {
          router.push("/profesional")
        }
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Error al actualizar el rol")
      }
    } catch (error) {
      setError("Ocurrió un error inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">¡Bienvenido, {session?.user?.name}!</h1>
          <p className="text-lg text-muted-foreground">
            Para continuar, selecciona cómo quieres usar nuestra plataforma
          </p>
        </div>

        {error && (
          <Alert className="mb-6 border-destructive/50 text-destructive max-w-md mx-auto">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon
            const isSelected = selectedRole === role.id

            return (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? `${role.color} border-2 shadow-lg scale-105`
                    : "border-border hover:shadow-md hover:scale-102"
                }`}
                onClick={() => handleRoleSelect(role.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`p-4 rounded-full ${isSelected ? role.color : "bg-muted"}`}>
                      <Icon className={`w-8 h-8 ${isSelected ? role.iconColor : "text-muted-foreground"}`} />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold text-card-foreground">{role.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {role.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-card-foreground">
                        <Check className={`w-4 h-4 mr-2 ${isSelected ? role.iconColor : "text-muted-foreground"}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {isSelected && (
                    <div className="mt-4 p-3 bg-card rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground text-center">✓ Rol seleccionado</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center">
          <Button
            onClick={handleConfirmRole}
            disabled={!selectedRole || isLoading}
            className="px-8 py-3 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-lg"
          >
            {isLoading ? (
              "Configurando..."
            ) : (
              <>
                Continuar
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>

          {selectedRole && (
            <p className="mt-3 text-sm text-muted-foreground">
              Continuarás como {selectedRole === "cliente" ? "Cliente" : "Profesional"}
            </p>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Podrás cambiar tu rol más tarde desde la configuración de tu cuenta
          </p>
        </div>
      </div>
    </div>
  )
}
