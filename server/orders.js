const fs = require('fs');
const path = require('path');

function getDataDir() {
  try {
    const projectData = path.join(__dirname, '..', 'data');
    if (fs.existsSync(projectData) && fs.statSync(projectData).isDirectory()) return projectData;
  } catch (e) {}
  return path.join(__dirname, '..', 'data');
}

function readJson(file, defaultValue) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8') || 'null') || defaultValue; } catch (e) { return defaultValue; }
}

function writeJson(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2), 'utf8');
}

async function insertClient(client) {
  if (!client || typeof client !== 'object') throw new Error('invalid_client');
  const dataDir = getDataDir();
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const clientsFile = path.join(dataDir, 'clients.json');
  const existing = readJson(clientsFile, []);
  if (client.email) {
    const found = existing.find(c => c && c.email && String(c.email).toLowerCase() === String(client.email).toLowerCase());
    if (found) return found;
  }
  const toInsert = Object.assign({}, client);
  toInsert.id = toInsert.id || ('C-' + Date.now());
  existing.unshift(toInsert);
  writeJson(clientsFile, existing.slice(0, 2000));
  return toInsert;
}

async function createOrder(order) {
  if (!order || typeof order !== 'object') throw new Error('invalid_order');
  const dataDir = getDataDir();
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const ordersFile = path.join(dataDir, 'orders.json');
  const existing = readJson(ordersFile, []);
  const toInsert = Object.assign({}, order);
  toInsert.id = toInsert.id || ('ORD-' + Date.now());
  toInsert.createdAt = toInsert.createdAt || new Date().toISOString();
  // replace any existing with same id
  const filtered = existing.filter(o => String(o.id) !== String(toInsert.id));
  filtered.unshift(toInsert);
  writeJson(ordersFile, filtered.slice(0, 200));
  return toInsert;
}

async function insertOrderItems(items) {
  if (!Array.isArray(items)) throw new Error('invalid_items');
  const dataDir = getDataDir();
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const itemsFile = path.join(dataDir, 'order_items.json');
  const existing = readJson(itemsFile, []);
  const toInsert = items.map(i => Object.assign({ id: ('I-' + Date.now() + '-' + Math.floor(Math.random()*1000)) }, i));
  const merged = toInsert.concat(existing).slice(0, 5000);
  writeJson(itemsFile, merged);
  return toInsert;
}

async function getOrdersForAdmin() {
  const dataDir = getDataDir();
  const ordersFile = path.join(dataDir, 'orders.json');
  return readJson(ordersFile, []);
}

module.exports = {
  insertClient,
  createOrder,
  insertOrderItems,
  getOrdersForAdmin
};
