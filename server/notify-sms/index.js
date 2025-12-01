// Simple Express server to receive order notifications and send SMS via Resend
// Usage: set environment variables RESEND_API_KEY, ADMIN_PHONE, RESEND_FROM (optional)

require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '256kb' }));

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const ADMIN_PHONE = process.env.ADMIN_PHONE || ''; // E.164 format, e.g. +5511999999999
const RESEND_FROM = process.env.RESEND_FROM || ''; // optional sender id/phone

// Vonage (optional fallback)
const VONAGE_API_KEY = process.env.VONAGE_API_KEY || '';
const VONAGE_API_SECRET = process.env.VONAGE_API_SECRET || '';
const VONAGE_FROM = process.env.VONAGE_FROM || 'Vonage APIs';
// Email / SMTP config
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || ''; // admin email to receive order details
const EMAIL_FROM = process.env.EMAIL_FROM || `no-reply@${process.env.DOMAIN || 'example.com'}`;
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = process.env.SMTP_PORT || '';
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Basic CORS for local testing (adjust for production)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json({ limit: '256kb' }));

// Environment
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const ADMIN_PHONE = process.env.ADMIN_PHONE || ''; // E.164
const RESEND_FROM = process.env.RESEND_FROM || '';

const VONAGE_API_KEY = process.env.VONAGE_API_KEY || '';
const VONAGE_API_SECRET = process.env.VONAGE_API_SECRET || '';
const VONAGE_FROM = process.env.VONAGE_FROM || 'Vonage APIs';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
const EMAIL_FROM = process.env.EMAIL_FROM || `no-reply@${process.env.DOMAIN || 'example.com'}`;
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = process.env.SMTP_PORT || '';
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';

const nodemailer = require('nodemailer');
let resendClient = null;
if (RESEND_API_KEY) {
  try {
    const { Resend } = require('resend');
    resendClient = new Resend(RESEND_API_KEY);
    console.log('[init] Resend SDK initialized');
  } catch (e) {
    console.warn('[init] Could not initialize Resend SDK:', e && e.message ? e.message : e);
    resendClient = null;
  }
}

