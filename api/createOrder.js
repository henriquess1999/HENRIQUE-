const { insertClient, createOrder, insertOrderItems } = require('../server/orders');

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  try {
    const body = await parseBody(req);
    const cliente = body.cliente || body.customer || null;
    const pedido = body.pedido || body.order || null;
    const itens = body.itens || body.items || [];

    if (!cliente || !pedido) return res.status(400).json({ error: 'missing_client_or_order' });

    // 1) Insert or get client
    const insertedClient = await insertClient(Object.assign({}, cliente));

    // 2) Create order with cliente_id
    const orderPayload = Object.assign({}, pedido, { cliente_id: insertedClient.id });
    const createdOrder = await createOrder(orderPayload);

    // 3) Insert items mapped to pedido_id
    const itemsPayload = (Array.isArray(itens) ? itens : []).map(it => Object.assign({}, it, { pedido_id: createdOrder.id }));
    const insertedItems = itemsPayload.length ? await insertOrderItems(itemsPayload) : [];

    return res.status(200).json({ success: true, cliente: insertedClient, pedido: createdOrder, itens: insertedItems });
  } catch (e) {
    console.error('[api/createOrder] error', e && (e.stack || e));
    return res.status(500).json({ success: false, error: e && e.message ? e.message : String(e) });
  }
};
