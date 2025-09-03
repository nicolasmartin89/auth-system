import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateRoleSchema = z.object({
  role: z.enum(["cliente", "profesional"], {
    required_error: "El rol es requerido",
    invalid_type_error: "Rol inválido",
  }),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { role } = updateRoleSchema.parse(body)

    // Update user role in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    return NextResponse.json(
      {
        message: "Rol actualizado exitosamente",
        user: updatedUser,
      },
      { status: 200 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Datos inválidos", errors: error.errors }, { status: 400 })
    }

    console.error("Update role error:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