// single helper to send SMS (Resend HTTP (if available) -> Vonage SDK fallback)
async function sendSmsMessage({ toNumber, messageText }) {
  const to = (toNumber || ADMIN_PHONE || '').toString().replace(/[^0-9+]/g, '');
  const text = (messageText || '').toString();
  console.log('[sendSms] to:', to, 'text_len:', text.length);

  // Try Resend SMS via HTTP (Resend SDK currently focuses on email; keep HTTP pattern for SMS)
  if (RESEND_API_KEY) {
    try {
      const resendUrl = 'https://api.resend.com/sms';
      const body = { to, message: text };
      if (RESEND_FROM) body.from = RESEND_FROM;
      const resp = await fetch(resendUrl, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const textResp = await resp.text().catch(() => '');
      console.log('[sendSms] Resend SMS status:', resp.status, 'body:', (textResp && textResp.slice) ? textResp.slice(0,2000) : textResp);
      if (resp.ok) return { ok: true, provider: 'resend', result: tryParseJson(textResp) };
    } catch (err) {
      console.error('[sendSms] Resend SMS error:', err && err.message ? err.message : err);
    }
  }

  // Try Vonage
  if (VONAGE_API_KEY && VONAGE_API_SECRET) {
    try {
      const { Vonage } = require('@vonage/server-sdk');
      const vonage = new Vonage({ apiKey: VONAGE_API_KEY, apiSecret: VONAGE_API_SECRET });
      const from = VONAGE_FROM || 'Vonage APIs';
      const response = await vonage.sms.send({ to, from, text });
      console.log('[sendSms] Vonage response:', JSON.stringify(response).slice(0,2000));
      return { ok: true, provider: 'vonage', result: response };
    } catch (err) {
      console.error('[sendSms] Vonage error:', err && err.message ? err.message : err);
      return { ok: false, error: 'vonage_failed', detail: err && err.message ? err.message : String(err) };
    }
  }

  return { ok: false, error: 'no_sms_provider_configured' };
}

// Try to send order email using Resend SDK (preferred) then SMTP fallback
async function sendOrderEmail(order) {
  if (!ADMIN_EMAIL) return { ok: false, error: 'no_admin_email' };
  const subject = `Novo pedido ${order.id} - R$ ${Number(order.total || order.subtotal || 0).toFixed(2)}`;
  const customer = order.customer || {};
  const items = Array.isArray(order.items) ? order.items : [];

  const itemsHtml = items.map(i => `
    <tr>
      <td style="padding:6px;border:1px solid #ddd">${escapeHtml(i.name || i.title || 'Item')}</td>
      <td style="padding:6px;border:1px solid #ddd">${Number(i.quantity || 1)}</td>
      <td style="padding:6px;border:1px solid #ddd">R$ ${Number(i.price || 0).toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <h2>Novo pedido ${escapeHtml(order.id)}</h2>
    <p><strong>Cliente:</strong> ${escapeHtml(customer.name || '—')} — ${escapeHtml(customer.email || '—')} — ${escapeHtml(customer.phone || '—')}</p>
    <p><strong>Total:</strong> R$ ${Number(order.total || order.subtotal || 0).toFixed(2)}</p>
    <table style="border-collapse:collapse;width:100%;max-width:600px">
      <thead><tr><th style="text-align:left;padding:6px;border:1px solid #ddd">Produto</th><th style="padding:6px;border:1px solid #ddd">Qtd</th><th style="padding:6px;border:1px solid #ddd">Preço</th></tr></thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>
    <h4>Dados completos (JSON)</h4>
    <pre style="white-space:pre-wrap;background:#f6f8fa;padding:8px;border-radius:6px">${escapeHtml(JSON.stringify(order, null, 2))}</pre>
  `;

  // Use Resend SDK if available
  if (resendClient) {
    try {
      console.log('[sendOrderEmail] sending via Resend SDK to', ADMIN_EMAIL);
      const resp = await resendClient.emails.send({ from: EMAIL_FROM, to: Array.isArray(ADMIN_EMAIL) ? ADMIN_EMAIL : [ADMIN_EMAIL], subject, html });
      console.log('[sendOrderEmail] Resend SDK response:', resp);
      return { ok: true, provider: 'resend', result: resp };
    } catch (err) {
      console.error('[sendOrderEmail] Resend SDK error:', err && err.message ? err.message : err);
      // fallthrough to SMTP
    }
  }

  // SMTP fallback
  if (SMTP_HOST && SMTP_USER) {
    try {
      const portNum = Number(SMTP_PORT) || (SMTP_HOST.includes('gmail') ? 465 : 587);
      const transporter = nodemailer.createTransport({ host: SMTP_HOST, port: portNum, secure: portNum === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } });
      const info = await transporter.sendMail({ from: EMAIL_FROM, to: ADMIN_EMAIL, subject, html });
      console.log('[sendOrderEmail] sent via SMTP:', info && (info.messageId || info.response) ? (info.messageId || info.response) : info);
      return { ok: true, provider: 'smtp', result: { messageId: info.messageId || null, response: info.response || null } };
    } catch (err) {
      console.error('[sendOrderEmail] SMTP error:', err && err.message ? err.message : err);
      return { ok: false, error: 'smtp_failed', detail: err && err.message ? err.message : String(err) };
    }
  }

  return { ok: false, error: 'no_email_provider_configured' };
}

// send product-specific email
async function sendProductEmail(item, order, toAddress) {
  if (!toAddress) return { ok: false, error: 'no_to_address' };
  const subject = `Pedido ${order.id} - ${item.name || item.title || item.productName || item.id || 'produto'}`;
  const qty = Number(item.quantity || 1);
  const price = Number(item.price || item.unitPrice || 0).toFixed(2);
  const html = `
    <h3>Pedido ${escapeHtml(order.id)} - Produto ${escapeHtml(item.name || item.title || item.productName || item.id || 'produto')}</h3>
    <p><strong>Cliente:</strong> ${escapeHtml((order.customer && order.customer.name) || '—')} — ${escapeHtml((order.customer && order.customer.email) || '—')}</p>
    <p><strong>Quantidade:</strong> ${qty}</p>
    <p><strong>Preço unitário:</strong> R$ ${price}</p>
    <p><strong>Total do pedido:</strong> R$ ${Number(order.total || order.subtotal || 0).toFixed(2)}</p>
    <pre style="white-space:pre-wrap;background:#f6f8fa;padding:8px;border-radius:6px">${escapeHtml(JSON.stringify({ orderId: order.id, item, customer: order.customer }, null, 2))}</pre>
  `;

  if (resendClient) {
    try {
      const resp = await resendClient.emails.send({ from: EMAIL_FROM, to: Array.isArray(toAddress) ? toAddress : [toAddress], subject, html });
      return { ok: true, provider: 'resend', result: resp };
    } catch (err) {
      console.error('[sendProductEmail] Resend SDK error:', err && err.message ? err.message : err);
    }
  }

  if (SMTP_HOST && SMTP_USER) {
    try {
      const portNum = Number(SMTP_PORT) || (SMTP_HOST.includes('gmail') ? 465 : 587);
      const transporter = nodemailer.createTransport({ host: SMTP_HOST, port: portNum, secure: portNum === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } });
      const info = await transporter.sendMail({ from: EMAIL_FROM, to: toAddress, subject, html });
      return { ok: true, provider: 'smtp', result: { messageId: info.messageId || null, response: info.response || null } };
    } catch (err) {
      console.error('[sendProductEmail] SMTP error:', err && err.message ? err.message : err);
      return { ok: false, error: 'smtp_failed', detail: err && err.message ? err.message : String(err) };
    }
  }

  return { ok: false, error: 'no_email_provider_configured' };
}

