import express from 'express';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

dotenv.config();

const app = express();

// Raw body needed for webhook signature verification
app.use('/api/webhooks/razorpay', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));

// ─── SQLite database ──────────────────────────────────────────────────────────
const dataDir = join(process.cwd(), 'data');
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
const db = new Database(join(dataDir, 'app.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    phone       TEXT NOT NULL,
    email       TEXT NOT NULL DEFAULT '',
    service     TEXT NOT NULL DEFAULT '',
    page_url    TEXT NOT NULL DEFAULT '',
    time_spent  INTEGER NOT NULL DEFAULT 0,
    trigger_type TEXT NOT NULL DEFAULT '',
    created_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS analytics_events (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    event      TEXT NOT NULL,
    page_url   TEXT NOT NULL DEFAULT '',
    metadata   TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS orders (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    razorpay_order_id   TEXT NOT NULL UNIQUE,
    razorpay_payment_id TEXT NOT NULL DEFAULT '',
    name                TEXT NOT NULL,
    phone               TEXT NOT NULL,
    email               TEXT NOT NULL DEFAULT '',
    service_id          TEXT NOT NULL DEFAULT '',
    service_name        TEXT NOT NULL DEFAULT '',
    package_name        TEXT NOT NULL DEFAULT '',
    amount              INTEGER NOT NULL,
    currency            TEXT NOT NULL DEFAULT 'INR',
    status              TEXT NOT NULL DEFAULT 'created',
    created_at          TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// ─── Razorpay instance ────────────────────────────────────────────────────────
const razorpay =
  process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
    : null;

// ─── Content storage & admin auth ─────────────────────────────────────────────
const CONTENT_PATH = join(process.cwd(), 'data', 'content.json');
const adminTokens = new Set<string>();

function loadContent(): object {
  if (!existsSync(CONTENT_PATH)) return {};
  try {
    return JSON.parse(readFileSync(CONTENT_PATH, 'utf-8'));
  } catch {
    return {};
  }
}

function saveContent(data: object) {
  const dir = join(process.cwd(), 'data');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(CONTENT_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!process.env.ADMIN_PASSWORD) { next(); return; }
  const auth = req.headers.authorization;
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token || !adminTokens.has(token)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
}

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

// ─── /api/content (public) ────────────────────────────────────────────────────
app.get('/api/content', (_req, res) => {
  const content = loadContent();
  res.json(content);
});

// ─── /api/admin/login ──────────────────────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body as { password?: string };
  const expected = process.env.ADMIN_PASSWORD;
  if (expected && password !== expected) {
    res.status(401).json({ error: 'Invalid password' });
    return;
  }
  const token = `admin_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  adminTokens.add(token);
  res.json({ token });
});

// ─── /api/admin/content (protected) ────────────────────────────────────────────
app.get('/api/admin/content', authMiddleware, (_req, res) => {
  const content = loadContent();
  res.json(content);
});

app.put('/api/admin/content', authMiddleware, (req, res) => {
  const body = req.body;
  if (typeof body !== 'object' || body === null) {
    res.status(400).json({ error: 'Invalid body' });
    return;
  }
  saveContent(body);
  res.json({ success: true });
});

// ─── /api/leads (public — captures intent-based leads) ─────────────────────────
app.post('/api/leads', async (req, res) => {
  const { name, phone, email, service, pageUrl, timeSpent, triggerType } = req.body as {
    name: string;
    phone: string;
    email?: string;
    service?: string;
    pageUrl?: string;
    timeSpent?: number;
    triggerType?: string;
  };

  if (!name || !phone) {
    res.status(400).json({ error: 'Name and phone are required' });
    return;
  }

  try {
    const stmt = db.prepare(
      `INSERT INTO leads (name, phone, email, service, page_url, time_spent, trigger_type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    );
    const info = stmt.run(
      name,
      phone,
      email ?? '',
      service ?? '',
      pageUrl ?? '',
      timeSpent ?? 0,
      triggerType ?? ''
    );

    // Send notification email to business
    const svcLabel = service || 'GST Service (Lead Capture)';
    try {
      const notifyEmail = 'enquiry@mridhuvassociates.com';
      await sendEmail(
        notifyEmail,
        `New Lead: ${svcLabel} — ${name}`,
        leadNotificationHtml({ name, phone, email: email ?? '', service: svcLabel, pageUrl: pageUrl ?? '', timeSpent: timeSpent ?? 0 })
      );
    } catch (err) {
      console.error('Lead notification email error:', err);
    }

    // Track event
    db.prepare(`INSERT INTO analytics_events (event, page_url, metadata) VALUES (?, ?, ?)`)
      .run('lead_submitted', pageUrl ?? '', JSON.stringify({ name, service, triggerType }));

    res.json({ success: true, id: info.lastInsertRowid });
  } catch (err) {
    console.error('Lead save error:', err);
    res.status(500).json({ error: 'Failed to save lead' });
  }
});

// ─── /api/analytics (public — tracks events) ──────────────────────────────────
app.post('/api/analytics', (req, res) => {
  const { event, pageUrl, metadata } = req.body as {
    event: string;
    pageUrl?: string;
    metadata?: Record<string, unknown>;
  };
  if (!event) {
    res.status(400).json({ error: 'Event is required' });
    return;
  }
  try {
    db.prepare(`INSERT INTO analytics_events (event, page_url, metadata) VALUES (?, ?, ?)`)
      .run(event, pageUrl ?? '', JSON.stringify(metadata ?? {}));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to track event' });
  }
});

// ─── /api/admin/leads (protected) ──────────────────────────────────────────────
app.get('/api/admin/leads', authMiddleware, (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
  const offset = (page - 1) * limit;

  const total = (db.prepare('SELECT COUNT(*) as count FROM leads').get() as { count: number }).count;
  const leads = db.prepare('SELECT * FROM leads ORDER BY created_at DESC LIMIT ? OFFSET ?').all(limit, offset);

  res.json({ leads, total, page, limit });
});

app.delete('/api/admin/leads/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM leads WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ─── /api/admin/analytics (protected) ──────────────────────────────────────────
app.get('/api/admin/analytics', authMiddleware, (_req, res) => {
  const summary = db.prepare(`
    SELECT event, COUNT(*) as count FROM analytics_events
    WHERE created_at >= datetime('now', '-30 days')
    GROUP BY event ORDER BY count DESC
  `).all();
  const recent = db.prepare(
    `SELECT * FROM analytics_events ORDER BY created_at DESC LIMIT 100`
  ).all();
  res.json({ summary, recent });
});

// ─── /api/orders (Razorpay payments) ──────────────────────────────────────────
app.post('/api/orders/create', async (req, res) => {
  if (!razorpay) {
    res.status(503).json({ error: 'Payment gateway not configured' });
    return;
  }

  const { name, phone, email, serviceId, serviceName, packageName, amount } = req.body as {
    name: string;
    phone: string;
    email?: string;
    serviceId?: string;
    serviceName?: string;
    packageName?: string;
    amount: number;
  };

  if (!name || !phone || !amount || amount < 100) {
    res.status(400).json({ error: 'Name, phone, and valid amount (in paise) are required' });
    return;
  }

  try {
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        name,
        phone,
        email: email ?? '',
        service_id: serviceId ?? '',
        service_name: serviceName ?? '',
        package_name: packageName ?? '',
      },
    });

    db.prepare(
      `INSERT INTO orders (razorpay_order_id, name, phone, email, service_id, service_name, package_name, amount, currency, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      order.id,
      name,
      phone,
      email ?? '',
      serviceId ?? '',
      serviceName ?? '',
      packageName ?? '',
      amount,
      'INR',
      'created'
    );

    res.json({
      orderId: order.id,
      razorpayOrderId: order.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      amount,
      currency: 'INR',
    });
  } catch (err) {
    console.error('Razorpay order creation error:', err);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
});

app.post('/api/orders/verify', async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body as {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  };

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    res.status(400).json({ error: 'Missing payment verification fields' });
    return;
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    res.status(503).json({ error: 'Payment verification not configured' });
    return;
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    res.status(400).json({ error: 'Invalid payment signature' });
    return;
  }

  db.prepare(
    `UPDATE orders SET razorpay_payment_id = ?, status = 'paid' WHERE razorpay_order_id = ?`
  ).run(razorpayPaymentId, razorpayOrderId);

  const order = db.prepare('SELECT * FROM orders WHERE razorpay_order_id = ?').get(razorpayOrderId) as {
    name: string; phone: string; email: string; service_name: string;
    package_name: string; amount: number;
  } | undefined;

  if (order) {
    const amountStr = `₹${(order.amount / 100).toLocaleString('en-IN')}`;
    try {
      await sendEmail(
        order.email || businessEmail(),
        `Payment confirmed — ${order.service_name}`,
        paymentConfirmationHtml({
          name: order.name,
          serviceName: order.service_name,
          packageName: order.package_name,
          amount: amountStr,
          paymentId: razorpayPaymentId,
        })
      );
    } catch (err) {
      console.error('Payment confirmation email error:', err);
    }

    try {
      if (businessEmail()) {
        await sendEmail(
          businessEmail(),
          `Payment received — ${order.service_name} from ${order.name}`,
          paymentNotificationHtml({
            name: order.name,
            phone: order.phone,
            email: order.email,
            serviceName: order.service_name,
            packageName: order.package_name,
            amount: amountStr,
            paymentId: razorpayPaymentId,
          })
        );
      }
    } catch (err) {
      console.error('Payment notification email error:', err);
    }

    try {
      const userPhone = order.phone.trim().startsWith('+') ? order.phone.trim() : `+91${order.phone.replace(/\D/g, '')}`;
      await sendSms(
        userPhone,
        `Hi ${order.name}, payment of ${amountStr} for "${order.service_name} — ${order.package_name}" received. Ref: ${razorpayPaymentId}. Our team will begin processing shortly.`
      );
    } catch (err) {
      console.error('Payment SMS error:', err);
    }
  }

  res.json({ success: true, status: 'paid' });
});

// Razorpay webhook for backup payment verification
app.post('/api/webhooks/razorpay', (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    res.status(200).json({ ok: true });
    return;
  }

  const signature = req.headers['x-razorpay-signature'] as string;
  const body = typeof req.body === 'string' ? req.body : req.body.toString();

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    res.status(400).json({ error: 'Invalid webhook signature' });
    return;
  }

  try {
    const event = JSON.parse(body);
    if (event.event === 'payment.captured') {
      const payment = event.payload?.payment?.entity;
      if (payment?.order_id) {
        db.prepare(
          `UPDATE orders SET razorpay_payment_id = ?, status = 'paid' WHERE razorpay_order_id = ? AND status != 'paid'`
        ).run(payment.id, payment.order_id);
      }
    }
  } catch (err) {
    console.error('Webhook processing error:', err);
  }

  res.status(200).json({ ok: true });
});

// ─── /api/admin/orders (protected) ────────────────────────────────────────────
app.get('/api/admin/orders', authMiddleware, (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 50));
  const offset = (page - 1) * limit;

  const total = (db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number }).count;
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?').all(limit, offset);

  res.json({ orders, total, page, limit });
});

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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server running at http://0.0.0.0:${PORT}`);
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

function leadNotificationHtml(p: {
  name: string;
  phone: string;
  email: string;
  service: string;
  pageUrl: string;
  timeSpent: number;
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
    .header { background: linear-gradient(135deg, #059669 0%, #0D9488 100%); padding: 28px 36px; }
    .header h1 { margin: 0; color: #F9FAFB; font-size: 18px; font-weight: 700; }
    .header p { margin: 4px 0 0; color: #D1FAE5; font-size: 13px; }
    .body { padding: 32px 36px; }
    .field { margin-bottom: 16px; }
    .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9CA3AF; margin-bottom: 4px; }
    .value { font-size: 15px; color: #111827; font-weight: 500; }
    .service-badge { display: inline-block; background: #D1FAE5; color: #065F46; border-radius: 6px; padding: 6px 14px; font-size: 14px; font-weight: 700; }
    hr { border: none; border-top: 1px solid #E5E7EB; margin: 24px 0; }
    .meta { font-size: 12px; color: #9CA3AF; margin-top: 16px; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>New Lead Captured — ${brand}</h1>
    <p>A visitor showed intent and submitted their contact details.</p>
  </div>
  <div class="body">
    <div class="field">
      <div class="label">Service Interest</div>
      <div class="service-badge">${p.service}</div>
    </div>
    <hr />
    <div class="field">
      <div class="label">Name</div>
      <div class="value">${p.name}</div>
    </div>
    <div class="field">
      <div class="label">Phone</div>
      <div class="value"><a href="tel:${p.phone}" style="color:#059669">${p.phone}</a></div>
    </div>
    ${p.email ? `<div class="field"><div class="label">Email</div><div class="value"><a href="mailto:${p.email}" style="color:#059669">${p.email}</a></div></div>` : ''}
    <hr />
    <div class="meta">
      Page: ${p.pageUrl}<br />
      Time on page: ${p.timeSpent}s
    </div>
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

function paymentConfirmationHtml(p: {
  name: string; serviceName: string; packageName: string; amount: string; paymentId: string;
}): string {
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
    .header { background: linear-gradient(135deg, #059669 0%, #0D9488 100%); padding: 36px 40px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; }
    .header p { margin: 8px 0 0; color: #D1FAE5; font-size: 14px; }
    .body { padding: 36px 40px; }
    .body p { margin: 0 0 16px; font-size: 15px; color: #374151; line-height: 1.65; }
    .detail { background: #F0FDF4; border-radius: 8px; padding: 20px 24px; margin: 24px 0; }
    .detail .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .detail .label { font-size: 13px; color: #6B7280; }
    .detail .val { font-size: 13px; color: #111827; font-weight: 600; }
    .footer { padding: 24px 40px; background: #F9FAFB; border-top: 1px solid #E5E7EB; }
    .footer p { margin: 0; font-size: 12px; color: #9CA3AF; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>Payment Confirmed</h1>
    <p>${brand}</p>
  </div>
  <div class="body">
    <p>Hi <strong>${p.name}</strong>,</p>
    <p>Your payment has been received successfully. Here are the details:</p>
    <div class="detail">
      <div class="row"><span class="label">Service</span><span class="val">${p.serviceName}</span></div>
      <div class="row"><span class="label">Package</span><span class="val">${p.packageName}</span></div>
      <div class="row"><span class="label">Amount</span><span class="val">${p.amount}</span></div>
      <div class="row"><span class="label">Payment ID</span><span class="val">${p.paymentId}</span></div>
    </div>
    <p>Our team will begin processing your request within <strong>24 business hours</strong>. You will receive updates via email and SMS.</p>
    <p>Best regards,<br /><strong>The ${brand} Team</strong></p>
  </div>
  <div class="footer">
    <p>If you have questions, reply to this email or call us during business hours.</p>
  </div>
</div>
</body>
</html>
`;
}

function paymentNotificationHtml(p: {
  name: string; phone: string; email: string; serviceName: string;
  packageName: string; amount: string; paymentId: string;
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
    .header { background: #059669; padding: 28px 36px; }
    .header h1 { margin: 0; color: #F9FAFB; font-size: 18px; font-weight: 700; }
    .header p { margin: 4px 0 0; color: #D1FAE5; font-size: 13px; }
    .body { padding: 32px 36px; }
    .field { margin-bottom: 14px; }
    .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #9CA3AF; margin-bottom: 4px; }
    .value { font-size: 15px; color: #111827; font-weight: 500; }
    .badge { display: inline-block; background: #D1FAE5; color: #065F46; border-radius: 6px; padding: 6px 14px; font-size: 14px; font-weight: 700; }
    hr { border: none; border-top: 1px solid #E5E7EB; margin: 20px 0; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>Payment Received — ${brand}</h1>
    <p>A customer completed payment on your website.</p>
  </div>
  <div class="body">
    <div class="field"><div class="label">Service</div><div class="badge">${p.serviceName} — ${p.packageName}</div></div>
    <div class="field"><div class="label">Amount</div><div class="value" style="font-size:20px">${p.amount}</div></div>
    <hr />
    <div class="field"><div class="label">Name</div><div class="value">${p.name}</div></div>
    <div class="field"><div class="label">Phone</div><div class="value"><a href="tel:${p.phone}" style="color:#059669">${p.phone}</a></div></div>
    ${p.email ? `<div class="field"><div class="label">Email</div><div class="value"><a href="mailto:${p.email}" style="color:#059669">${p.email}</a></div></div>` : ''}
    <hr />
    <div class="field"><div class="label">Payment ID</div><div class="value" style="font-size:13px;color:#6B7280">${p.paymentId}</div></div>
  </div>
</div>
</body>
</html>
`;
}
