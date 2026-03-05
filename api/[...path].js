const { Pool } = require('pg');
const crypto = require('crypto');
const https = require('https');

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
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    INSERT INTO settings (key, value) VALUES
      ('paypal_username', 'digiwaxx'),
      ('site_headline', 'NEW MUSIC DESERVES A REAL PUSH'),
      ('site_subheadline', 'Digiwaxx connects your records to the DJs, playlists, and platforms that matter.'),
      ('starter_name', 'STARTER'),
      ('starter_tagline', 'Get In The System'),
      ('starter_description', 'Perfect for artists who need their first real DJ push.'),
      ('pro_name', 'PRO'),
      ('pro_tagline', 'Turn The Lights On'),
      ('pro_description', 'Everything in Starter, plus stronger visibility.'),
      ('elite_name', 'ELITE'),
      ('elite_tagline', 'Heavy Rotation Energy'),
      ('elite_description', 'Everything in Pro, plus deeper industry exposure.'),
      ('resend_api_key', ''),
      ('email_from', 'Digiwaxx <noreply@digiwaxx.com>'),
      ('email1_subject', 'Welcome to Digiwaxx!'),
      ('email1_body', 'Hey {{artist_name}},\n\nThanks for submitting your record "{{song_title}}" to Digiwaxx! We''re excited to check it out.\n\nOur team will review your submission and get back to you shortly.\n\n- The Digiwaxx Team'),
      ('email1_delay_hours', '0'),
      ('email2_subject', 'Your Digiwaxx Submission Update'),
      ('email2_body', 'Hey {{artist_name}},\n\nJust following up on your submission "{{song_title}}". Our team has been reviewing it.\n\nReady to boost your record? Check out our tiers at {{site_url}}\n\n- The Digiwaxx Team'),
      ('email2_delay_hours', '48'),
      ('email3_subject', 'Last Chance - Boost Your Record'),
      ('email3_body', 'Hey {{artist_name}},\n\nDon''t let "{{song_title}}" sit on the shelf. Our DJ network is ready to spin it.\n\nChoose your boost tier: {{site_url}}\n\n- The Digiwaxx Team'),
      ('email3_delay_hours', '120'),
      ('paypal_client_id', ''),
      ('paypal_client_secret', ''),
      ('paypal_mode', 'sandbox'),
      ('logo_url', ''),
      ('video_url', ''),
      ('accent_color', '#FFB800'),
      ('bg_color', '#1a0a18'),
      ('heading_font_size', '100'),
      ('body_font_size', '100'),
      ('meta_title', 'DIGIWAXX | New Music Boost — Get Your Record to DJs'),
      ('meta_description', 'Digiwaxx connects your music to 30,000+ DJs worldwide. Record pool placement, Spotify playlists, radio rotation, and more.'),
      ('og_image_url', ''),
      ('hero_eyebrow', 'The New Music Boost'),
      ('hero_h3', 'YOUR RECORD DESERVES MORE THAN STREAMS.'),
      ('hero_cta_text', 'DROP YOUR RECORD NOW'),
      ('hero_cta_subtext', 'Limited slots available — serious artists only'),
      ('hero_stat1_number', '30K+'),
      ('hero_stat1_label', 'DJs Worldwide'),
      ('hero_stat2_number', '1998'),
      ('hero_stat2_label', 'Est. Year'),
      ('hero_stat3_number', '500+'),
      ('hero_stat3_label', 'Records Pushed'),
      ('problem_heading', 'THE PROBLEM'),
      ('problem_intro', 'You dropped your record. Now what?'),
      ('problem_closing', 'You upload your song. Then it sits.'),
      ('solution_heading', 'THE DIGIWAXX SOLUTION'),
      ('solution_intro', 'What if your record landed in the right hands?'),
      ('solution_closing', 'This isn''t just promo. It''s access to the ecosystem that launches records.'),
      ('solution_cta', 'GET YOUR MUSIC HEARD NOW'),
      ('step1_title', 'SUBMIT YOUR RECORD'),
      ('step1_desc', 'Fill out the form with your artist info and a link to your track. Choose your boost tier.'),
      ('step2_title', 'WE PUSH IT OUT'),
      ('step2_desc', 'Your record gets placed into the Digiwaxx DJ network, record pool, playlists, and radio rotation.'),
      ('step3_title', 'DJs SPIN YOUR TRACK'),
      ('step3_desc', 'Real DJs discover, download, and play your record in clubs, on radio, and in mixes worldwide.'),
      ('video_heading', 'SEE DIGIWAXX IN ACTION'),
      ('video_subtitle', 'Watch how Digiwaxx connects artists to DJs across the globe.'),
      ('boost_cta_text', 'DM "BOOST" ON IG TO START NOW'),
      ('trust_heading', 'TRUSTED BY DJs SINCE 1998'),
      ('trust_body', 'Digiwaxx Services 30,000+ DJs Worldwide across radio, clubs & culture. This isn''t a promo page. It''s a DJ ecosystem.'),
      ('trust_cta', 'DROP YOUR RECORD IN THE RIGHT ROOM.'),
      ('trust_subtext', 'Limited Slots. Serious Artists Only.'),
      ('trust_stat1_number', '30K+'),
      ('trust_stat1_label', 'Active DJs'),
      ('trust_stat2_number', '25+'),
      ('trust_stat2_label', 'Years Running'),
      ('trust_stat3_number', '100+'),
      ('trust_stat3_label', 'Radio Partners'),
      ('final_cta_heading', 'DROP YOUR RECORD IN THE RIGHT ROOM'),
      ('final_cta_body', 'If your song is ready, it deserves to reach the DJs who matter.'),
      ('final_cta_highlight', 'Limited Slots. Serious Artists Only.'),
      ('footer_text', '© 2026 Digiwaxx Media Group. All rights reserved. Trusted by DJs since 1998.'),
      ('pricing_heading', 'CHOOSE YOUR BOOST'),
      ('pricing_subtitle', 'Every tier gets your record into the Digiwaxx DJ network. Choose how loud you want to go.')
    ON CONFLICT (key) DO NOTHING;
    CREATE TABLE IF NOT EXISTS email_queue (
      id SERIAL PRIMARY KEY,
      lead_id TEXT REFERENCES leads(id),
      email_to TEXT NOT NULL,
      step INTEGER NOT NULL,
      scheduled_at TIMESTAMPTZ NOT NULL,
      sent_at TIMESTAMPTZ,
      status TEXT DEFAULT 'pending'
    );
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

