// api/auth/user.js
// Возвращает данные текущего авторизованного пользователя

const OWNER = 'Akella497';
const REPO = 'character-sheet';

export default async function handler(req, res) {
  const cookies = parseCookies(req.headers.cookie || '');
  const login  = cookies.gh_login;
  const avatar = cookies.gh_avatar;
  const token = cookies.gh_token;

  if (!login) {
    return res.status(401).json({ error: 'Не авторизован' });
  }

  let canEdit = false;

  if (token) {
    try {
      const repoRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json'
        }
      });

      if (repoRes.ok) {
        const repo = await repoRes.json();
        canEdit = Boolean(repo?.permissions?.push || repo?.permissions?.admin);
      }
    } catch {
      canEdit = false;
    }
  }

  res.json({
    login,
    avatar_url: decodeURIComponent(avatar || ''),
    can_edit: canEdit
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
