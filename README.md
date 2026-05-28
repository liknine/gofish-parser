# Goofish Sniper Mini App frontend

Статичный frontend для GitHub Pages.

## Локальный запуск на Mac

```bash
python3 -m http.server 5173
```

Открыть:

```text
http://localhost:5173
```

## GitHub Pages

Залей `index.html`, `styles.css`, `app.js` в корень репозитория.

## Настройка API и бота

В `app.js` можно задать:

```js
const API_URL = '';
const BOT_USERNAME = '';
const ADMIN_USERNAME = 'taypoov';
```

Или через localStorage в консоли браузера:

```js
localStorage.setItem('GOOFISH_API_URL', 'https://your-api.com')
localStorage.setItem('GOOFISH_BOT_USERNAME', 'your_bot_username')
```
