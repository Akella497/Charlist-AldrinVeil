// api/auth/callback.js
// GitHub перенаправляет сюда после авторизации

function getRequestBaseUrl(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;

  if (host) return `${proto}://${host}`;
  return process.env.SITE_URL || '';
}

function getReturnTo(req) {
  const { state } = req.query;
  if (!state || typeof state !== 'string') return '/';

  try {
    const decoded = Buffer.from(state, 'base64url').toString('utf-8');
    const parsed = JSON.parse(decoded);
    const returnTo = String(parsed.returnTo || '/');

    // Защита от open redirect: только относительные пути
    if (returnTo.startsWith('/')) return returnTo;
    return '/';
  } catch {
    return '/';
  }
}

export default async function handler(req, res) {
  const { code } = req.query;
  if (!code) return res.status(400).send('Нет кода авторизации');

  const baseUrl = getRequestBaseUrl(req);
  const redirectUri = `${baseUrl}/api/auth/callback`;

  // Меняем code на access_token
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri
    })
  });

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;
  if (!accessToken) return res.status(400).send('Ошибка получения токена');

  // Получаем данные пользователя
  const userRes = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const user = await userRes.json();

  // Сохраняем в cookie (простой вариант — токен в cookie)
  // В production лучше использовать JWT, но для личного проекта этого достаточно
  res.setHeader('Set-Cookie', [
    `gh_token=${accessToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
    `gh_login=${user.login}; Path=/; SameSite=Lax; Max-Age=86400`,
    `gh_avatar=${encodeURIComponent(user.avatar_url)}; Path=/; SameSite=Lax; Max-Age=86400`
  ]);

  res.redirect(getReturnTo(req));
}
