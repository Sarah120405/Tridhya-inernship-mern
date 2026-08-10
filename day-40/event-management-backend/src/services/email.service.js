import nodemailer from "nodemailer";

let transporter;

async function getTransporter() {
  if (transporter) return transporter;

  const testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return transporter;
}

export async function sendingBookingConfirmation(
  toEmail,
  eventTitle,
  eventDate,
) {
  const transport = await getTransporter();
  const info = await transport.sendMail({
    from: '"Event Management" <no-reply@eventmanagement.com>',
    to: toEmail,
    subject: `Booking Confirmed: ${eventTitle}`,
    text: `Your booking for "${eventTitle}" on ${new Date(eventDate).toLocaleDateString()} is confirmed!`,
    html: `<p>Your booking for <strong>${eventTitle}</strong> on ${new Date(eventDate).toLocaleDateString()} is confirmed!</p>`,
  });

  console.log("Preview email at:", nodemailer.getTestMessageUrl(info));
}

export async function sendEventCancellationNotice(toEmail, eventTitle) {
  const transport = await getTransporter();

  const info = await transport.sendMail({
    from: '"Event Management" <no-reply@eventmanagement.com>',
    to: toEmail,
    subject: `Event Cancelled: ${eventTitle}`,
    text: `Unfortunately, "${eventTitle}" has been cancelled. Any bookings have been automatically removed.`,
    html: `<p>Unfortunately, <strong>${eventTitle}</strong> has been cancelled. Any bookings have been automatically removed.</p>`,
  });

  console.log("Preview email at:", nodemailer.getTestMessageUrl(info));
}
