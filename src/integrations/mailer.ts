import nodemailer from "nodemailer";

export async function sendMail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  const transporter = nodemailer.createTransport({
    host: import.meta.env.SMTP_HOST,
    port: Number(import.meta.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: import.meta.env.SMTP_USER,
      pass: import.meta.env.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: import.meta.env.SMTP_FROM || import.meta.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });

  return info;
}
