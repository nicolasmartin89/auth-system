"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type VerificationState = "pending" | "verifying" | "success" | "error";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<VerificationState>("pending");
  const [message, setMessage] = useState("");

  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    setState("verifying");

    try {
      const response = await fetch(
        `/api/auth/verify-email?token=${verificationToken}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setState("success");
        setMessage("¡Email verificado exitosamente!");

        setTimeout(() => {
          router.push("/select-role");
        }, 2000);
      } else {
        setState("error");
        setMessage(data.message || "Error al verificar el email");
      }
    } catch (error) {
      setState("error");
      setMessage("Error de conexión. Inténtalo de nuevo.");
    }
  };

  if (state === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-card">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold text-card-foreground">
              Verificando Email
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Estamos verificando tu correo electrónico...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-card">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-green-100">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold text-card-foreground">
              ¡Email Verificado!
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {message}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Tu cuenta ha sido verificada exitosamente. Ahora selecciona tu rol
              para continuar...
            </p>
            <Button asChild className="w-full">
              <Link href="/select-role">Seleccionar Rol</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-card">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-red-100">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold text-card-foreground">
              Error de Verificación
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {message}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <Button asChild className="w-full">
              <Link href="/auth/signin">Ir al Login</Link>
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/auth/signup">Crear otra cuenta</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md mx-auto shadow-lg border-0 bg-card">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-card-foreground">
            Verifica tu Email
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Te hemos enviado un enlace de verificación a tu correo electrónico
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Revisa tu bandeja de entrada y haz clic en el enlace de
                verificación para activar tu cuenta.
              </p>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
              <p>¿No recibiste el email?</p>
              <ul className="text-xs space-y-1">
                <li>• Revisa tu carpeta de spam</li>
                <li>• Verifica que el email sea correcto</li>
                <li>• El enlace expira en 24 horas</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/auth/signin">Ir al Login</Link>
            </Button>

            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/auth/signup">Crear otra cuenta</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
