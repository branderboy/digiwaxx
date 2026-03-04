require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
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

// Database setup (Neon PostgreSQL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      artist_name TEXT NOT NULL,
      song_title TEXT NOT NULL,
      record_link TEXT NOT NULL,
      email TEXT NOT NULL,
      selected_tier TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      status TEXT DEFAULT 'new'
    );

    CREATE TABLE IF NOT EXISTS paypal_clicks (
      id TEXT PRIMARY KEY,
      tier TEXT NOT NULL,
      price REAL NOT NULL,
      lead_id TEXT REFERENCES leads(id),
      clicked_at TIMESTAMPTZ DEFAULT NOW(),
      ip_address TEXT,
      user_agent TEXT
    );

    CREATE TABLE IF NOT EXISTS purchases (
      id TEXT PRIMARY KEY,
      lead_id TEXT REFERENCES leads(id),
      tier TEXT NOT NULL,
      price REAL NOT NULL,
      paypal_transaction_id TEXT,
      payer_email TEXT,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS page_views (
      id SERIAL PRIMARY KEY,
      page TEXT DEFAULT '/',
      referrer TEXT,
      user_agent TEXT,
      ip_address TEXT,
      viewed_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('Database tables ready');
}

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
app.post('/api/pageview', async (req, res) => {
  try {
    const { page, referrer } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ua = req.headers['user-agent'];
    await pool.query(
      'INSERT INTO page_views (page, referrer, user_agent, ip_address) VALUES ($1, $2, $3, $4)',
      [page || '/', referrer || null, ua, ip]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('Pageview error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit lead (form submission)
app.post('/api/leads', async (req, res) => {
  try {
    const { artist_name, song_title, record_link, email, selected_tier } = req.body;

    if (!artist_name || !song_title || !record_link || !email) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const id = uuidv4();
    await pool.query(
      'INSERT INTO leads (id, artist_name, song_title, record_link, email, selected_tier) VALUES ($1, $2, $3, $4, $5, $6)',
      [id, artist_name, song_title, record_link, email, selected_tier || null]
    );
    res.json({ ok: true, lead_id: id });
  } catch (err) {
    console.error('Lead error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Track PayPal click
app.post('/api/paypal-click', async (req, res) => {
  try {
    const { tier, price, lead_id } = req.body;

    if (!tier || !price) {
      return res.status(400).json({ error: 'Tier and price are required' });
    }

    const id = uuidv4();
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ua = req.headers['user-agent'];
    await pool.query(
      'INSERT INTO paypal_clicks (id, tier, price, lead_id, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5, $6)',
      [id, tier, price, lead_id || null, ip, ua]
    );
    res.json({ ok: true, click_id: id });
  } catch (err) {
    console.error('Click error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Record a purchase (called after PayPal confirmation or via admin)
app.post('/api/purchases', async (req, res) => {
  try {
    const { lead_id, tier, price, paypal_transaction_id, payer_email, status } = req.body;

    if (!tier || !price) {
      return res.status(400).json({ error: 'Tier and price are required' });
    }

    const id = uuidv4();
    await pool.query(
      'INSERT INTO purchases (id, lead_id, tier, price, paypal_transaction_id, payer_email, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [id, lead_id || null, tier, price, paypal_transaction_id || null, payer_email || null, status || 'pending']
    );
    res.json({ ok: true, purchase_id: id });
  } catch (err) {
    console.error('Purchase error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update purchase status
app.patch('/api/purchases/:id', requireAdmin, async (req, res) => {
  try {
    const { status, paypal_transaction_id } = req.body;
    const result = await pool.query(
      'UPDATE purchases SET status = $1, paypal_transaction_id = COALESCE($2, paypal_transaction_id), updated_at = NOW() WHERE id = $3',
      [status, paypal_transaction_id || null, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Purchase not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Update purchase error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ============ ADMIN API ROUTES (Protected) ============

// Get all leads
app.get('/api/admin/leads', requireAdmin, async (req, res) => {
  try {
    const { status, search, limit, offset } = req.query;
    let query = 'SELECT * FROM leads WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (status) {
      query += ` AND status = $${paramIndex++}`;
      params.push(status);
    }
    if (search) {
      const s = `%${search}%`;
      query += ` AND (artist_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex + 1} OR song_title ILIKE $${paramIndex + 2})`;
      paramIndex += 3;
      params.push(s, s, s);
    }

    query += ' ORDER BY created_at DESC';
    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(parseInt(limit) || 50, parseInt(offset) || 0);

    const { rows: leads } = await pool.query(query, params);
    const { rows: [{ count: total }] } = await pool.query('SELECT COUNT(*) as count FROM leads');
    res.json({ leads, total: parseInt(total) });
  } catch (err) {
    console.error('Get leads error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update lead status
app.patch('/api/admin/leads/:id', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const result = await pool.query('UPDATE leads SET status = $1 WHERE id = $2', [status, req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Lead not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Update lead error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete lead
app.delete('/api/admin/leads/:id', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM leads WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Lead not found' });
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete lead error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all PayPal clicks
app.get('/api/admin/clicks', requireAdmin, async (req, res) => {
  try {
    const { rows: clicks } = await pool.query('SELECT * FROM paypal_clicks ORDER BY clicked_at DESC LIMIT 200');
    res.json({ clicks });
  } catch (err) {
    console.error('Get clicks error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all purchases
app.get('/api/admin/purchases', requireAdmin, async (req, res) => {
  try {
    const { rows: purchases } = await pool.query('SELECT * FROM purchases ORDER BY created_at DESC LIMIT 200');
    res.json({ purchases });
  } catch (err) {
    console.error('Get purchases error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Dashboard stats
app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    const [
      { rows: [{ count: totalLeads }] },
      { rows: [{ count: newLeads }] },
      { rows: [{ count: totalClicks }] },
      { rows: [{ count: totalPurchases }] },
      { rows: [{ count: completedPurchases }] },
      { rows: [{ total: revenue }] },
      { rows: [{ count: pageViews }] },
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM leads'),
      pool.query("SELECT COUNT(*) as count FROM leads WHERE status = 'new'"),
      pool.query('SELECT COUNT(*) as count FROM paypal_clicks'),
      pool.query('SELECT COUNT(*) as count FROM purchases'),
      pool.query("SELECT COUNT(*) as count FROM purchases WHERE status = 'completed'"),
      pool.query("SELECT COALESCE(SUM(price), 0) as total FROM purchases WHERE status = 'completed'"),
      pool.query('SELECT COUNT(*) as count FROM page_views'),
    ]);

    const { rows: clicksByTier } = await pool.query('SELECT tier, COUNT(*) as count FROM paypal_clicks GROUP BY tier');
    const { rows: leadsByDay } = await pool.query(`
      SELECT created_at::date as day, COUNT(*) as count
      FROM leads
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY created_at::date ORDER BY day
    `);

    res.json({
      totalLeads: parseInt(totalLeads),
      newLeads: parseInt(newLeads),
      totalClicks: parseInt(totalClicks),
      totalPurchases: parseInt(totalPurchases),
      completedPurchases: parseInt(completedPurchases),
      revenue: parseFloat(revenue),
      pageViews: parseInt(pageViews),
      clicksByTier,
      leadsByDay
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Initialize DB then start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Digiwaxx server running on http://localhost:${PORT}`);
    console.log(`Admin dashboard: http://localhost:${PORT}/admin`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
