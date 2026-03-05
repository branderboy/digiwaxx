const { Pool } = require('pg');
const crypto = require('crypto');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const TOKEN_SECRET = process.env.ADMIN_PASSWORD || 'admin123';

let dbInitialized = false;
async function initDB() {
  if (dbInitialized) return;
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
    CREATE TABLE IF NOT EXISTS tier_prices (
      tier TEXT PRIMARY KEY,
      price REAL NOT NULL
    );
    INSERT INTO tier_prices (tier, price) VALUES ('starter', 99), ('pro', 149), ('elite', 199) ON CONFLICT (tier) DO NOTHING;
  `);
  dbInitialized = true;
}

function uuid() {
  return crypto.randomUUID();
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
}

function json(res, data, status = 200) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

function getBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); }
      catch { resolve({}); }
    });
    req.on('error', reject);
  });
}

function signToken() {
  const payload = Buffer.from(JSON.stringify({ role: 'admin', iat: Date.now() })).toString('base64url');
  const sig = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url');
  return payload + '.' + sig;
}

function checkAdmin(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return false;
  const token = auth.slice(7);
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url');
  return sig === expected;
}

module.exports = async (req, res) => {
  cors(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  const url = req.url.split('?')[0];
  const query = Object.fromEntries(new URL(req.url, 'http://localhost').searchParams);

  // Health check
  if (url === '/api/health') {
    return json(res, { ok: true, env: { hasDbUrl: !!process.env.DATABASE_URL, hasAdminPw: !!process.env.ADMIN_PASSWORD, adminPwLength: (process.env.ADMIN_PASSWORD || '').length } });
  }

  // Init DB for all other routes
  try {
    await initDB();
  } catch (err) {
    return json(res, { error: 'Database initialization failed', detail: err.message }, 500);
  }

  const body = req.method !== 'GET' ? await getBody(req) : {};

  try {
    // ===== ADMIN LOGIN =====
    if (url === '/api/admin/login' && req.method === 'POST') {
      if (body.password === ADMIN_PASSWORD) {
        const token = signToken();
        return json(res, { ok: true, token });
      }
      return json(res, { error: 'Invalid password' }, 401);
    }

    // ===== PUBLIC ROUTES =====
    if (url === '/api/prices' && req.method === 'GET') {
      const { rows } = await pool.query('SELECT tier, price FROM tier_prices ORDER BY price ASC');
      const prices = {};
      rows.forEach(r => prices[r.tier] = r.price);
      return json(res, prices);
    }

    if (url === '/api/pageview' && req.method === 'POST') {
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const ua = req.headers['user-agent'];
      await pool.query(
        'INSERT INTO page_views (page, referrer, user_agent, ip_address) VALUES ($1, $2, $3, $4)',
        [body.page || '/', body.referrer || null, ua, ip]
      );
      return json(res, { ok: true });
    }

    if (url === '/api/leads' && req.method === 'POST') {
      const { artist_name, song_title, record_link, email, selected_tier } = body;
      if (!artist_name || !song_title || !record_link || !email) {
        return json(res, { error: 'All fields are required' }, 400);
      }
      const id = uuid();
      await pool.query(
        'INSERT INTO leads (id, artist_name, song_title, record_link, email, selected_tier) VALUES ($1, $2, $3, $4, $5, $6)',
        [id, artist_name, song_title, record_link, email, selected_tier || null]
      );
      return json(res, { ok: true, lead_id: id });
    }

    if (url === '/api/paypal-click' && req.method === 'POST') {
      const { tier, price, lead_id } = body;
      if (!tier || !price) return json(res, { error: 'Tier and price are required' }, 400);
      const id = uuid();
      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const ua = req.headers['user-agent'];
      await pool.query(
        'INSERT INTO paypal_clicks (id, tier, price, lead_id, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5, $6)',
        [id, tier, price, lead_id || null, ip, ua]
      );
      return json(res, { ok: true, click_id: id });
    }

    if (url === '/api/purchases' && req.method === 'POST') {
      const { lead_id, tier, price, paypal_transaction_id, payer_email, status } = body;
      if (!tier || !price) return json(res, { error: 'Tier and price are required' }, 400);
      const id = uuid();
      await pool.query(
        'INSERT INTO purchases (id, lead_id, tier, price, paypal_transaction_id, payer_email, status) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [id, lead_id || null, tier, price, paypal_transaction_id || null, payer_email || null, status || 'pending']
      );
      return json(res, { ok: true, purchase_id: id });
    }

    if (url.startsWith('/api/purchases/') && req.method === 'PATCH') {
      if (!checkAdmin(req)) return json(res, { error: 'Unauthorized' }, 401);
      const id = url.split('/api/purchases/')[1];
      const { status, paypal_transaction_id } = body;
      const result = await pool.query(
        'UPDATE purchases SET status = $1, paypal_transaction_id = COALESCE($2, paypal_transaction_id), updated_at = NOW() WHERE id = $3',
        [status, paypal_transaction_id || null, id]
      );
      if (result.rowCount === 0) return json(res, { error: 'Purchase not found' }, 404);
      return json(res, { ok: true });
    }

    // ===== ADMIN ROUTES =====
    if (url === '/api/admin/leads' && req.method === 'GET') {
      if (!checkAdmin(req)) return json(res, { error: 'Unauthorized' }, 401);
      const { status, search, limit, offset } = query;
      let q = 'SELECT * FROM leads WHERE 1=1';
      const params = [];
      let pi = 1;
      if (status === 'recent') { q += ` AND created_at >= NOW() - INTERVAL '30 days'`; }
      else if (status) { q += ` AND status = $${pi++}`; params.push(status); }
      if (search) {
        const s = `%${search}%`;
        q += ` AND (artist_name ILIKE $${pi} OR email ILIKE $${pi + 1} OR song_title ILIKE $${pi + 2})`;
        pi += 3; params.push(s, s, s);
      }
      q += ' ORDER BY created_at DESC';
      q += ` LIMIT $${pi++} OFFSET $${pi++}`;
      params.push(parseInt(limit) || 50, parseInt(offset) || 0);
      const { rows: leads } = await pool.query(q, params);
      const { rows: [{ count: total }] } = await pool.query('SELECT COUNT(*) as count FROM leads');
      return json(res, { leads, total: parseInt(total) });
    }

    if (url.startsWith('/api/admin/leads/') && req.method === 'PATCH') {
      if (!checkAdmin(req)) return json(res, { error: 'Unauthorized' }, 401);
      const id = url.split('/api/admin/leads/')[1];
      const result = await pool.query('UPDATE leads SET status = $1 WHERE id = $2', [body.status, id]);
      if (result.rowCount === 0) return json(res, { error: 'Lead not found' }, 404);
      return json(res, { ok: true });
    }

    if (url.startsWith('/api/admin/leads/') && req.method === 'DELETE') {
      if (!checkAdmin(req)) return json(res, { error: 'Unauthorized' }, 401);
      const id = url.split('/api/admin/leads/')[1];
      const result = await pool.query('DELETE FROM leads WHERE id = $1', [id]);
      if (result.rowCount === 0) return json(res, { error: 'Lead not found' }, 404);
      return json(res, { ok: true });
    }

    if (url === '/api/admin/clicks' && req.method === 'GET') {
      if (!checkAdmin(req)) return json(res, { error: 'Unauthorized' }, 401);
      const { rows: clicks } = await pool.query('SELECT * FROM paypal_clicks ORDER BY clicked_at DESC LIMIT 200');
      return json(res, { clicks });
    }

    if (url === '/api/admin/purchases' && req.method === 'GET') {
      if (!checkAdmin(req)) return json(res, { error: 'Unauthorized' }, 401);
      const { rows: purchases } = await pool.query('SELECT * FROM purchases ORDER BY created_at DESC LIMIT 200');
      return json(res, { purchases });
    }

    if (url === '/api/admin/stats' && req.method === 'GET') {
      if (!checkAdmin(req)) return json(res, { error: 'Unauthorized' }, 401);
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
        pool.query("SELECT COUNT(*) as count FROM leads WHERE created_at >= NOW() - INTERVAL '30 days'"),
        pool.query('SELECT COUNT(*) as count FROM paypal_clicks'),
        pool.query('SELECT COUNT(*) as count FROM purchases'),
        pool.query("SELECT COUNT(*) as count FROM purchases WHERE status = 'completed'"),
        pool.query("SELECT COALESCE(SUM(price), 0) as total FROM purchases WHERE status = 'completed'"),
        pool.query('SELECT COUNT(*) as count FROM page_views'),
      ]);
      const { rows: clicksByTier } = await pool.query('SELECT tier, COUNT(*) as count FROM paypal_clicks GROUP BY tier');
      const { rows: leadsByDay } = await pool.query(`
        SELECT created_at::date as day, COUNT(*) as count
        FROM leads WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY created_at::date ORDER BY day
      `);
      return json(res, {
        totalLeads: parseInt(totalLeads), newLeads: parseInt(newLeads),
        totalClicks: parseInt(totalClicks), totalPurchases: parseInt(totalPurchases),
        completedPurchases: parseInt(completedPurchases), revenue: parseFloat(revenue),
        pageViews: parseInt(pageViews), clicksByTier, leadsByDay
      });
    }

    if (url === '/api/admin/prices' && req.method === 'GET') {
      if (!checkAdmin(req)) return json(res, { error: 'Unauthorized' }, 401);
      const { rows } = await pool.query('SELECT tier, price FROM tier_prices ORDER BY price ASC');
      return json(res, { prices: rows });
    }

    if (url === '/api/admin/prices' && req.method === 'POST') {
      if (!checkAdmin(req)) return json(res, { error: 'Unauthorized' }, 401);
      const { tier, price } = body;
      if (!tier || !price) return json(res, { error: 'Tier and price required' }, 400);
      await pool.query('UPDATE tier_prices SET price = $1 WHERE tier = $2', [parseFloat(price), tier.toLowerCase()]);
      return json(res, { ok: true });
    }

    return json(res, { error: 'Not found' }, 404);

  } catch (err) {
    console.error('API error:', err);
    return json(res, { error: 'Server error', detail: err.message }, 500);
  }
};
