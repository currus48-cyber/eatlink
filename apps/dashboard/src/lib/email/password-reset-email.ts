import "server-only";

import { sendMail } from "@/lib/email/mailer";

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
): Promise<void> {
  await sendMail({
    to,
    subject: "Réinitialisez votre mot de passe EatLink",
    text: `Vous avez demandé la réinitialisation de votre mot de passe EatLink. Ouvrez ce lien pour choisir un nouveau mot de passe (valable 30 minutes) : ${resetUrl}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="font-size: 18px;">Réinitialisation de mot de passe</h1>
        <p>Vous avez demandé la réinitialisation de votre mot de passe EatLink.</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 16px; background: #111; color: #fff; text-decoration: none; border-radius: 6px;">
            Réinitialiser mon mot de passe
          </a>
        </p>
        <p>Ce lien est valable 30 minutes.</p>
        <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</p>
      </div>
    `,
  });
}
