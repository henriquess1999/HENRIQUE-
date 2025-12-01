// Servidor sem dependências externas (HTTP nativo)
try { require('dotenv').config(); } catch(e) {}
const http = require('http');
const url = require('url');
const { enviarEmail } = require('./emailService');

// OTP em memória (desaparecerá ao reiniciar o servidor)
const otps = Object.create(null);

function generateOtp(){ return (''+Math.floor(1000 + Math.random()*9000)); }

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

  // Gera um OTP no servidor, envia por e-mail e guarda em memória
  if (req.method === 'POST' && parsed.pathname === '/api/send-otp'){
    try{
      const body = await parseBody(req);
      const { to } = body || {};
      if (!to) return sendJson(res, 400, { error: 'Campo obrigatório: to' });
      const code = generateOtp();
      const ttlMinutes = 10;
      const now = Date.now();
      otps[to] = { code: code.toString(), email: to, createdAt: new Date(now).toISOString(), expiresAt: new Date(now + ttlMinutes*60*1000).toISOString() };

      const origin = (req.headers.origin) ? req.headers.origin : (`http://${req.headers.host}`);
      const verifyUrl = `${origin.replace(/\/$/, '')}/admin-verify.html?email=${encodeURIComponent(to)}&code=${encodeURIComponent(code)}`;
      const subject = `Código de Verificação: ${code} - E2W Admin`;
      const html = `
        <div style="font-family:Inter,Arial,sans-serif;color:#111">
          <h2 style="color:#bfa14a">E2W Admin</h2>
          <p>Seu código de verificação é:</p>
          <p style="font-size:32px;font-weight:800;color:#bfa14a;letter-spacing:4px">${code}</p>
          <p>Este código expira em ${ttlMinutes} minutos. Se você não solicitou, ignore este e-mail.</p>
          <p style="margin-top:1rem;">Abrir verificação: <a href="${verifyUrl}" style="color:#bfa14a;text-decoration:underline;">Clique aqui</a></p>
        </div>`;

      const result = await enviarEmail(to, subject, html);
      console.log('[send-otp] sent to', to, result && result.id ? result.id : result);
      // Retorna também o código e o HTML enviado para facilitar depuração local
      return sendJson(res, 200, { ok: true, result, code: code.toString(), html });
    }catch(err){
      console.error('[send-otp] error', err && (err.stack || err));
      return sendJson(res, 500, { error: err.message });
    }
  }

  // Verifica o OTP enviado pelo usuário
  if (req.method === 'POST' && parsed.pathname === '/api/verify-otp'){
    try{
      const body = await parseBody(req);
      const { email, code } = body || {};
      if (!email || !code) return sendJson(res, 400, { error: 'Campos obrigatórios: email, code' });
      const record = otps[email];
      if (!record) return sendJson(res, 400, { ok: false, error: 'Código inválido ou expirado' });
      const now = Date.now();
      const exp = Date.parse(record.expiresAt || 0);
      if (isNaN(exp) || now > exp) { delete otps[email]; return sendJson(res, 400, { ok: false, error: 'Código expirado' }); }
      if (record.code !== (''+code).toString()) return sendJson(res, 400, { ok: false, error: 'Código inválido' });
      // válido: remove o registro e responde OK
      delete otps[email];
      return sendJson(res, 200, { ok: true });
    }catch(err){
      console.error('[verify-otp] error', err && (err.stack || err));
      return sendJson(res, 500, { error: err.message });
    }
  }

  // Recebe notificação de pedido finalizado do frontend e envia e-mail ao admin
  if (req.method === 'POST' && parsed.pathname === '/api/order-complete'){
    try{
      const body = await parseBody(req);
      const order = (body && (body.order || body)) || null;
      console.log('[order-complete] received order', JSON.stringify(order && typeof order === 'object' ? order : order, null, 2));
      if (!order || !order.id) return sendJson(res, 400, { error: 'Campo obrigatório: order.id' });
      const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM || null;
      if (!adminEmail) return sendJson(res, 500, { error: 'ADMIN_EMAIL não configurado no servidor' });

      // Monta HTML do pedido
      const customer = order.customer || {};
      const items = Array.isArray(order.items) ? order.items : [];
      const itemsRows = items.map(i => (`<tr><td style="padding:6px;border:1px solid #ddd">${(i.name||i.title||i.productName||'Item')}</td><td style="padding:6px;border:1px solid #ddd">${Number(i.quantity||1)}</td><td style="padding:6px;border:1px solid #ddd">R$ ${Number(i.price||0).toFixed(2)}</td></tr>`)).join('');
      // Campos adicionais: endereço, método de pagamento, status, datas e totais
      const payMethod = (order.paymentMethod || order.payment || order.payment_type || '—');
      const status = order.status || '—';
      const createdAt = order.createdAt || order.createdAtISO || (order.createdAtTimestamp ? new Date(order.createdAtTimestamp).toISOString() : '—');
      const addressParts = (customer && (customer.address || '')) ? (`${customer.address || ''}${customer.city ? ', ' + customer.city : ''}${customer.state ? ' - ' + customer.state : ''}${customer.country ? ' / ' + customer.country : ''}`) : '—';
      const subtotal = Number(order.subtotal || 0).toFixed(2);
      const shippingCost = Number(order.shipping || 0).toFixed(2);
      const totalCost = Number(order.total || order.subtotal || 0).toFixed(2);

      const html = `
        <h2>Novo pedido ${order.id}</h2>

        <h3>Dados do cliente</h3>
        <ul>
          <li><strong>Nome completo:</strong> ${customer.name || '—'}</li>
          <li><strong>E‑mail:</strong> ${customer.email || '—'}</li>
          <li><strong>Telefone:</strong> ${customer.phone || '—'}</li>
          <li><strong>Estado:</strong> ${customer.state || (customer.stateProvince || '—')}</li>
          <li><strong>Cidade:</strong> ${customer.city || '—'}</li>
          <li><strong>CNPJ:</strong> ${customer.cnpj || customer.cnpjNumber || '—'}</li>
          <li><strong>Endereço:</strong> ${customer.address || addressParts || '—'}</li>
        </ul>

        <h3>Resumo financeiro</h3>
        <p><strong>Subtotal:</strong> R$ ${subtotal} &nbsp; <strong>Frete:</strong> R$ ${shippingCost} &nbsp; <strong>Total:</strong> R$ ${totalCost}</p>

        <h3>Pagamento e status</h3>
        <p><strong>Método de pagamento:</strong> ${payMethod} &nbsp; <strong>Status:</strong> ${status} &nbsp; <strong>Criado em:</strong> ${createdAt}</p>

        <h3>Itens</h3>
        <table style="border-collapse:collapse;width:100%;max-width:600px">
          <thead><tr><th style="text-align:left;padding:6px;border:1px solid #ddd">Produto</th><th style="padding:6px;border:1px solid #ddd">Qtd</th><th style="padding:6px;border:1px solid #ddd">Preço</th></tr></thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <h4>Dados completos (JSON)</h4>
        <pre style="white-space:pre-wrap;background:#f6f8fa;padding:8px;border-radius:6px">${JSON.stringify(order, null, 2)}</pre>
      `;

      try{
        const resultAdmin = await enviarEmail(adminEmail, `Novo pedido ${order.id}`, html);
        console.log('[order-complete] email sent to admin', order.id, resultAdmin && resultAdmin.id ? resultAdmin.id : resultAdmin);

        // Envia cópia ao cliente, se houver e-mail
        let resultCustomer = null;
        const customerEmail = (customer && customer.email) ? customer.email : null;
        if (customerEmail) {
          try {
            const custHtml = `
              <h2>Pedido Recebido — ${order.id}</h2>
              <p>Olá ${customer.name || 'cliente'},</p>
              <p>Recebemos seu pedido <strong>${order.id}</strong>. Seguem os detalhes:</p>
              <p><strong>Total:</strong> R$ ${Number(order.total||order.subtotal||0).toFixed(2)}</p>
              <h3>Itens</h3>
              <table style="border-collapse:collapse;width:100%;max-width:600px">
                <thead><tr><th style="text-align:left;padding:6px;border:1px solid #ddd">Produto</th><th style="padding:6px;border:1px solid #ddd">Qtd</th><th style="padding:6px;border:1px solid #ddd">Preço</th></tr></thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>
              <p>Em breve entraremos em contato para confirmar o envio.</p>
            `;
            resultCustomer = await enviarEmail(customerEmail, `Confirmação do pedido ${order.id}`, custHtml);
            console.log('[order-complete] email sent to customer', customerEmail, resultCustomer && resultCustomer.id ? resultCustomer.id : resultCustomer);
          } catch (eCust) {
            console.warn('[order-complete] falha ao enviar email para cliente', customerEmail, eCust && eCust.message ? eCust.message : eCust);
          }
        }

        return sendJson(res, 200, { ok: true, admin: resultAdmin, customer: resultCustomer });
      }catch(e){
        console.error('[order-complete] erro ao enviar email', e && (e.stack||e));
        return sendJson(res, 500, { ok: false, error: e && e.message ? e.message : String(e) });
      }
    }catch(err){
      console.error('[order-complete] error', err && (err.stack || err));
      return sendJson(res, 500, { error: err.message });
    }
  }

  sendJson(res, 404, { error: 'Not found' });
});

server.listen(3000, ()=> console.log('Rodando na porta 3000 (HTTP nativo)'));
