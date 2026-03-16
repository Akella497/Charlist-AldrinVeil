// api/save.js
// Сохраняет данные персонажа (JSON) в GitHub репозиторий

const OWNER     = 'Akella497';
const REPO      = 'character-sheet';
const FILE_PATH = 'data.json';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // Проверяем что запрос строго от владельца
  const cookies = parseCookies(req.headers.cookie || '');
  const login   = cookies.gh_login;
  const token   = cookies.gh_token;

  if (!login || !token) {
    return res.status(401).json({ error: 'Не авторизован' });
  }

  if (login !== OWNER) {
    return res.status(403).json({ error: 'Нет доступа' });
  }

  const { data } = req.body;
  if (!data) return res.status(400).json({ error: 'Нет данных' });

  const content = JSON.stringify(data, null, 2);

  try {
    // Получаем текущий SHA файла
    let sha = null;
    const getRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`,
      { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } }
    );
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    }

    // Коммитим JSON
    const encoded = Buffer.from(content, 'utf-8').toString('base64');
    const body = {
      message: `✦ Обновление данных [${new Date().toLocaleString('ru')}]`,
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

function parseCookies(str) {
  return Object.fromEntries(
    str.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );
}
