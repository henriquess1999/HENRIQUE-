try { require("dotenv").config(); } catch(e) {}
// Fallback: carrega manualmente o .env se a lib dotenv não estiver disponível
if (!process.env.RESEND_API_KEY) {
  try {
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const txt = fs.readFileSync(envPath, 'utf8');
      txt.split(/\r?\n/).forEach(line => {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
        if (m) {
          const key = m[1];
          let val = m[2];
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) process.env[key] = val;
        }
      });
    }
  } catch(_) {}
}
const https = require("https");
let ResendLib = null;
try { ResendLib = require("resend"); } catch (e) { ResendLib = null; }
const API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM || "onboarding@resend.dev"; // domínio de teste da Resend
const REPLY_TO = process.env.EMAIL_FROM || null;
const resend = ResendLib && API_KEY ? new ResendLib.Resend(API_KEY) : null;

// SMTP (nodemailer) config via env
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = process.env.SMTP_PORT || '';
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
let nodemailer = null;
let smtpTransporter = null;
if (SMTP_HOST && SMTP_USER) {
  try {
    nodemailer = require('nodemailer');
    const portNum = Number(SMTP_PORT) || (SMTP_HOST.includes('gmail') ? 465 : 587);
    smtpTransporter = nodemailer.createTransport({ host: SMTP_HOST, port: portNum, secure: portNum === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } });
  } catch (e) {
    smtpTransporter = null;
    nodemailer = null;
    console.warn('[emailService] nodemailer não inicializado:', e && e.message ? e.message : e);
  }
}

function sendViaResendHttp({ from, to, subject, html, reply_to }){
  return new Promise((resolve, reject) => {
    const payload = { from, to, subject, html };
    if (reply_to) payload.reply_to = reply_to;
    const body = JSON.stringify(payload);
    const req = https.request({
      hostname: "api.resend.com",
      path: "/emails",
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body)
      }
    }, (res) => {
      let chunks = "";
      res.on("data", (d) => chunks += d);
      res.on("end", () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300){
          try { resolve(JSON.parse(chunks)); } catch(e){ resolve({ ok:true, raw: chunks }); }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${chunks}`));
        }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function sendViaSmtp({ from, to, subject, html, reply_to }){
  if (!smtpTransporter) return { ok: false, error: 'smtp_not_configured' };
  const mailOpts = { from, to, subject, html };
  if (reply_to) mailOpts.replyTo = reply_to;
  try {
    const info = await smtpTransporter.sendMail(mailOpts);
    return { ok: true, provider: 'smtp', result: { messageId: info.messageId || null, response: info.response || null } };
  } catch (err) {
    return { ok: false, error: 'smtp_error', detail: err && err.message ? err.message : String(err) };
  }
}

async function enviarEmail(to, subject, html) {
  if (!to || !subject || !html) { throw new Error("Campos obrigatórios: to, subject, html"); }

  // Try Resend SDK first (if available)
  if (resend && resend.emails && resend.emails.send){
    try {
      const opts = { from: FROM, to, subject, html };
      if (REPLY_TO) opts.reply_to = REPLY_TO;
      const data = await resend.emails.send(opts);
      return data;
    } catch (sdkErr) {
      const msg = sdkErr && (sdkErr.message || sdkErr.toString()) ? (sdkErr.message || String(sdkErr)) : 'unknown_error';
      console.warn("[emailService] Resend SDK falhou:", msg);
      // If error indicates unverified domain / testing restriction, try SMTP fallback if configured
      const isValidationError = /verify your domain|not verified|testing emails/i.test(msg);
      if (smtpTransporter) {
        const smtpRes = await sendViaSmtp({ from: REPLY_TO || FROM, to, subject, html, reply_to: REPLY_TO });
        if (smtpRes && smtpRes.ok) return smtpRes;
      }
      // otherwise try HTTP API fallback
      try { return await sendViaResendHttp({ from: FROM, to, subject, html, reply_to: REPLY_TO }); } catch(e){ /* continue to throw below */ }
      throw sdkErr;
    }
  }

  // If no SDK, try HTTP API
  try {
    const r = await sendViaResendHttp({ from: FROM, to, subject, html, reply_to: REPLY_TO });
    return r;
  } catch (httpErr) {
    const msg = httpErr && (httpErr.message || httpErr.toString()) ? (httpErr.message || String(httpErr)) : 'unknown_error';
    console.warn('[emailService] Resend HTTP falhou:', msg);
    // Try SMTP fallback
    if (smtpTransporter) {
      const smtpRes = await sendViaSmtp({ from: REPLY_TO || FROM, to, subject, html, reply_to: REPLY_TO });
      if (smtpRes && smtpRes.ok) return smtpRes;
    }
    throw httpErr;
  }
}

module.exports = { enviarEmail };
