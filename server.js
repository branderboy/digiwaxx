const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Admin password - change this or set via environment variable
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Digiwaxx2024!';

// Store active admin tokens (in-memory, clears on restart)
const adminTokens = new Set();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const db = new Database(path.join(__dirname, 'db', 'digiwaxx.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    artist_name TEXT NOT NULL,
    song_title TEXT NOT NULL,
    record_link TEXT NOT NULL,
    email TEXT NOT NULL,
    selected_tier TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    status TEXT DEFAULT 'new'
  );

  CREATE TABLE IF NOT EXISTS paypal_clicks (
    id TEXT PRIMARY KEY,
    tier TEXT NOT NULL,
    price REAL NOT NULL,
    lead_id TEXT,
    clicked_at TEXT DEFAULT (datetime('now')),
    ip_address TEXT,
    user_agent TEXT,
    FOREIGN KEY (lead_id) REFERENCES leads(id)
  );

  CREATE TABLE IF NOT EXISTS purchases (
    id TEXT PRIMARY KEY,
    lead_id TEXT,
    tier TEXT NOT NULL,
    price REAL NOT NULL,
    paypal_transaction_id TEXT,
    payer_email TEXT,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (lead_id) REFERENCES leads(id)
  );

  CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page TEXT DEFAULT '/',
    referrer TEXT,
    user_agent TEXT,
    ip_address TEXT,
    viewed_at TEXT DEFAULT (datetime('now'))
  );
`);

// Prepared statements
const insertLead = db.prepare(`
  INSERT INTO leads (id, artist_name, song_title, record_link, email, selected_tier)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const insertClick = db.prepare(`
  INSERT INTO paypal_clicks (id, tier, price, lead_id, ip_address, user_agent)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const insertPurchase = db.prepare(`
  INSERT INTO purchases (id, lead_id, tier, price, paypal_transaction_id, payer_email, status)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const insertPageView = db.prepare(`
  INSERT INTO page_views (page, referrer, user_agent, ip_address)
  VALUES (?, ?, ?, ?)
`);

// ============ AUTH MIDDLEWARE ============

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.slice(7);
  if (!adminTokens.has(token)) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  next();
}

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = crypto.randomBytes(32).toString('hex');
    adminTokens.add(token);
    res.json({ ok: true, token });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// ============ PUBLIC API ROUTES ============

// Track page view
app.post('/api/pageview', (req, res) => {
  const { page, referrer } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const ua = req.headers['user-agent'];
  insertPageView.run(page || '/', referrer || null, ua, ip);
  res.json({ ok: true });
});

// Submit lead (form submission)
app.post('/api/leads', (req, res) => {
  const { artist_name, song_title, record_link, email, selected_tier } = req.body;

  if (!artist_name || !song_title || !record_link || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const id = uuidv4();
  insertLead.run(id, artist_name, song_title, record_link, email, selected_tier || null);
  res.json({ ok: true, lead_id: id });
});

// Track PayPal click
app.post('/api/paypal-click', (req, res) => {
  const { tier, price, lead_id } = req.body;

  if (!tier || !price) {
    return res.status(400).json({ error: 'Tier and price are required' });
  }

  const id = uuidv4();
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const ua = req.headers['user-agent'];
  insertClick.run(id, tier, price, lead_id || null, ip, ua);
  res.json({ ok: true, click_id: id });
});

// Record a purchase (called after PayPal confirmation or via admin)
app.post('/api/purchases', (req, res) => {
  const { lead_id, tier, price, paypal_transaction_id, payer_email, status } = req.body;

  if (!tier || !price) {
    return res.status(400).json({ error: 'Tier and price are required' });
  }

  const id = uuidv4();
  insertPurchase.run(id, lead_id || null, tier, price, paypal_transaction_id || null, payer_email || null, status || 'pending');
  res.json({ ok: true, purchase_id: id });
});

// Update purchase status
app.patch('/api/purchases/:id', requireAdmin, (req, res) => {
  const { status, paypal_transaction_id } = req.body;
  const stmt = db.prepare(`
    UPDATE purchases SET status = ?, paypal_transaction_id = COALESCE(?, paypal_transaction_id), updated_at = datetime('now')
    WHERE id = ?
  `);
  const result = stmt.run(status, paypal_transaction_id || null, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Purchase not found' });
  res.json({ ok: true });
});

// ============ ADMIN API ROUTES (Protected) ============

// Get all leads
app.get('/api/admin/leads', requireAdmin, (req, res) => {
  const { status, search, limit, offset } = req.query;
  let query = 'SELECT * FROM leads WHERE 1=1';
  const params = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (search) {
    query += ' AND (artist_name LIKE ? OR email LIKE ? OR song_title LIKE ?)';
    const s = `%${search}%`;
    params.push(s, s, s);
  }

  query += ' ORDER BY created_at DESC';
  query += ` LIMIT ? OFFSET ?`;
  params.push(parseInt(limit) || 50, parseInt(offset) || 0);

  const leads = db.prepare(query).all(...params);
  const total = db.prepare('SELECT COUNT(*) as count FROM leads').get().count;
  res.json({ leads, total });
});

// Update lead status
app.patch('/api/admin/leads/:id', requireAdmin, (req, res) => {
  const { status } = req.body;
  const stmt = db.prepare('UPDATE leads SET status = ? WHERE id = ?');
  const result = stmt.run(status, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Lead not found' });
  res.json({ ok: true });
});

// Delete lead
app.delete('/api/admin/leads/:id', requireAdmin, (req, res) => {
  const stmt = db.prepare('DELETE FROM leads WHERE id = ?');
  const result = stmt.run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Lead not found' });
  res.json({ ok: true });
});

// Get all PayPal clicks
app.get('/api/admin/clicks', requireAdmin, (req, res) => {
  const clicks = db.prepare('SELECT * FROM paypal_clicks ORDER BY clicked_at DESC LIMIT 200').all();
  res.json({ clicks });
});

// Get all purchases
app.get('/api/admin/purchases', requireAdmin, (req, res) => {
  const purchases = db.prepare('SELECT * FROM purchases ORDER BY created_at DESC LIMIT 200').all();
  res.json({ purchases });
});

// Dashboard stats
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const totalLeads = db.prepare('SELECT COUNT(*) as count FROM leads').get().count;
  const newLeads = db.prepare("SELECT COUNT(*) as count FROM leads WHERE status = 'new'").get().count;
  const totalClicks = db.prepare('SELECT COUNT(*) as count FROM paypal_clicks').get().count;
  const totalPurchases = db.prepare('SELECT COUNT(*) as count FROM purchases').get().count;
  const completedPurchases = db.prepare("SELECT COUNT(*) as count FROM purchases WHERE status = 'completed'").get().count;
  const revenue = db.prepare("SELECT COALESCE(SUM(price), 0) as total FROM purchases WHERE status = 'completed'").get().total;
  const pageViews = db.prepare('SELECT COUNT(*) as count FROM page_views').get().count;

  const clicksByTier = db.prepare('SELECT tier, COUNT(*) as count FROM paypal_clicks GROUP BY tier').all();
  const leadsByDay = db.prepare(`
    SELECT date(created_at) as day, COUNT(*) as count
    FROM leads
    WHERE created_at >= datetime('now', '-30 days')
    GROUP BY date(created_at) ORDER BY day
  `).all();

  res.json({
    totalLeads, newLeads, totalClicks, totalPurchases,
    completedPurchases, revenue, pageViews,
    clicksByTier, leadsByDay
  });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`Digiwaxx server running on http://localhost:${PORT}`);
  console.log(`Admin dashboard: http://localhost:${PORT}/admin`);
});
