// Servidor sem dependências externas (HTTP nativo)
try { require('dotenv').config(); } catch(e) {}
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { enviarEmail } = require('./emailService');

// Firestore support removed from this project.
// The application will use local file storage for orders and related data.
let firestoreClient = null;
let USE_FIRESTORE = false;

function getDefaultSaveDir() {
  try {
    // Prioritize the project's data directory so orders are stored inside the repo during development
    const projectData = path.join(__dirname, 'data');
    try { if (fs.existsSync(projectData) && fs.statSync(projectData).isDirectory()) return projectData; } catch(e){}

    const home = os.homedir();
    const candidates = [
      path.join(home, 'Área de Trabalho'),
      path.join(home, 'Desktop'),
      path.join(home, 'OneDrive', 'Área de Trabalho')
    ];
    for (const c of candidates) {
      try { if (fs.existsSync(c) && fs.statSync(c).isDirectory()) return c; } catch(e){}
    }
    return projectData;
  } catch(e) {
    return path.join(__dirname, 'data');
  }
}

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

  // Endpoint de diagnóstico: tenta criar um documento de teste no Firestore
  if (req.method === 'GET' && parsed.pathname === '/api/test-firestore'){
    try{
      if (!firestoreClient || !USE_FIRESTORE) return sendJson(res, 500, { ok: false, error: 'firestore_not_initialized' });
      const testId = 'TEST-' + Date.now();
      const docRef = firestoreClient.collection('orders').doc(testId);
      try {
        await docRef.create({ test: true, createdAt: new Date().toISOString(), note: 'test doc from /api/test-firestore' });
        return sendJson(res, 200, { ok: true, created: true, id: testId });
      } catch (createErr) {
        // já existe ou outro erro
        return sendJson(res, 500, { ok: false, error: 'failed_create', detail: (createErr && createErr.message) ? createErr.message : String(createErr) });
      }
    }catch(e){ return sendJson(res,500,{ ok:false, error: e && e.message ? e.message : String(e) }); }
  }

  // DEBUG: retornar informações sobre onde os pedidos são lidos
  if (req.method === 'GET' && parsed.pathname === '/api/_debug_orders'){
    try{
      const dataDir = process.env.ORDER_SAVE_DIR || getDefaultSaveDir();
      const ordersFile = path.join(dataDir, 'orders.json');
      let exists = false;
      try{ exists = fs.existsSync(ordersFile); }catch(e){}
      let preview = null;
      try{ preview = exists ? fs.readFileSync(ordersFile,'utf8').slice(0,2000) : null; }catch(e){ preview = 'read_error:' + (e && e.message ? e.message : String(e)); }
      return sendJson(res, 200, { ok: true, dataDir, ordersFile, exists, preview, firestoreClientPresent: !!firestoreClient, USE_FIRESTORE: !!USE_FIRESTORE });
    }catch(e){ return sendJson(res,500,{ ok:false, error: e && e.message ? e.message : String(e) }); }
  }

  // Retorna lista de pedidos salvos localmente
  if (req.method === 'GET' && parsed.pathname === '/api/orders'){
    try {
      if (firestoreClient && USE_FIRESTORE) {
        try {
          // Buscar últimos 200 pedidos do Firestore
          const snapshot = await firestoreClient.collection('orders').orderBy('createdAt', 'desc').limit(200).get();
          const orders = [];
          snapshot.forEach(doc => {
            const d = doc.data();
            orders.push(Object.assign({ id: doc.id }, d));
          });
          return sendJson(res, 200, { success: true, orders });
        } catch (e) {
          console.warn('[api/orders] falha ao buscar do Firestore, usando fallback de arquivo local', e && (e.message || e));
          // continua para fallback local
        }
      }

      // Ler do mesmo local onde os pedidos são salvos (ORDER_SAVE_DIR ou getDefaultSaveDir())
      const dataDir = process.env.ORDER_SAVE_DIR || getDefaultSaveDir();
      const ordersFile = path.join(dataDir, 'orders.json');
      let existing = [];
      try { existing = JSON.parse(fs.readFileSync(ordersFile, 'utf8') || '[]'); } catch (e) { existing = []; }
      return sendJson(res, 200, { success: true, orders: existing });
    } catch (e) {
      console.error('[api/orders] error reading orders', e && (e.stack||e));
      return sendJson(res, 500, { success: false, error: 'failed_to_read_orders' });
    }
  }

  // GET /api/sales - retorna vendas salvas (arquivo sales.json)
  if (req.method === 'GET' && parsed.pathname === '/api/sales'){
    try{
      const dataDir = process.env.ORDER_SAVE_DIR || getDefaultSaveDir();
      const salesFile = path.join(dataDir, 'sales.json');
      let existing = [];
      try { existing = JSON.parse(fs.readFileSync(salesFile, 'utf8') || '[]'); } catch (e) { existing = []; }
      return sendJson(res, 200, { success: true, sales: existing });
    }catch(e){ console.error('[api/sales GET] error', e && (e.stack||e)); return sendJson(res,500,{ success:false, error: 'failed_to_read_sales' }); }
  }

  // POST /api/sales - upsert a sale into sales.json
  if (req.method === 'POST' && parsed.pathname === '/api/sales'){
    try{
      const body = await parseBody(req);
      const sale = (body && (body.sale || body)) || null;
      if (!sale) return sendJson(res, 400, { success:false, error: 'missing_sale' });
      if (!sale.id) sale.id = 'S-' + Date.now();
      const dataDir = process.env.ORDER_SAVE_DIR || getDefaultSaveDir();
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      const salesFile = path.join(dataDir, 'sales.json');
      let existing = [];
      try { existing = JSON.parse(fs.readFileSync(salesFile, 'utf8') || '[]'); } catch (e) { existing = []; }
      existing = existing.filter(s => String(s.id) !== String(sale.id));
      existing.unshift(sale);
      existing = existing.slice(0, 1000);
      fs.writeFileSync(salesFile, JSON.stringify(existing, null, 2), 'utf8');
      return sendJson(res, 200, { success: true, savedVia: 'localfile' });
    }catch(e){ console.error('[api/sales POST] error', e && (e.stack||e)); return sendJson(res,500,{ success:false, error: e && e.message ? e.message : String(e) }); }
  }

  // DELETE /api/orders?id=ORDER_ID -> remove pedido do arquivo local (favors ORDER_SAVE_DIR)
  if ((req.method === 'DELETE' || (req.method === 'POST' && parsed.pathname === '/api/orders' && parsed.query && parsed.query._method === 'DELETE')) && parsed.pathname === '/api/orders'){
    try{
      const orderId = parsed.query && parsed.query.id ? String(parsed.query.id) : null;
      if (!orderId) return sendJson(res, 400, { success: false, error: 'missing_order_id' });
      try { console.info('[api/orders DELETE] request id=', orderId); } catch(e){}
      const dataDir = process.env.ORDER_SAVE_DIR || getDefaultSaveDir();
      const ordersFile = path.join(dataDir, 'orders.json');
      let existing = [];
      try { existing = JSON.parse(fs.readFileSync(ordersFile, 'utf8') || '[]'); } catch (e) { existing = []; }
      try { console.info('[api/orders DELETE] existing ids=', existing.map(o => o && o.id).slice(0,50)); } catch(e){}
      const filtered = existing.filter(o => {
        try { return String((o && o.id) || '').trim() !== String(orderId || '').trim(); } catch(e) { return true; }
      });
      try { console.info('[api/orders DELETE] filtered count=', filtered.length, 'existing count=', existing.length); } catch(e){}
      try { fs.writeFileSync(ordersFile, JSON.stringify(filtered, null, 2), 'utf8'); } catch(e){ return sendJson(res,500,{ success:false, error: 'failed_to_write_orders', detail: (e && e.message) ? e.message : String(e) }); }
      try {
        // Add tombstone so clients won't resend the same order id later
        const tombFile = path.join(dataDir, 'deleted_orders.json');
        let tombs = [];
        try { tombs = JSON.parse(fs.readFileSync(tombFile, 'utf8') || '[]'); } catch(e) { tombs = []; }
        tombs = tombs.filter(t => String((t && t.id) || '').trim() !== String(orderId || '').trim());
        tombs.unshift({ id: String(orderId), deletedAt: new Date().toISOString() });
        // keep recent tombstones only (e.g., 200)
        tombs = tombs.slice(0, 200);
        try { fs.writeFileSync(tombFile, JSON.stringify(tombs, null, 2), 'utf8'); } catch(e) { console.warn('[api/orders DELETE] failed to write tombstones', e && e.message ? e.message : e); }
      } catch(e) { /* ignore tombstone errors */ }
      return sendJson(res, 200, { success: true, removed: existing.length - filtered.length });
    }catch(e){ console.error('[api/orders DELETE] error', e && (e.stack||e)); return sendJson(res,500,{ success:false, error: e && e.message ? e.message : String(e) }); }
  }

  // DELETE /api/sales?id=SALE_ID -> remove sale from sales.json
  if ((req.method === 'DELETE' || (req.method === 'POST' && parsed.pathname === '/api/sales' && parsed.query && parsed.query._method === 'DELETE')) && parsed.pathname === '/api/sales'){
    try{
      const saleId = parsed.query && parsed.query.id ? String(parsed.query.id) : null;
      if (!saleId) return sendJson(res, 400, { success: false, error: 'missing_sale_id' });
      const dataDir = process.env.ORDER_SAVE_DIR || getDefaultSaveDir();
      const salesFile = path.join(dataDir, 'sales.json');
      let existing = [];
      try { existing = JSON.parse(fs.readFileSync(salesFile, 'utf8') || '[]'); } catch(e){ existing = []; }
      const filtered = existing.filter(s => String(s.id) !== String(saleId));
      try { fs.writeFileSync(salesFile, JSON.stringify(filtered, null, 2), 'utf8'); } catch(e){ return sendJson(res,500,{ success:false, error: 'failed_to_write_sales', detail: (e && e.message) ? e.message : String(e) }); }
      return sendJson(res, 200, { success: true, removed: existing.length - filtered.length });
    }catch(e){ console.error('[api/sales DELETE] error', e && (e.stack||e)); return sendJson(res,500,{ success:false, error: e && e.message ? e.message : String(e) }); }
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
  // Novo endpoint público para criação de pedidos via front-end
  if (req.method === 'POST' && parsed.pathname === '/api/createOrder'){
    try{
      const body = await parseBody(req);
      try { console.log('[createOrder] incoming body:', JSON.stringify(body).slice(0, 2000)); } catch(e) { console.log('[createOrder] incoming body (non-serializable)'); }
      // Persist log for debugging
      try {
        const logDir = process.env.ORDER_SAVE_DIR || getDefaultSaveDir();
        if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
        const logFile = path.join(logDir, 'createOrder.log');
        const entry = `${new Date().toISOString()} - ${req.connection.remoteAddress || req.socket.remoteAddress || '-'} - ${JSON.stringify({ url: req.url, body: (function(){ try { return body } catch(e){ return String(body) } })() }).slice(0,10000)}\n`;
        fs.appendFileSync(logFile, entry, 'utf8');
      } catch(e) { console.warn('[createOrder] failed to write debug log', e && e.message ? e.message : e); }
      const order = (body && (body.order || body)) || null;
      if (!order) return sendJson(res, 400, { error: 'Campo obrigatório: order' });

      // Prevent re-creation of orders that were explicitly deleted by admin.
      try {
        const tombFile = path.join(process.env.ORDER_SAVE_DIR || getDefaultSaveDir(), 'deleted_orders.json');
        let tombs = [];
        try { tombs = JSON.parse(fs.readFileSync(tombFile, 'utf8') || '[]'); } catch(e) { tombs = []; }
        const isDeleted = tombs.some(t => String((t && t.id) || '').trim() === String(order.id || '').trim());
        if (isDeleted) return sendJson(res, 409, { success: false, error: 'order_previously_deleted' });
      } catch(e) { /* ignore tombstone check errors and continue */ }
      // garante id caso front não envie
      if (!order.id) order.id = 'ORD-' + Date.now();

      // grava pedido no Firestore se disponível, senão em arquivo local
      // Tenta salvar no Firestore quando disponível; se falhar, faz fallback para arquivo local
      let savedVia = null;
      if (firestoreClient) {
        try {
          const docRef = firestoreClient.collection('orders').doc(String(order.id));
          try {
            // Tenta criar o documento — falhará se já existir (evita sobrescrever)
            await docRef.create(Object.assign({}, order, { createdAt: new Date(order.createdAt || Date.now()).toISOString() }));
            savedVia = 'firestore';
          } catch (createErr) {
            const msg = (createErr && (createErr.message || '')).toString();
            // Detecta erro de documento já existente e não sobrescreve
            if (msg.includes('already exists') || createErr.code === 6) {
              console.info('[createOrder] pedido já existe no Firestore, ignorando criação', order.id);
              savedVia = 'firestore-existing';
            } else {
              // outro erro — propaga para o catch externo que fará fallback
              throw createErr;
            }
          }
        } catch (eFs) {
          console.warn('[createOrder] aviso: falha ao salvar no Firestore, fazendo fallback para arquivo local', eFs && eFs.message ? eFs.message : eFs);
        }
      }

      if (!savedVia) {
        try {
          const dataDir = process.env.ORDER_SAVE_DIR || getDefaultSaveDir();
          if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
          const ordersFile = path.join(dataDir, 'orders.json');
          let existing = [];
          try { existing = JSON.parse(fs.readFileSync(ordersFile, 'utf8') || '[]'); } catch (e) { existing = []; }
          existing = existing.filter(o => String(o.id) !== String(order.id));
          existing.unshift(order);
          existing = existing.slice(0, 200);
          fs.writeFileSync(ordersFile, JSON.stringify(existing, null, 2), 'utf8');
          savedVia = 'localfile';
        } catch (eSave) {
          console.warn('[createOrder] warning: falha ao salvar pedido localmente', eSave && eSave.message ? eSave.message : eSave);
          const detail = (eSave && eSave.message) ? String(eSave.message) : String(eSave);
          return sendJson(res, 500, { success: false, error: 'failed_to_save_order', detail });
        }
      }

      // resposta padronizada — retorna o pedido salvo para facilitar diagnóstico no cliente
      try { console.info('[createOrder] savedVia=', savedVia, 'orderId=', String(order.id)); } catch(e){}
      return sendJson(res, 200, { success: true, order: order, savedVia });
    } catch (err) {
      console.error('[createOrder] error', err && (err.stack || err));
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // Upsert order (used by admin to persist status/field updates)
  if (req.method === 'POST' && parsed.pathname === '/api/orders'){
    try{
      const body = await parseBody(req);
      const order = (body && (body.order || body)) || null;
      if (!order || !order.id) return sendJson(res, 400, { success:false, error: 'missing_order_or_id' });

      // Try Firestore update if available
      let savedVia = null;
      if (firestoreClient && USE_FIRESTORE) {
        try{
          const docRef = firestoreClient.collection('orders').doc(String(order.id));
          await docRef.set(Object.assign({}, order, { updatedAt: new Date().toISOString() }), { merge: true });
          savedVia = 'firestore';
        }catch(e){ console.warn('[api/orders POST] failed to upsert to Firestore', e && e.message ? e.message : e); }
      }

      // Always update local file as fallback / source of truth for admin UI
      try{
        const dataDir = process.env.ORDER_SAVE_DIR || getDefaultSaveDir();
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        const ordersFile = path.join(dataDir, 'orders.json');
        let existing = [];
        try { existing = JSON.parse(fs.readFileSync(ordersFile, 'utf8') || '[]'); } catch(e){ existing = []; }
        existing = existing.filter(o => String(o.id) !== String(order.id));
        existing.unshift(order);
        existing = existing.slice(0, 200);
        fs.writeFileSync(ordersFile, JSON.stringify(existing, null, 2), 'utf8');
        savedVia = savedVia || 'localfile';
      }catch(e){
        console.error('[api/orders POST] failed to write orders file', e && e.message ? e.message : e);
        return sendJson(res, 500, { success:false, error: 'failed_to_write_orders', detail: e && e.message ? e.message : String(e) });
      }

      return sendJson(res, 200, { success:true, savedVia });
    }catch(e){ console.error('[api/orders POST] error', e && (e.stack||e)); return sendJson(res,500,{ success:false, error: e && e.message ? e.message : String(e) }); }
  }

  // Recebe logs de erro do cliente (ex: resposta não-JSON) para depuração
  if (req.method === 'POST' && parsed.pathname === '/api/log-client-error'){
    try{
      const body = await parseBody(req);
      try { console.log('[log-client-error] from', req.connection.remoteAddress || req.socket.remoteAddress, JSON.stringify(body).slice(0,2000)); } catch(e) {}
      try {
        const logDir = process.env.ORDER_SAVE_DIR || getDefaultSaveDir();
        if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
        const file = path.join(logDir, 'client-errors.log');
        const entry = `${new Date().toISOString()} - ${req.connection.remoteAddress || req.socket.remoteAddress || '-'} - ${JSON.stringify(body).slice(0,20000)}\n`;
        fs.appendFileSync(file, entry, 'utf8');
      } catch(e) { console.warn('[log-client-error] failed to write log', e && e.message ? e.message : e); }
      return sendJson(res, 200, { ok: true });
    }catch(e){
      console.error('[log-client-error] error', e && (e.stack||e));
      return sendJson(res, 500, { ok: false, error: e && e.message ? e.message : String(e) });
    }
  }

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
        // grava o pedido em storage local (arquivo JSON)
        try {
          const dataDir = process.env.ORDER_SAVE_DIR || getDefaultSaveDir();
          if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
          const ordersFile = path.join(dataDir, 'orders.json');
          let existing = [];
          try { existing = JSON.parse(fs.readFileSync(ordersFile, 'utf8') || '[]'); } catch (e) { existing = []; }
          // evita duplicar pedido com mesmo id
          existing = existing.filter(o => String(o.id) !== String(order.id));
          existing.unshift(order);
          // mantém histórico até 200 pedidos
          existing = existing.slice(0, 200);
          fs.writeFileSync(ordersFile, JSON.stringify(existing, null, 2), 'utf8');
        } catch (eSave) {
          console.warn('[order-complete] warning: falha ao salvar pedido localmente', eSave && eSave.message ? eSave.message : eSave);
        }

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

// Serve static files (basic, safe) for local development
async function serveStaticFile(req, res) {
  try {
    const parsed = url.parse(req.url || '/', true);
    let pathname = parsed.pathname || '/';
    if (pathname === '/') pathname = '/index.html';
    // normalize and prevent path traversal
    const safePath = path.normalize(path.join(__dirname, pathname.replace(/^\//, '')));
    if (!safePath.startsWith(path.normalize(__dirname))) return false;
    if (!fs.existsSync(safePath) || fs.statSync(safePath).isDirectory()) return false;

    const ext = path.extname(safePath).toLowerCase();
    const map = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    };
    const type = map[ext] || 'application/octet-stream';
    const data = fs.readFileSync(safePath);
    res.writeHead(200, { 'Content-Type': type, 'Access-Control-Allow-Origin': '*' });
    res.end(data);
    return true;
  } catch (e) {
    return false;
  }
}

// If request not matched by APIs, attempt to serve static file (only for GET)
server.on('request', (req, res) => {
  // noop here — actual server handler above handles requests; this ensures static serving fallback
});


const PORT = process.env.PORT || 3001; // usa a porta do Vercel ou 3001 local
server.listen(PORT, () => console.log(`Rodando na porta ${PORT} (HTTP nativo)`));

