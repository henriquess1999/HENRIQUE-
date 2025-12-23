const { getOrdersForAdmin } = require('../server/orders');

function sendJson(res, status, obj){
  if (res.writeHead) res.writeHead(status, { 'Content-Type': 'application/json' });
  try { if (res.status) return res.status(status).json(obj); } catch(e){}
  try { return res.end(JSON.stringify(obj)); } catch(e) { /* ignore */ }
}

module.exports = async (req, res) => {
  // Simple admin protection: require header x-admin-key to match ADMIN_API_KEY env
  const adminKey = process.env.ADMIN_API_KEY || '';
  const provided = (req.headers && (req.headers['x-admin-key'] || req.headers['X-Admin-Key'])) || '';
  if (!adminKey) return sendJson(res, 500, { success: false, error: 'admin_api_key_not_configured' });
  if (!provided || String(provided) !== String(adminKey)) return sendJson(res, 403, { success: false, error: 'forbidden' });

  try {
    const orders = await getOrdersForAdmin();
    return sendJson(res, 200, { success: true, orders });
  } catch (e) {
    console.error('[api/orders] error', e && (e.stack || e));
    return sendJson(res, 500, { success: false, error: e && e.message ? e.message : String(e) });
  }
};