// Utility
function tryParseJson(str) { try { return JSON.parse(str); } catch(e) { return str; } }
function escapeHtml(s) { if (!s && s !== 0) return ''; return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c]); }

// Routes
app.post('/api/notify-sms', async (req, res) => {
  try {
    const payload = req.body || {};
    const order = payload.order || {};
    if (!order || !order.id) return res.status(400).json({ error: 'Invalid payload: missing order.id' });

    console.log('[/api/notify-sms] received order id:', order.id);

    const customerName = (order.customer && order.customer.name) ? order.customer.name : 'Cliente';
    const total = (typeof order.total !== 'undefined') ? order.total : order.subtotal || 0;
    const items = Array.isArray(order.items) ? order.items : [];

    const itemsSummary = items.slice(0, 4).map(i => {
      const qty = Number(i.quantity || 1);
      const name = (i.name || i.title || i.productName || '').toString().trim();
      return name ? `${name}${qty>1? ` x${qty}` : ''}` : null;
    }).filter(Boolean).join(' | ');

    const itemsCount = items.length;
    let text = `Novo pedido ${order.id} • ${customerName} • R$ ${Number(total).toFixed(2)} • ${itemsCount} item${itemsCount!==1? 's':''}`;
    if (itemsSummary) text += ` • ${itemsSummary}`;
    if (text.length > 320) text = text.slice(0, 317) + '...';

    const emailResult = await sendOrderEmail(order).catch(err => ({ ok:false, error:'email_error', detail: String(err) }));

    // product-specific
    const productEmailResults = [];
    const itemsWithEmails = items.filter(i => i && (i.notifyEmail || i.supplierEmail || i.email));
    for (const it of itemsWithEmails) {
      const to = it.notifyEmail || it.supplierEmail || it.email;
      const r = await sendProductEmail(it, order, to).catch(err => ({ ok:false, error: String(err) }));
      productEmailResults.push({ item: it.name || it.title || it.productName || it.id || 'item', to, result: r });
    }

    const smsResult = await sendSmsMessage({ toNumber: ADMIN_PHONE, messageText: text }).catch(err => ({ ok:false, error: String(err) }));

    const responseBody = { sms: smsResult, email: emailResult, productEmails: productEmailResults };
    if ((smsResult && smsResult.ok) || (emailResult && emailResult.ok) || productEmailResults.some(p=>p.result && p.result.ok)) return res.json(responseBody);
    return res.status(502).json(responseBody);
  } catch (err) {
    console.error('[/api/notify-sms] error:', err && err.message ? err.message : err);
    res.status(500).json({ ok:false, error: String(err) });
  }
});

