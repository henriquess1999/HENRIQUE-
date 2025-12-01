const { enviarEmail } = require('../emailService');

// Vercel Serverless handler
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  try {
    const body = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => {
        try { resolve(JSON.parse(data || '{}')); } catch (e) { resolve({}); }
      });
      req.on('error', reject);
    });

    const order = body.order || body;
    console.log('[api/order-complete] received order', JSON.stringify(order || {}, null, 2));

    if (!order) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: 'Missing order payload' }));
    }

    // build simple HTML summary
    const customer = order.customer || {};
    const lines = [];
    lines.push(`<h2>Novo Pedido Recebido</h2>`);
    lines.push(`<p><strong>Nome:</strong> ${customer.name || '—'}</p>`);
    lines.push(`<p><strong>Email:</strong> ${customer.email || '—'}</p>`);
    lines.push(`<p><strong>Telefone:</strong> ${customer.phone || '—'}</p>`);
    lines.push(`<p><strong>Endereço:</strong> ${customer.address || '—'}</p>`);
    lines.push(`<p><strong>Cidade/Estado:</strong> ${customer.city || ''} ${customer.state || ''}</p>`);
    lines.push(`<h3>Itens</h3>`);
    if (Array.isArray(order.items)) {
      lines.push('<ul>');
      order.items.forEach(it => {
        lines.push(`<li>${it.name || it.title || 'Item'} — qty: ${it.qty || it.quantity || 1} — preço: ${it.price || it.unitPrice || '—'}</li>`);
      });
      lines.push('</ul>');
    }
    lines.push(`<p><strong>Total:</strong> ${order.total || order.totalPrice || '—'}</p>`);

    const html = lines.join('\n');

    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_FROM || 'e2wrepresentacoes@gmail.com';
    await enviarEmail(adminEmail, `Pedido recebido — ${customer.name || 'Cliente'}`, html);

    // optional: send confirmation to customer if email present
    if (customer && customer.email) {
      const custHtml = `<p>Olá ${customer.name || ''},</p><p>Recebemos seu pedido. Em breve entraremos em contato.</p>` + html;
      try { await enviarEmail(customer.email, 'Confirmação de pedido — E2W Representações', custHtml); } catch (err) {
        console.warn('[api/order-complete] warning: failed to send customer email', err && err.message);
      }
    }

    res.statusCode = 200;
    res.end(JSON.stringify({ ok: true }));
  } catch (err) {
    console.error('[api/order-complete] error', err && err.stack || err);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: err.message }));
  }
};
