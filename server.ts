import express from 'express';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// ─── Nodemailer transport ─────────────────────────────────────────────────────
// Uses SMTP credentials from .env. Works with Gmail, Outlook, Zoho, etc.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ─── Twilio SMS client ────────────────────────────────────────────────────────
const twilioClient =
  process.env.TWILIO_SID && process.env.TWILIO_TOKEN
    ? twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
    : null;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function businessEmail(): string {
  return process.env.BUSINESS_EMAIL ?? '';
}

function businessPhone(): string {
  return process.env.BUSINESS_PHONE ?? '';
}

function twilioFrom(): string {
  return process.env.TWILIO_FROM ?? '';
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.SMTP_USER) return;
  await transporter.sendMail({
    from: `"${process.env.BUSINESS_NAME ?? 'YourBrand'}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}

async function sendSms(to: string, body: string) {
  if (!twilioClient || !twilioFrom()) return;
  await twilioClient.messages.create({ from: twilioFrom(), to, body });
}

// ─── /api/enquiry ─────────────────────────────────────────────────────────────
app.post('/api/enquiry', async (req, res) => {
  const { name, email, phone, serviceId, serviceName } = req.body as {
    name: string;
    email: string;
    phone: string;
    serviceId: string;
    serviceName: string;
  };

  if (!name || !email || !phone || !serviceName) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const errors: string[] = [];

  // ── 1. Confirmation email to the user ─────────────────────────────────────
  try {
    await sendEmail(
      email,
      `Thank you for reaching out — ${serviceName}`,
      userConfirmationHtml({ name, serviceName })
    );
  } catch (err) {
    console.error('User email error:', err);
    errors.push('user_email');
  }

  // ── 2. Notification email to business ─────────────────────────────────────
  try {
    if (businessEmail()) {
      await sendEmail(
        businessEmail(),
        `New enquiry: ${serviceName} — from ${name}`,
        businessNotificationHtml({ name, email, phone, serviceName, serviceId })
      );
    }
  } catch (err) {
    console.error('Business email error:', err);
    errors.push('business_email');
  }

  // ── 3. SMS confirmation to the user ───────────────────────────────────────
  try {
    const userPhone = phone.trim().startsWith('+') ? phone.trim() : `+91${phone.replace(/\D/g, '')}`;
    await sendSms(
      userPhone,
      `Hi ${name}, thank you for enquiring about "${serviceName}" with ${process.env.BUSINESS_NAME ?? 'YourBrand'}. Our team will contact you shortly.`
    );
  } catch (err) {
    console.error('User SMS error:', err);
    errors.push('user_sms');
  }

  // ── 4. SMS notification to business ───────────────────────────────────────
  try {
    if (businessPhone()) {
      await sendSms(
        businessPhone(),
        `New enquiry for "${serviceName}" from ${name} (${phone}, ${email}).`
      );
    }
  } catch (err) {
    console.error('Business SMS error:', err);
    errors.push('business_sms');
  }

  res.json({
    success: true,
    partialErrors: errors.length ? errors : undefined,
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = Number(process.env.SERVER_PORT ?? 4000);
app.listen(PORT, '127.0.0.1', () => {
  console.log(`API server running at http://127.0.0.1:${PORT}`);
});

// ─── Email templates ──────────────────────────────────────────────────────────
function userConfirmationHtml(p: { name: string; serviceName: string }): string {
  const brand = process.env.BUSINESS_NAME ?? 'YourBrand';
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <style>
    body { margin: 0; padding: 0; background: #f6f8fc; font-family: 'Helvetica Neue', Arial, sans-serif; }
    .wrapper { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%); padding: 36px 40px; }
    .header h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
    .body { padding: 36px 40px; }
    .body p { margin: 0 0 16px; font-size: 15px; color: #374151; line-height: 1.65; }
    .pill { display: inline-block; background: #EDE9FE; color: #6D28D9; border-radius: 999px; padding: 4px 14px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }
    .steps { background: #F9FAFB; border-radius: 8px; padding: 20px 24px; margin: 24px 0; }
    .steps p { margin: 0 0 6px; font-size: 14px; color: #6B7280; }
    .steps ul { margin: 8px 0 0; padding: 0 0 0 18px; }
    .steps li { font-size: 14px; color: #374151; margin-bottom: 6px; }
    .footer { padding: 24px 40px; background: #F9FAFB; border-top: 1px solid #E5E7EB; }
    .footer p { margin: 0; font-size: 12px; color: #9CA3AF; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>${brand}</h1>
  </div>
  <div class="body">
    <p>Hi <strong>${p.name}</strong>,</p>
    <p>Thank you for your interest! We have received your enquiry for:</p>
    <div class="pill">${p.serviceName}</div>
    <p>Our team will review your request and get back to you within <strong>24 business hours</strong>.</p>
    <div class="steps">
      <p><strong>What happens next?</strong></p>
      <ul>
        <li>Our expert will call/email you to understand your requirements</li>
        <li>We will share a customised document checklist</li>
        <li>Once documents are ready, we begin the process on your behalf</li>
        <li>You get regular updates until the service is completed</li>
      </ul>
    </div>
    <p>If you have any questions in the meantime, simply reply to this email.</p>
    <p>Best regards,<br /><strong>The ${brand} Team</strong></p>
  </div>
  <div class="footer">
    <p>You received this because you submitted an enquiry on our website. If this wasn't you, please ignore this email.</p>
  </div>
</div>
</body>
</html>
`;
}

function businessNotificationHtml(p: {
  name: string;
  email: string;
  phone: string;
  serviceName: string;
  serviceId: string;
}): string {
  const brand = process.env.BUSINESS_NAME ?? 'YourBrand';
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { margin: 0; padding: 0; background: #f6f8fc; font-family: 'Helvetica Neue', Arial, sans-serif; }
    .wrapper { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: #111827; padding: 28px 36px; }
    .header h1 { margin: 0; color: #F9FAFB; font-size: 18px; font-weight: 700; }
    .header p { margin: 4px 0 0; color: #9CA3AF; font-size: 13px; }
    .body { padding: 32px 36px; }
    .field { margin-bottom: 16px; }
    .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9CA3AF; margin-bottom: 4px; }
    .value { font-size: 15px; color: #111827; font-weight: 500; }
    .service-badge { display: inline-block; background: #DBEAFE; color: #1D4ED8; border-radius: 6px; padding: 6px 14px; font-size: 14px; font-weight: 700; }
    hr { border: none; border-top: 1px solid #E5E7EB; margin: 24px 0; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>New Service Enquiry — ${brand}</h1>
    <p>A user just submitted the enquiry form on your website.</p>
  </div>
  <div class="body">
    <div class="field">
      <div class="label">Service Requested</div>
      <div class="service-badge">${p.serviceName}</div>
    </div>
    <hr />
    <div class="field">
      <div class="label">Name</div>
      <div class="value">${p.name}</div>
    </div>
    <div class="field">
      <div class="label">Email</div>
      <div class="value"><a href="mailto:${p.email}" style="color:#2563EB">${p.email}</a></div>
    </div>
    <div class="field">
      <div class="label">Phone</div>
      <div class="value"><a href="tel:${p.phone}" style="color:#2563EB">${p.phone}</a></div>
    </div>
    <hr />
    <div class="field">
      <div class="label">Service ID</div>
      <div class="value" style="color:#6B7280;font-size:13px">${p.serviceId}</div>
    </div>
  </div>
</div>
</body>
</html>
`;
}
