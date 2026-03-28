/**
 * Proxies same-origin /api/* from the Vercel site to your Express API.
 * Set on Vercel: BACKEND_URL=https://your-api-host.example.com (no /api suffix).
 *
 * Local dev: Vite proxies /api → localhost:4000; see frontend/web/vite.config.js
 */
module.exports = async function handler(req, res) {
  const origin = process.env.BACKEND_URL?.replace(/\/$/, '');
  if (!origin) {
    return res.status(503).json({
      message:
        'API proxy not configured. On Vercel, set BACKEND_URL to your Express server origin (e.g. https://your-app.onrender.com).'
    });
  }

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  const parts = req.query.path;
  const suffix = Array.isArray(parts) ? parts.join('/') : parts || '';
  const url = new URL(req.url, 'http://localhost');
  const target = `${origin}/api/${suffix}${url.search}`;

  const headers = new Headers();
  if (req.headers.authorization) headers.set('authorization', req.headers.authorization);
  const ct = req.headers['content-type'];
  if (ct) headers.set('content-type', ct);

  let body;
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    if (req.body !== undefined && req.body !== null) {
      body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }
  }

  try {
    const r = await fetch(target, { method: req.method, headers, body });
    const outCt = r.headers.get('content-type');
    if (outCt) res.setHeader('content-type', outCt);
    res.status(r.status);
    const buf = Buffer.from(await r.arrayBuffer());
    return res.send(buf);
  } catch (e) {
    return res.status(502).json({ message: 'Cannot reach BACKEND_URL', detail: String(e?.message || e) });
  }
};
