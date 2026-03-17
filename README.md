# Charlist-AldrinVeil
Charlist for Veil of Darkness

## Настройка прав на редактирование

По умолчанию сохранять данные может только владелец репозитория (`GITHUB_REPO_OWNER`, по умолчанию `Akella497`).
Чтобы разрешить сохранение другим редакторам, задайте переменную окружения:

- `ALLOWED_EDITORS=login1,login2,login3`

Логины в `ALLOWED_EDITORS` сравниваются без учёта регистра (например, `Editor` и `editor` одинаковы).

## Настройка репозитория хранения

По умолчанию данные сохраняются в:
- owner: `GITHUB_REPO_OWNER` или (на Vercel) `VERCEL_GIT_REPO_OWNER`
- repo: `GITHUB_REPO_NAME` или (на Vercel) `VERCEL_GIT_REPO_SLUG`
- file: `data.json`

Если эти переменные не заданы, используется fallback `Akella497/Charlist-AldrinVeil`.

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

Чтобы избежать ошибки `redirect_uri is not associated with this application`:

- В GitHub OAuth App должен быть корректно задан **Authorization callback URL**.
- В приложении можно (и рекомендуется) задать ту же ссылку в переменной:
  - `GITHUB_OAUTH_CALLBACK_URL=https://your-domain.example/api/auth/callback`

Поведение:
- Если `GITHUB_OAUTH_CALLBACK_URL` задан — он передаётся как `redirect_uri` в authorize/token exchange.
- Если не задан — `redirect_uri` не передаётся вообще, и GitHub использует callback URL из настроек OAuth App.

`SITE_URL` больше не участвует в формировании OAuth `redirect_uri`.
