import { requireRole } from "@/lib/utils/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Users, MessageSquare, TrendingUp } from "lucide-react"

export default async function ProfesionalDashboard() {
  const user = await requireRole("profesional")

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Panel Profesional</h1>
          <p className="text-lg text-muted-foreground">
            Bienvenido, {user.name}. Gestiona tus servicios y conecta con nuevos clientes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Proyectos Activos</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">0</div>
              <p className="text-xs text-muted-foreground">En desarrollo</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">0</div>
              <p className="text-xs text-muted-foreground">Clientes activos</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Solicitudes</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">0</div>
              <p className="text-xs text-muted-foreground">Nuevas solicitudes</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Ingresos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">$0</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Completar Perfil</CardTitle>
              <CardDescription className="text-muted-foreground">
                Mejora tu perfil para atraer más clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Users className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Ver Oportunidades</CardTitle>
              <CardDescription className="text-muted-foreground">
                Explora proyectos disponibles en tu área
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Briefcase className="w-4 h-4 mr-2" />
                Buscar Proyectos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
