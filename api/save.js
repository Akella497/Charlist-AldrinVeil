// api/save.js
// Сохраняет изменённый index.html прямо в GitHub репозиторий

const OWNER      = 'Akella497';           // ✏️ твой GitHub логин
const REPO       = 'character-sheet';     // ✏️ название репозитория
const FILE_PATH  = 'index.html';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Проверяем что запрос от владельца
  const cookies = parseCookies(req.headers.cookie || '');
  const login   = cookies.gh_login;
  const token   = cookies.gh_token;

  if (login !== OWNER) {
    return res.status(403).json({ error: 'Нет доступа' });
  }

  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Нет содержимого' });

  try {
    // Получаем текущий SHA файла (нужен для обновления)
    const getRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`,
      { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } }
    );

    let sha = null;
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    }

    // Кодируем контент в base64
    const encoded = Buffer.from(content, 'utf-8').toString('base64');

    // Отправляем коммит
    const body = {
      message: `✦ Обновление листа персонажа [${new Date().toLocaleString('ru')}]`,
      content: encoded,
      ...(sha ? { sha } : {})
    };

    const putRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    );

    if (!putRes.ok) {
      const err = await putRes.json();
      return res.status(500).json({ error: err.message });
    }

    res.json({ ok: true });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

function parseCookies(cookieStr) {
  return Object.fromEntries(
    cookieStr.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );
}
