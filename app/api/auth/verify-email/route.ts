import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { encode } from "next-auth/jwt"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ message: "Token de verificación requerido" }, { status: 400 })
    }

    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return NextResponse.json({ message: "Token de verificación inválido" }, { status: 400 })
    }

    // Check if token has expired
    if (verificationToken.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token },
      })
      return NextResponse.json({ message: "Token de verificación expirado" }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    })

    // Delete the used token
    await prisma.verificationToken.delete({
      where: { token },
    })

    const sessionToken = await encode({
      token: {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      secret: process.env.NEXTAUTH_SECRET!,
    })

    const cookieStore = cookies()
    cookieStore.set("next-auth.session-token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    })

    return NextResponse.json(
      {
        message: "Email verificado exitosamente",
        success: true,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
