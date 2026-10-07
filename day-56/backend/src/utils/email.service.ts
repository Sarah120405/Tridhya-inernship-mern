import { getTransporter } from "../config/mail.config";

export async function emailService(
  toEmail: string,
  subject: string,
  html: string,
) {
  const transporter = getTransporter();
  const mail = transporter.sendMail({
    from: `"Support Desk" <${process.env.SMTP_USER}>`, // sender address
    to: toEmail,
    subject: subject,
    html: html,
  });
}
