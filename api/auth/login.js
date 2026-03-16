// api/auth/login.js
// Перенаправляет пользователя на GitHub для авторизации

function getRequestBaseUrl(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;

  if (host) return `${proto}://${host}`;
  return process.env.SITE_URL || '';
}

function normalizeBaseUrl(url) {
  return String(url || '').replace(/\/$/, '');
}

function getOAuthBaseUrl(req) {
  // Для GitHub OAuth redirect_uri должен совпадать с callback URL в настройках OAuth App.
  // Поэтому используем фиксированный SITE_URL (канонический домен).
  const siteUrl = normalizeBaseUrl(process.env.SITE_URL);
  if (siteUrl) return siteUrl;

  // Fallback для локальной разработки
  return normalizeBaseUrl(getRequestBaseUrl(req));
}

function buildState(req) {
  const referer = req.headers.referer || '/';

  // Разрешаем только относительный путь на текущем хосте.
  let returnTo = '/';
  try {
    const base = getRequestBaseUrl(req) || 'https://example.local';
    const url = new URL(referer, base);
    returnTo = `${url.pathname}${url.search}${url.hash}`;
  } catch {
    returnTo = '/';
  }

  return Buffer.from(JSON.stringify({ returnTo }), 'utf-8').toString('base64url');
}

export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const baseUrl = getOAuthBaseUrl(req);
  const redirectUri = `${baseUrl}/api/auth/callback`;
  const scope = 'read:user repo';
  const state = buildState(req);

  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${encodeURIComponent(state)}`;
  res.redirect(url);
}
