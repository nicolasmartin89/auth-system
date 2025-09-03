import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev", // Cambiar por tu dominio
      to: email,
      subject: "Verifica tu cuenta",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #333; text-align: center;">Verifica tu cuenta</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Gracias por registrarte. Para completar tu registro, haz clic en el siguiente enlace:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #0070f3; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              Verificar Email
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:
          </p>
          <p style="color: #0070f3; word-break: break-all; font-size: 14px;">
            ${verificationUrl}
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Este enlace expirará en 24 horas.
          </p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, error };
  }
}
