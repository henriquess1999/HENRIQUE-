const http = require('http');

function postOrder(order) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(order);
    const opts = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/createOrder',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); } catch (e) { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function run() {
  const orders = [
    {
      id: 'TEST-' + Date.now() + '-A',
      createdAt: new Date().toISOString(),
      total: 123.45,
      items: [{ name: 'Produto X', quantity: 1, price: 123.45 }],
      customer: { name: 'Cliente A', email: 'clienteA.test@example.com', phone: '+55 (11) 99999-0001', address: 'Rua A, 1', city: 'São Paulo', state: 'SP' }
    }
  ];

  for (const o of orders) {
    try {
      console.log('Enviando pedido:', o.id, o.customer.email, o.customer.phone);
      const r = await postOrder(o);
      console.log('Resposta:', r.status, JSON.stringify(r.body));
    } catch (e) {
      console.error('Erro ao enviar', o.id, e && e.message ? e.message : e);
    }
  }
}

run().then(()=> console.log('Teste concluído')).catch(err => console.error('Erro geral:', err));
