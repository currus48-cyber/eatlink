import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

let transport: Transporter | null = null;

function getTransport(): Transporter {
  if (transport) {
    return transport;
  }

  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;

  if (!host || !port || !user || !password) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASSWORD.",
    );
  }

  transport = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass: password },
  });

  return transport;
}

export async function sendMail(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<void> {
  const from = process.env.SMTP_FROM ?? "EatLink <no-reply@eatlink.app>";

  await getTransport().sendMail({
    from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
}
