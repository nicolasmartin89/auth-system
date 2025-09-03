import { requireRole } from "@/lib/utils/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Search, MessageSquare, Star } from "lucide-react"

export default async function ClienteDashboard() {
  const user = await requireRole("cliente")

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Panel de Cliente</h1>
          <p className="text-lg text-muted-foreground">
            Bienvenido, {user.name}. Encuentra los mejores profesionales para tus proyectos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Proyectos Activos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">0</div>
              <p className="text-xs text-muted-foreground">Proyectos en curso</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Cotizaciones</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">0</div>
              <p className="text-xs text-muted-foreground">Pendientes de respuesta</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Profesionales</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">0</div>
              <p className="text-xs text-muted-foreground">En tu red</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">Calificaciones</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">0</div>
              <p className="text-xs text-muted-foreground">Servicios calificados</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Buscar Profesionales</CardTitle>
              <CardDescription className="text-muted-foreground">
                Encuentra el profesional perfecto para tu proyecto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Search className="w-4 h-4 mr-2" />
                Explorar Profesionales
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Crear Proyecto</CardTitle>
              <CardDescription className="text-muted-foreground">
                Publica tu proyecto y recibe cotizaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Users className="w-4 h-4 mr-2" />
                Nuevo Proyecto
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
