/**
 * Proxies same-origin /api/* on Vercel → BACKEND_URL + /api/* (your Express app).
 * Vercel env: BACKEND_URL=https://your-api.onrender.com  (no trailing slash, no /api)
 */

function pathSuffixFromRequest(req) {
  const q = req.query.path;
  if (Array.isArray(q) && q.length) return q.join('/');
  if (typeof q === 'string' && q.length) return q;

  const pathOnly = String(req.url || '').split('?')[0];
  const normalized = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;

  if (normalized.startsWith('/api/')) return normalized.slice('/api/'.length) || '';
  if (normalized === '/api') return '';

  return normalized.replace(/^\//, '') || '';
}

async function bodyBufferForProxy(req) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return null;

  const b = req.body;
  if (b !== undefined && b !== null) {
    if (Buffer.isBuffer(b)) return b.length ? b : null;
    if (typeof b === 'string') return b.length ? Buffer.from(b, 'utf8') : null;
    if (typeof b === 'object') return Buffer.from(JSON.stringify(b), 'utf8');
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return chunks.length ? Buffer.concat(chunks) : null;
}

async function handler(req, res) {
  const origin = process.env.BACKEND_URL?.replace(/\/$/, '');
  if (!origin) {
    return res.status(503).json({
      message:
        'API proxy not configured. On Vercel → Settings → Environment Variables, set BACKEND_URL to your Express origin (e.g. https://your-app.onrender.com). Redeploy after saving.'
    });
  }

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  const suffix = pathSuffixFromRequest(req);
  const search = String(req.url || '').includes('?') ? `?${String(req.url).split('?').slice(1).join('?')}` : '';
  const target = `${origin}/api/${suffix}${search}`;

  const headers = new Headers();
  if (req.headers.authorization) headers.set('authorization', req.headers.authorization);
  const ct = req.headers['content-type'];
  if (ct) headers.set('content-type', ct);
  const accept = req.headers.accept;
  if (accept) headers.set('accept', accept);

  let body;
  try {
    body = await bodyBufferForProxy(req);
  } catch (e) {
    return res.status(400).json({ message: 'Could not read request body', detail: String(e?.message || e) });
  }

  try {
    const r = await fetch(target, {
      method: req.method,
      headers,
      body: body && body.length ? body : undefined
    });
    const outCt = r.headers.get('content-type');
    if (outCt) res.setHeader('content-type', outCt);
    res.status(r.status);
    const buf = Buffer.from(await r.arrayBuffer());
    return res.send(buf);
  } catch (e) {
    return res.status(502).json({ message: 'Cannot reach BACKEND_URL', detail: String(e?.message || e) });
  }
}

module.exports = handler;
module.exports.config = {
  maxDuration: 30
};
