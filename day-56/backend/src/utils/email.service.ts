import { getTransporter } from "../config/mail.config";
import nodemailer from "nodemailer";

export async function emailService(
  toEmail: string,
  subject: string,
  html: string,
) {
  const transporter = await getTransporter();
  const mail = await transporter.sendMail({
    from: '"Support Desk" <no-reply@supportdesk.com>',
    to: toEmail,
    subject: subject,
    html: html,
  });
  console.log("Preview email at:", nodemailer.getTestMessageUrl(mail));
}
