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
const resend = ResendLib && API_KEY ? new ResendLib.Resend(API_KEY) : null;

function sendViaResendHttp({ from, to, subject, html }){
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ from, to, subject, html });
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

async function enviarEmail(to, subject, html) {
  if (!API_KEY) { throw new Error("RESEND_API_KEY não definido no .env"); }
  if (!to || !subject || !html) { throw new Error("Campos obrigatórios: to, subject, html"); }
  // Tenta via SDK, senão fallback HTTP
  if (resend && resend.emails && resend.emails.send){
    try {
      const data = await resend.emails.send({ from: FROM, to, subject, html });
      return data;
    } catch (sdkErr) {
      console.warn("[emailService] SDK falhou, usando HTTP:", sdkErr?.message || sdkErr);
      return await sendViaResendHttp({ from: FROM, to, subject, html });
    }
  }
  // Sem SDK: usa HTTP direto
  return await sendViaResendHttp({ from: FROM, to, subject, html });
}

module.exports = { enviarEmail };
