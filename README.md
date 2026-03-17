# Charlist-AldrinVeil
Charlist for Veil of Darkness

## Настройка прав на редактирование

По умолчанию сохранять данные может только владелец репозитория (`GITHUB_REPO_OWNER`, по умолчанию `Akella497`).
Чтобы разрешить сохранение другим редакторам, задайте переменную окружения:

- `ALLOWED_EDITORS=login1,login2,login3`

Логины в `ALLOWED_EDITORS` сравниваются без учёта регистра (например, `Editor` и `editor` одинаковы).

## Настройка репозитория хранения

По умолчанию данные сохраняются в:
- owner: `Akella497`
- repo: `character-sheet`
- file: `data.json`

Можно переопределить:
- `GITHUB_REPO_OWNER`
- `GITHUB_REPO_NAME`
- `GITHUB_DATA_FILE`

## Надёжное сохранение от лица редакторов

Рекомендуется задать сервисный токен с доступом к целевому репозиторию:

- `GITHUB_REPO_TOKEN=<github_token_with_contents_write>`

Тогда сохранение в GitHub выполняется этим токеном, а OAuth пользователя используется только для авторизации в приложении (кто может редактировать).
Это устраняет ситуацию, когда редактор авторизован, но его личный GitHub-аккаунт не имеет write-доступа к репозиторию хранения.

Если `GITHUB_REPO_TOKEN` не задан, используется пользовательский OAuth токен (старое поведение).

## OAuth настройка

`SITE_URL` должен быть каноническим URL сайта (например `https://charlist-aldrin-veil.vercel.app`) и совпадать с callback URL в GitHub OAuth App: `SITE_URL/api/auth/callback`.
