// api/auth/user.js
// Возвращает данные текущего авторизованного пользователя

const OWNER = 'Akella497';

function getAllowedEditors() {
  const editorsFromEnv = (process.env.ALLOWED_EDITORS || '')
    .split(',')
    .map(v => v.trim())
    .filter(Boolean);

  return new Set([OWNER, ...editorsFromEnv]);
}

export default function handler(req, res) {
  const cookies = parseCookies(req.headers.cookie || '');
  const login  = cookies.gh_login;
  const avatar = cookies.gh_avatar;

  if (!login) {
    return res.status(401).json({ error: 'Не авторизован' });
  }

  const allowedEditors = getAllowedEditors();

  res.json({
    login,
    avatar_url: decodeURIComponent(avatar || ''),
    can_edit: allowedEditors.has(login),
    is_owner: login === OWNER
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
