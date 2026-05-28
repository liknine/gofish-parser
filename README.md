# Goofish Sniper working v5

Внутри две части:

- `web/` — статичный Telegram Mini App для GitHub Pages.
- `bot-api/` — Telegram bot + API для подписок, Stars, сохранения поисков.

## Быстрый запуск бота локально

```bash
cd bot-api
cp .env.example .env
npm install
npm run dev
```

В `.env` нужно заполнить:

```env
BOT_TOKEN=токен_бота
WEBAPP_URL=https://your-username.github.io/your-repo/
ADMIN_IDS=ваш_telegram_id
ADMIN_USERNAME=taypoov
PORT=3000
```

Для полноценной связи Mini App с API после деплоя backend добавьте:

```env
API_PUBLIC_URL=https://your-backend-domain.com
BOT_USERNAME=username_вашего_бота_без_@
```

Бот сам добавит `?bot=...&api=...` к кнопке Mini App.

## Web app на GitHub Pages

Залейте содержимое папки `web/` в GitHub Pages:

```text
index.html
styles.css
app.js
```

Если API уже задеплоен, можно вручную указать его в `index.html`:

```js
window.GOFISH_CONFIG = {
  API_URL: 'https://your-backend-domain.com',
  BOT_USERNAME: 'username_бота',
  ADMIN_USERNAME: 'taypoov',
  ADMIN_TEXT: 'Есть вопрос по боту. Хочу оплатить подписку на карту.'
};
```

Если Mini App открывается из кнопки бота, бот может передать эти параметры сам через URL.

## Что работает

- Команды бота: `/start`, `/premium`, `/status`, `/my_id`, `/give`, `/revoke`, `/users`, `/webapp`.
- Оплата Telegram Stars через invoice и invoice link для Mini App.
- Оплата картой ведет к `@taypoov`.
- Mini App подтягивает username, Telegram ID и `photo_url` из Telegram WebApp data, если Telegram его передает.
- FAQ заполнен текстами.
- Тестовые поиски убраны.
- Сохранение поиска идет в API, если Mini App открыт из Telegram и API_URL задан.

## Важно

Локальный `http://localhost:3000` не будет доступен пользователям из Telegram WebView. Для полной работы Mini App + API backend нужно задеплоить на публичный HTTPS-домен.


## Оплата Stars

Кнопка `Оплатить Stars` открывает бота с параметром выбранного тарифа. Invoice создается в боте, а не внутри GitHub Pages. Это специально сделано проще и стабильнее для MVP.

Если открываешь Mini App напрямую по ссылке GitHub Pages, впиши username бота в `index.html`:

```js
BOT_USERNAME: 'your_bot_username'
```

Если Mini App открывается из кнопки `/start` в боте, параметр `bot` будет подставлен автоматически.
