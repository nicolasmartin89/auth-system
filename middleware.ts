import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth")
    const isRoleSelectionPage = req.nextUrl.pathname === "/select-role"
    const isClientPage = req.nextUrl.pathname.startsWith("/cliente")
    const isProfessionalPage = req.nextUrl.pathname.startsWith("/profesional")

    // If user is on auth pages and already authenticated, redirect based on role
    if (isAuthPage && isAuth) {
      if (!token.role) {
        return NextResponse.redirect(new URL("/select-role", req.url))
      }

      if (token.role === "cliente") {
        return NextResponse.redirect(new URL("/cliente", req.url))
      }

      if (token.role === "profesional") {
        return NextResponse.redirect(new URL("/profesional", req.url))
      }
    }

    // If user is authenticated but has no role, redirect to role selection
    if (isAuth && !token.role && !isRoleSelectionPage && !isAuthPage) {
      return NextResponse.redirect(new URL("/select-role", req.url))
    }

    // If user has role but is on role selection page, redirect to appropriate dashboard
    if (isAuth && token.role && isRoleSelectionPage) {
      if (token.role === "cliente") {
        return NextResponse.redirect(new URL("/cliente", req.url))
      }

      if (token.role === "profesional") {
        return NextResponse.redirect(new URL("/profesional", req.url))
      }
    }

    // Protect client pages
    if (isClientPage && (!isAuth || token.role !== "cliente")) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    // Protect professional pages
    if (isProfessionalPage && (!isAuth || token.role !== "profesional")) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to auth pages and role selection for everyone
        if (req.nextUrl.pathname.startsWith("/auth") || req.nextUrl.pathname === "/select-role") {
          return true
        }

        // For protected routes, require authentication
        if (req.nextUrl.pathname.startsWith("/cliente") || req.nextUrl.pathname.startsWith("/profesional")) {
          return !!token
        }

        // Allow access to public pages
        return true
      },
    },
  },
)

export const config = {
  matcher: ["/auth/:path*", "/select-role", "/cliente/:path*", "/profesional/:path*"],
}
