import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { sendVerificationEmail } from "@/lib/email"
import crypto from "crypto"

const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ message: "Ya existe un usuario con este email" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: null, // Explicitly set to null until verified
      },
    })

    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    })

    const emailResult = await sendVerificationEmail(email, token)

    if (!emailResult.success) {
      // If email fails, delete the user and token to maintain consistency
      await prisma.user.delete({ where: { id: user.id } })
      await prisma.verificationToken.delete({ where: { token } })
      return NextResponse.json({ message: "Error al enviar el email de verificación" }, { status: 500 })
    }

    return NextResponse.json(
      {
        message: "Cuenta creada exitosamente. Revisa tu email para verificar tu cuenta.",
        requiresVerification: true,
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Datos inválidos", errors: error.errors }, { status: 400 })
    }

    console.error("Registration error:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
