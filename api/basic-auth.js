import fs from 'node:fs';
import path from 'node:path';

const USER = process.env.BASIC_AUTH_USER || 'janos';
const PASS = process.env.BASIC_AUTH_PASS || 'change-me';

function unauthorized(res) {
  res.statusCode = 401;
  res.setHeader('WWW-Authenticate', 'Basic realm="Protected"');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('Authentication required');
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.js':
      return 'application/javascript; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.png':
      return 'image/png';
    case '.svg':
      return 'image/svg+xml; charset=utf-8';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.ico':
      return 'image/x-icon';
    default:
      return 'application/octet-stream';
  }
}

function safeJoin(base, target) {
  const targetPath = path.normalize(target).replace(/^([/\\])+/, '');
  const joined = path.join(base, targetPath);
  if (!joined.startsWith(base)) return null;
  return joined;
}

export default function handler(req, res) {
  const auth = req.headers.authorization || '';
  const [type, token] = auth.split(' ');

  if (type !== 'Basic' || !token) return unauthorized(res);

  let decoded = '';
  try {
    decoded = Buffer.from(token, 'base64').toString('utf8');
  } catch {
    return unauthorized(res);
  }

  const idx = decoded.indexOf(':');
  const u = idx >= 0 ? decoded.slice(0, idx) : decoded;
  const p = idx >= 0 ? decoded.slice(idx + 1) : '';

  if (u !== USER || p !== PASS) return unauthorized(res);

  const distDir = path.join(process.cwd(), 'dist');

  const url = new URL(req.url, 'http://localhost');
  const requestedPath = url.searchParams.get('path') || '';

  // For SPA routes, serve index.html unless it looks like a static asset request.
  let candidate = requestedPath ? `/${requestedPath}` : '/';
  if (!candidate.startsWith('/')) candidate = `/${candidate}`;

  const looksLikeAsset = path.extname(candidate) !== '';
  const fileRel = candidate === '/' ? 'index.html' : candidate.slice(1);
  const filePath = looksLikeAsset ? safeJoin(distDir, fileRel) : path.join(distDir, 'index.html');

  if (!filePath) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Bad request');
    return;
  }

  try {
    if (!fs.existsSync(filePath)) {
      // fallback to index.html for unknown paths
      const fallback = path.join(distDir, 'index.html');
      res.statusCode = 200;
      res.setHeader('Content-Type', contentType(fallback));
      res.setHeader('Cache-Control', 'no-store');
      res.end(fs.readFileSync(fallback));
      return;
    }

    const stat = fs.statSync(filePath);
    if (!stat.isFile()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end('Not found');
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType(filePath));

    // Keep HTML un-cached, let assets be cached a bit.
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }

    res.end(fs.readFileSync(filePath));
  } catch {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Server error');
  }
}
