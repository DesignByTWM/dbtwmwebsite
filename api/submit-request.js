// Vercel Serverless Function: /api/submit-request
// Receives the "Coming Soon" lead form and sends it via Resend.
//
// Required environment variables (set in Vercel Project Settings → Environment Variables):
//   RESEND_API_KEY   - Your Resend API key (starts with "re_")
//   RESEND_FROM      - A verified sender on your Resend domain, e.g. "Design By TWM <noreply@designbytwm.com>"
//   RESEND_TO        - The inbox that should receive leads, e.g. "info@designbytwm.com"
//
// Install dependency before deploying:
//   npm install resend

const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone, email, vehicle, service, message } = req.body || {};

    // Basic server-side validation (mirrors the client-side check)
    if (!name || !phone || !email || !service) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM;
    const to = process.env.RESEND_TO;

    if (!apiKey || !from || !to) {
      console.error('Missing Resend configuration (RESEND_API_KEY / RESEND_FROM / RESEND_TO)');
      return res.status(500).json({ error: 'Server not configured' });
    }

    const resend = new Resend(apiKey);

    const safe = (v) => (v ? String(v).replace(/</g, '&lt;').replace(/>/g, '&gt;') : '');

    const html = `
      <h2 style="font-family:sans-serif;">New Coming Soon Request — Design By TWM</h2>
      <table style="font-family:sans-serif; font-size:14px; border-collapse:collapse;">
        <tr><td style="padding:6px 12px 6px 0;"><strong>Name</strong></td><td>${safe(name)}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;"><strong>Phone</strong></td><td>${safe(phone)}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;"><strong>Email</strong></td><td>${safe(email)}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;"><strong>Vehicle</strong></td><td>${safe(vehicle) || '—'}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;"><strong>Service Needed</strong></td><td>${safe(service)}</td></tr>
        <tr><td style="padding:6px 12px 6px 0; vertical-align:top;"><strong>Message</strong></td><td>${safe(message) || '—'}</td></tr>
      </table>
    `;

    await resend.emails.send({
      from,
      to,
      reply_to: email,
      subject: `New Request: ${name} — ${service}`,
      html
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('submit-request error:', err);
    return res.status(500).json({ error: 'Failed to send request' });
  }
};