app.get('/api/test-email', async (req, res) => {
  try {
    if (!ADMIN_EMAIL) return res.status(400).json({ ok: false, error: 'ADMIN_EMAIL not configured' });
    const sampleOrder = { id: 'TEST-' + Date.now(), customer: { name: 'Teste', email: 'teste@example.com', phone: '+000000000' }, items: [{ name: 'Produto X', quantity: 2, price: 10 }], total: 20, createdAt: new Date().toISOString() };
    const r = await sendOrderEmail(sampleOrder);
    if (r && r.ok) return res.json({ ok:true, result: r });
    return res.status(502).json(r);
  } catch (err) {
    console.error('[/api/test-email] error:', err && err.message ? err.message : err);
    res.status(500).json({ ok:false, error: String(err) });
  }
});

app.get('/api/test-sms', async (req, res) => {
  try {
    const message = 'Mensagem de teste: se você recebeu este SMS, a integração está funcionando.';
    const result = await sendSmsMessage({ toNumber: ADMIN_PHONE, messageText: message });
    if (result && result.ok) return res.json({ ok:true, provider: result.provider, result: result.result });
    return res.status(502).json(result);
  } catch (err) {
    console.error('[/api/test-sms] error:', err && err.message ? err.message : err);
    res.status(500).json({ ok:false, error: String(err) });
  }
});

app.get('/api/test-sms-to', async (req, res) => {
  try {
    const { number, text } = req.query || {};
    if (!number) return res.status(400).json({ ok:false, error: 'missing_number' });
    const message = (text && text.toString()) || 'Mensagem de teste via API';
    const result = await sendSmsMessage({ toNumber: number, messageText: message });
    if (result && result.ok) return res.json({ ok:true, provider: result.provider, result: result.result });
    return res.status(502).json(result);
  } catch (err) {
    console.error('[/api/test-sms-to] error:', err && err.message ? err.message : err);
    res.status(500).json({ ok:false, error: String(err) });
  }
});

app.get('/health', (req, res) => res.send('ok'));

