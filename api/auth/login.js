// api/auth/login.js
// Перенаправляет пользователя на GitHub для авторизации

export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${process.env.SITE_URL}/api/auth/callback`;
  const scope = 'read:user';

  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
  res.redirect(url);
}
