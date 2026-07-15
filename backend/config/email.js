const nodemailer = require('nodemailer');

/**
 * Create Nodemailer transporter from .env settings.
 * If EMAIL_USER is not set, emails are skipped (returns null).
 */
function createTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email not configured (EMAIL_USER/EMAIL_PASS empty). Skipping mail.');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Send an email. Safe to call even when email is not configured.
 */
async function sendEmail({ to, subject, text, html }) {
  const transporter = createTransporter();
  if (!transporter) return { skipped: true };

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  });

  return { messageId: info.messageId };
}

module.exports = { sendEmail };
