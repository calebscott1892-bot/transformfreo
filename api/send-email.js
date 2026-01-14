import { Resend } from 'resend';

const RATE_LIMIT_WINDOW_MS = 10 * 60_000;
const RATE_LIMIT_MAX_PER_WINDOW = 5;

// Best-effort in-memory rate limiter (per serverless instance)
const ipHits = new Map();

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length > 0) return fwd.split(',')[0].trim();
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.length > 0) return realIp.trim();
  return 'unknown';
}

function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length < 3 || trimmed.length > 254) return false;
  // Simple RFC5322-ish check (good enough for server-side validation)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function takeRateLimitToken(ip) {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry) {
    ipHits.set(ip, { windowStart: now, count: 1 });
    return { ok: true };
  }

  if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    ipHits.set(ip, { windowStart: now, count: 1 });
    return { ok: true };
  }

  if (entry.count >= RATE_LIMIT_MAX_PER_WINDOW) {
    return { ok: false, retryAfterMs: RATE_LIMIT_WINDOW_MS - (now - entry.windowStart) };
  }

  entry.count += 1;
  return { ok: true };
}

async function readJsonBody(req) {
  // Vercel often populates req.body, but handle raw streams too.
  if (req.body && typeof req.body === 'object') return req.body;

  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  return JSON.parse(raw);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { ok: false, error: 'Method Not Allowed' });
  }

  const ip = getClientIp(req);
  const rate = takeRateLimitToken(ip);
  if (!rate.ok) {
    res.setHeader('Retry-After', String(Math.ceil((rate.retryAfterMs ?? RATE_LIMIT_WINDOW_MS) / 1000)));
    return json(res, 429, { ok: false, error: 'Too many requests. Please try again shortly.' });
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return json(res, 400, { ok: false, error: 'Invalid JSON body' });
  }

  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const church = typeof body?.church === 'string' ? body.church.trim() : '';
  const message = typeof body?.message === 'string' ? body.message.trim() : '';
  const website = typeof body?.website === 'string' ? body.website.trim() : '';

  // Honeypot
  if (website) {
    return json(res, 200, { ok: true });
  }

  if (!name || name.length > 120) {
    return json(res, 400, { ok: false, error: 'Please provide your name.' });
  }

  if (!isValidEmail(email)) {
    return json(res, 400, { ok: false, error: 'Please provide a valid email address.' });
  }

  if (!message || message.length > 5000) {
    return json(res, 400, { ok: false, error: 'Please enter a message (max 5000 characters).' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return json(res, 500, { ok: false, error: 'Email service is not configured.' });
  }

  const to = process.env.CONTACT_TO_EMAIL || 'transformfreo@gmail.com';
  const from = process.env.CONTACT_FROM_EMAIL || 'Transform Fremantle <noreply@transformfreo.com>';
  const receivedAt = new Date().toISOString();

  const subject = `Contact Form: Message from ${name}`;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Church: ${church || 'Not provided'}`,
    `Received: ${receivedAt}`,
    '',
    'Message:',
    message
  ].join('\n');

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.5;">
      <h2>New message from the Transform Fremantle contact form</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Church:</strong> ${escapeHtml(church || 'Not provided')}</p>
      <p><strong>Received:</strong> ${escapeHtml(receivedAt)}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <pre style="white-space: pre-wrap; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New';">${escapeHtml(message)}</pre>
    </div>
  `;

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to,
      subject,
      text,
      html,
      replyTo: email
    });

    if (result?.data?.id) {
      console.log('send-email ok', { id: result.data.id });
    } else {
      console.log('send-email ok');
    }

    return json(res, 200, { ok: true });
  } catch (err) {
    // Avoid leaking provider internals; keep logs server-side.
    console.error('send-email failed', err);
    return json(res, 500, { ok: false, error: 'Email delivery failed. Please try again later.' });
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