async function getSetting(key) {
  const { rows } = await pool.query('SELECT value FROM settings WHERE key = $1', [key]);
  return rows[0]?.value || '';
}

async function getSettings(keys) {
  const { rows } = await pool.query('SELECT key, value FROM settings WHERE key = ANY($1)', [keys]);
  const map = {};
  rows.forEach(r => map[r.key] = r.value);
  return map;
}

function sendResendEmail(apiKey, from, to, subject, html) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ from, to: [to], subject, html: html.replace(/\n/g, '<br>') });
    const req = https.request({
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getPaypalToken(clientId, clientSecret, mode) {
  const host = mode === 'live' ? 'api-m.paypal.com' : 'api-m.sandbox.paypal.com';
  const auth = Buffer.from(clientId + ':' + clientSecret).toString('base64');
  return new Promise((resolve, reject) => {
    const data = 'grant_type=client_credentials';
    const req = https.request({
      hostname: host,
      path: '/v1/oauth2/token',
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + auth,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(body) }); }
        catch { resolve({ status: res.statusCode, data: body }); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
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

    if (url === '/api/site-content' && req.method === 'GET') {
      const { rows } = await pool.query("SELECT key, value FROM settings WHERE key NOT LIKE 'paypal_client%' AND key NOT LIKE 'resend_%' AND key != 'paypal_mode'");
      const content = {};
      rows.forEach(r => content[r.key] = r.value);
      return json(res, content);
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
      // Queue 3-step email automation
      try {
        const delays = await getSettings(['email1_delay_hours', 'email2_delay_hours', 'email3_delay_hours']);
        for (let step = 1; step <= 3; step++) {
          const hours = parseInt(delays[`email${step}_delay_hours`]) || 0;
          await pool.query(
            'INSERT INTO email_queue (lead_id, email_to, step, scheduled_at) VALUES ($1, $2, $3, NOW() + ($4 || \' hours\')::interval)',
            [id, email, step, String(hours)]
          );
        }
      } catch (e) { console.error('Failed to queue emails:', e); }
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

    // ===== ADMIN SETTINGS =====
    if (url === '/api/admin/settings' && req.method === 'GET') {
      if (!checkAdmin(req)) return json(res, { error: 'Unauthorized' }, 401);
      const { rows } = await pool.query('SELECT key, value FROM settings ORDER BY key');
      const settings = {};
      rows.forEach(r => settings[r.key] = r.value);
      return json(res, { settings });
    }

    if (url === '/api/admin/settings' && req.method === 'POST') {
      if (!checkAdmin(req)) return json(res, { error: 'Unauthorized' }, 401);
      const { settings } = body;
      if (!settings || typeof settings !== 'object') return json(res, { error: 'Settings object required' }, 400);
      for (const [key, value] of Object.entries(settings)) {
        await pool.query('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2', [key, String(value)]);
      }
      return json(res, { ok: true });
    }

    // ===== PAYPAL TEST =====
    if (url === '/api/admin/paypal-test' && req.method === 'POST') {
      if (!checkAdmin(req)) return json(res, { error: 'Unauthorized' }, 401);
      const creds = await getSettings(['paypal_client_id', 'paypal_client_secret', 'paypal_mode']);
      if (!creds.paypal_client_id || !creds.paypal_client_secret) {
        return json(res, { error: 'PayPal Client ID and Secret are required. Save them first.' }, 400);
      }
      try {
        const result = await getPaypalToken(creds.paypal_client_id, creds.paypal_client_secret, creds.paypal_mode || 'sandbox');
        if (result.status === 200 && result.data.access_token) {
          return json(res, { ok: true, app_id: result.data.app_id });
        }
        return json(res, { error: result.data.error_description || 'Authentication failed. Check your credentials.' }, 400);
      } catch (e) {
        return json(res, { error: 'Connection failed: ' + e.message }, 500);
      }
    }

    // ===== EMAIL QUEUE =====
    if (url === '/api/admin/emails' && req.method === 'GET') {
      if (!checkAdmin(req)) return json(res, { error: 'Unauthorized' }, 401);
      const { rows } = await pool.query(`
        SELECT eq.*, l.artist_name, l.song_title
        FROM email_queue eq
        LEFT JOIN leads l ON l.id = eq.lead_id
        ORDER BY eq.scheduled_at DESC LIMIT 100
      `);
      return json(res, { emails: rows });
    }

    if (url === '/api/admin/process-emails' && req.method === 'POST') {
      if (!checkAdmin(req)) return json(res, { error: 'Unauthorized' }, 401);
      const apiKey = await getSetting('resend_api_key');
      if (!apiKey) return json(res, { error: 'Resend API key not configured' }, 400);
      const fromAddr = await getSetting('email_from');

      const { rows: pending } = await pool.query(
        "SELECT eq.*, l.artist_name, l.song_title, l.record_link FROM email_queue eq LEFT JOIN leads l ON l.id = eq.lead_id WHERE eq.status = 'pending' AND eq.scheduled_at <= NOW() ORDER BY eq.scheduled_at ASC LIMIT 20"
      );

      let sent = 0;
      for (const email of pending) {
        const s = await getSettings([`email${email.step}_subject`, `email${email.step}_body`]);
        const siteUrl = req.headers.host ? ('https://' + req.headers.host) : '';
        let subject = s[`email${email.step}_subject`] || '';
        let emailBody = s[`email${email.step}_body`] || '';
        const replacements = { '{{artist_name}}': email.artist_name, '{{song_title}}': email.song_title, '{{record_link}}': email.record_link, '{{site_url}}': siteUrl };
        for (const [k, v] of Object.entries(replacements)) {
          subject = subject.split(k).join(v || '');
          emailBody = emailBody.split(k).join(v || '');
        }
        try {
          await sendResendEmail(apiKey, fromAddr, email.email_to, subject, emailBody);
          await pool.query("UPDATE email_queue SET status = 'sent', sent_at = NOW() WHERE id = $1", [email.id]);
          sent++;
        } catch (e) {
          await pool.query("UPDATE email_queue SET status = 'failed' WHERE id = $1", [email.id]);
        }
      }
      return json(res, { ok: true, processed: pending.length, sent });
    }

    return json(res, { error: 'Not found' }, 404);

  } catch (err) {
    console.error('API error:', err);
    return json(res, { error: 'Server error', detail: err.message }, 500);
  }
};
