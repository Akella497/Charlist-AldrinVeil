// api/auth/user.js
// Возвращает данные текущего авторизованного пользователя

export default function handler(req, res) {
  const cookies = parseCookies(req.headers.cookie || '');
  const login  = cookies.gh_login;
  const avatar = cookies.gh_avatar;

  if (!login) {
    return res.status(401).json({ error: 'Не авторизован' });
  }

  res.json({
    login,
    avatar_url: decodeURIComponent(avatar || '')
  });
}

function parseCookies(cookieStr) {
  return Object.fromEntries(
    cookieStr.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );
}
