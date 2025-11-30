// Servidor sem dependências externas (HTTP nativo)
try { require('dotenv').config(); } catch(e) {}
const http = require('http');
const url = require('url');
const { enviarEmail } = require('./emailService');

function sendJson(res, status, obj){
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  });
  res.end(body);
}

function parseBody(req){
  return new Promise((resolve, reject)=>{
    let data = '';
    req.on('data', chunk=> data += chunk);
    req.on('end', ()=>{
      try{ resolve(data ? JSON.parse(data) : {}); }catch(e){ reject(e); }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res)=>{
  const parsed = url.parse(req.url, true);
  // CORS preflight
  if (req.method === 'OPTIONS'){
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    });
    return res.end();
  }

  if (req.method === 'GET' && parsed.pathname === '/api/health'){
    return sendJson(res, 200, { status: 'ok' });
  }

  if (req.method === 'POST' && parsed.pathname === '/api/send-email'){
    try{
      const body = await parseBody(req);
      const { to, subject, html } = body || {};
      console.log('[send-email] req', {
        to, subject,
        htmlLen: (html||'').length,
        from: process.env.RESEND_FROM || 'onboarding@resend.dev',
        apiKeySet: !!process.env.RESEND_API_KEY
      });
      if (!to || !subject || !html){
        return sendJson(res, 400, { error: 'Campos obrigatórios: to, subject, html' });
      }
      const result = await enviarEmail(to, subject, html);
      console.log('[send-email] success', result);
      return sendJson(res, 200, { ok: true, result });
    }catch(err){
      console.error('[send-email] error', err && (err.stack || err));
      return sendJson(res, 500, { error: err.message });
    }
  }

  sendJson(res, 404, { error: 'Not found' });
});

server.listen(3000, ()=> console.log('Rodando na porta 3000 (HTTP nativo)'));