// Diagnostic endpoint (no secrets) - helps debug local setup
app.get('/api/diag', (req, res) => {
  try {
    const info = {
      ok: true,
      port: process.env.PORT || 3000,
      providers: {
        resendConfigured: !!RESEND_API_KEY,
        resendSdkInitialized: !!resendClient,
        smtpConfigured: !!(SMTP_HOST && SMTP_USER),
        vonageConfigured: !!(VONAGE_API_KEY && VONAGE_API_SECRET),
      },
      admin: {
        hasAdminEmail: !!ADMIN_EMAIL,
        hasAdminPhone: !!ADMIN_PHONE
      },
      nodeVersion: process.version,
      now: new Date().toISOString()
    };
    return res.json(info);
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

app.listen(port, () => console.log(`notify-sms server listening on port ${port}`));
        ${itemsHtml}
      </tbody>
    </table>
    <h4>Dados completos (JSON)</h4>
    <pre style="white-space:pre-wrap;background:#f6f8fa;padding:8px;border-radius:6px">${JSON.stringify(order, null, 2)}</pre>
  `;

  // If RESEND_API_KEY is available, try Resend Email API first (preferred when using Resend)
  if (RESEND_API_KEY) {
    try {
      const resendUrl = 'https://api.resend.com/emails';
      const body = {
        from: EMAIL_FROM,
        to: Array.isArray(ADMIN_EMAIL) ? ADMIN_EMAIL : [ADMIN_EMAIL],
        subject,
        html
      };
      console.log('[sendOrderEmail] Sending via Resend API (masked keys).');
      const resp = await fetch(resendUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const respText = await resp.text().catch(() => '');
      console.log('[sendOrderEmail] Resend response status:', resp.status);
      console.log('[sendOrderEmail] Resend response body (truncated):', (respText && respText.slice) ? respText.slice(0,2000) : respText);
      if (resp.ok) {
        try { return { ok: true, provider: 'resend', result: JSON.parse(respText || '{}') }; } catch(e) { return { ok:true, provider:'resend', result: respText }; }
      }
      // If Resend returned non-OK, continue to attempt SMTP as fallback
      console.warn('[sendOrderEmail] Resend API returned non-OK, falling back to SMTP if configured.');
    } catch (err) {
      console.error('[sendOrderEmail] Resend API error', err && err.message ? err.message : err);
      // continue to SMTP fallback
    }
  }

  // Fallback to SMTP (nodemailer) if configured
  if (SMTP_HOST && SMTP_USER) {
    try {
      const portNum = Number(SMTP_PORT) || (SMTP_PORT ? Number(SMTP_PORT) : (SMTP_HOST.includes('gmail') ? 465 : 587));
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: portNum,
        secure: portNum === 465,
        auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
      });
      const info = await transporter.sendMail({ from: EMAIL_FROM, to: ADMIN_EMAIL, subject, html });
      console.log('[sendOrderEmail] email sent via SMTP:', info && (info.messageId || info.response) ? (info.messageId || info.response) : info);
      return { ok: true, provider: 'smtp', result: { messageId: info.messageId || null, response: info.response || null } };
    } catch (err) {
      console.error('[sendOrderEmail] SMTP sendMail error', err && err.message ? err.message : err);
      return { ok: false, error: 'smtp_send_failed', detail: err && err.message ? err.message : String(err) };
    }
  }

  return { ok: false, error: 'no_email_provider_configured' };
}

// sendProductEmail: envia email específico sobre um item do pedido para o fornecedor/contato do produto
async function sendProductEmail(item, order, toAddress) {
  if (!toAddress) return { ok: false, error: 'no_to_address' };
  const subject = `Pedido ${order.id} - Pedido do produto ${(item.name||item.title||item.productName||item.id||'produto')}`;
  const qty = Number(item.quantity || 1);
  const price = Number(item.price || item.unitPrice || 0).toFixed(2);
  const html = `
    <h3>Pedido ${order.id} - Produto ${(item.name||item.title||item.productName||item.id||'produto')}</h3>
    <p><strong>Cliente:</strong> ${(order.customer && order.customer.name) || '—'} — ${(order.customer && order.customer.email) || '—'}</p>
    <p><strong>Quantidade:</strong> ${qty}</p>
    <p><strong>Preço unitário:</strong> R$ ${price}</p>
    <p><strong>Total do pedido:</strong> R$ ${Number(order.total || order.subtotal || 0).toFixed(2)}</p>
    <pre style="white-space:pre-wrap;background:#f6f8fa;padding:8px;border-radius:6px">${JSON.stringify({ orderId: order.id, item, customer: order.customer }, null, 2)}</pre>
  `;

  // Try Resend first
  if (RESEND_API_KEY) {
    try {
      const resendUrl = 'https://api.resend.com/emails';
      const body = { from: EMAIL_FROM, to: Array.isArray(toAddress)? toAddress : [toAddress], subject, html };
      const resp = await fetch(resendUrl, { method: 'POST', headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const respText = await resp.text().catch(()=>'');
      if (resp.ok) { try { return { ok:true, provider:'resend', result: JSON.parse(respText || '{}') } } catch(e){ return { ok:true, provider:'resend', result: respText } } }
      console.warn('[sendProductEmail] Resend non-OK:', resp.status, respText);
    } catch (err) {
      console.error('[sendProductEmail] Resend error', err && err.message ? err.message : err);
    }
  }

  // Fallback SMTP
  if (SMTP_HOST && SMTP_USER) {
    try {
      const portNum = Number(SMTP_PORT) || (SMTP_PORT ? Number(SMTP_PORT) : (SMTP_HOST.includes('gmail') ? 465 : 587));
      const transporter = nodemailer.createTransport({ host: SMTP_HOST, port: portNum, secure: portNum === 465, auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined });
      const info = await transporter.sendMail({ from: EMAIL_FROM, to: toAddress, subject, html });
      return { ok:true, provider:'smtp', result: { messageId: info.messageId || null, response: info.response || null } };
    } catch (err) {
      console.error('[sendProductEmail] SMTP error', err && err.message ? err.message : err);
      return { ok:false, error:'smtp_failed', detail: err && err.message ? err.message : String(err) };
    }
  }

  return { ok:false, error:'no_email_provider_configured' };
}

/*
  Notes:
  - This example assumes Resend exposes an SMS endpoint at POST https://api.resend.com/sms.
  - If Resend does not provide SMS, use Twilio (example below) or another SMS provider.

  Twilio example (uncomment and install twilio package if you prefer Twilio):

  const Twilio = require('twilio');
  const TWILIO_SID = process.env.TWILIO_SID;
  const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const TWILIO_FROM = process.env.TWILIO_FROM;
  const client = new Twilio(TWILIO_SID, TWILIO_TOKEN);

  // then inside handler:
  await client.messages.create({ body: text, from: TWILIO_FROM, to: ADMIN_PHONE });

*/
