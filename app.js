// For GitHub Pages: set this to your deployed backend URL later.
const API_URL = localStorage.getItem('API_URL') || 'http://localhost:3000';
const DEV_TELEGRAM_ID = localStorage.getItem('DEV_TELEGRAM_ID') || '123456789';
const ADMIN_USERNAME = localStorage.getItem('ADMIN_USERNAME') || 'taypoov';

const icons = {
  bolt: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13.3 2 4 13h6.6L9.7 22 20 9.8h-6.8L13.3 2Z"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M7 3v4M17 3v4M4.5 9h15M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/></svg>',
  infinity: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.4"><path d="M8.5 9.5c2.5 0 4.5 5 7 5a3 3 0 1 0 0-6c-2.5 0-4.5 5-7 5a3 3 0 1 1 0-6Z"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.2"><path d="M3.5 10.8 12 4l8.5 6.8V20a1 1 0 0 1-1 1H15v-6H9v6H4.5a1 1 0 0 1-1-1v-9.2Z"/></svg>',
  diamond: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.1"><path d="M6.5 4h11L22 9l-10 11L2 9l4.5-5Z"/><path d="M2 9h20M8 4l4 16 4-16"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.2"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  help: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.2"><circle cx="12" cy="12" r="9"/><path d="M9.7 9a2.5 2.5 0 0 1 4.7 1.2c0 2.2-2.4 2.2-2.4 4"/><path d="M12 18h.01"/></svg>',
  plane: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.1"><path d="M21 3 10.5 13.5M21 3l-6.5 18-4-7.5L3 9.5 21 3Z"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.1"><path d="M4 12a8 8 0 1 1 4 6.9L4 20l1.1-3.8A8 8 0 0 1 4 12Z"/><path d="M8 12h.01M12 12h.01M16 12h.01"/></svg>',
  badge: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M10.9 2.7a2 2 0 0 1 2.2 0l1.4.9 1.7.2a2 2 0 0 1 1.7 1.5l.4 1.7 1.1 1.3a2 2 0 0 1 .2 2.2l-.8 1.5.1 1.7a2 2 0 0 1-1.1 1.9l-1.6.7-1 1.4a2 2 0 0 1-2.1.8l-1.6-.4-1.6.4a2 2 0 0 1-2.1-.8l-1-1.4-1.6-.7a2 2 0 0 1-1.1-1.9l.1-1.7-.8-1.5a2 2 0 0 1 .2-2.2l1.1-1.3.4-1.7a2 2 0 0 1 1.7-1.5l1.7-.2 1.4-.9Zm4.5 7.3-4.1 4.1-1.8-1.8-1.2 1.2 3 3 5.3-5.3-1.2-1.2Z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><rect x="8" y="2.8" width="8" height="18.4" rx="2"/><path d="M11 18h2"/></svg>',
  shoe: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M4 14.5c3.8-.5 5.7-2.7 6.6-6.5l4.7 5.3 3.5.8c1.5.3 2.6 1.6 2.7 3.1H5.8A2.3 2.3 0 0 1 4 14.5Z"/><path d="M9 13.5h11"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M5 7h3l1.4-2h5.2L16 7h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"/><circle cx="12" cy="13" r="3.2"/></svg>'
};

document.querySelectorAll('[data-icon]').forEach((el) => { el.innerHTML = icons[el.dataset.icon] || ''; });

const tg = window.Telegram?.WebApp;
try {
  tg?.ready();
  tg?.expand();
  tg?.setHeaderColor?.('#ffffff');
  tg?.setBackgroundColor?.('#fbfbfc');
} catch {}

let currentPlan = 'week';
let me = null;

function headers() {
  const h = { 'Content-Type': 'application/json' };
  if (tg?.initData) h['x-telegram-init-data'] = tg.initData;
  else h['x-dev-telegram-id'] = DEV_TELEGRAM_ID;
  return h;
}

async function api(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, { ...options, headers: { ...headers(), ...(options.headers || {}) } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) throw new Error(data.error || 'API_ERROR');
  return data;
}

function showToast(text) {
  const toast = document.getElementById('toast');
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}

function switchTab(name) {
  document.querySelectorAll('.tab').forEach((t) => t.classList.toggle('is-active', t.dataset.tab === name));
  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('is-active', s.dataset.screen === name));
}

document.querySelectorAll('[data-tab]').forEach((btn) => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
document.querySelectorAll('[data-tab-target]').forEach((btn) => btn.addEventListener('click', () => switchTab(btn.dataset.tabTarget)));

document.querySelectorAll('select').forEach((select) => {
  const sync = () => select.classList.toggle('has-value', Boolean(select.value));
  select.addEventListener('change', sync);
  sync();
});

document.querySelectorAll('.plan-card').forEach((card) => {
  card.addEventListener('click', () => {
    currentPlan = card.dataset.plan;
    document.querySelectorAll('.plan-card').forEach((c) => c.classList.toggle('is-selected', c === card));
  });
});

function openBot() {
  if (tg?.openTelegramLink) {
    const botUsername = localStorage.getItem('BOT_USERNAME');
    if (botUsername) return tg.openTelegramLink(`https://t.me/${botUsername.replace('@', '')}`);
  }
  showToast('Откройте бота в Telegram');
}

document.getElementById('buyInBot').addEventListener('click', openBot);
document.getElementById('openBotFromProfile').addEventListener('click', openBot);
document.getElementById('contactAdmin').addEventListener('click', () => {
  if (ADMIN_USERNAME && tg?.openTelegramLink) tg.openTelegramLink(`https://t.me/${ADMIN_USERNAME.replace('@', '')}`);
  else showToast('Напишите админу в боте');
});
document.getElementById('checkStatus').addEventListener('click', async () => {
  await loadMe();
  showToast(me?.subscription?.text || 'Статус обновлен');
});

document.getElementById('searchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData(e.currentTarget);
  const payload = Object.fromEntries(form.entries());
  try {
    await api('/api/searches', { method: 'POST', body: JSON.stringify(payload) });
    showToast('Поиск сохранен и запущен');
    await loadMe();
    switchTab('profile');
  } catch (err) {
    if (String(err.message).includes('NO_ACTIVE_SUBSCRIPTION')) {
      showToast('Нужна активная подписка');
      switchTab('plans');
    } else {
      showToast('Не удалось сохранить поиск');
    }
  }
});

function renderSearches(searches = []) {
  const box = document.getElementById('activeSearches');
  if (!searches.length) {
    box.innerHTML = '<div class="empty-state">Активных поисков пока нет</div>';
    return;
  }
  const iconFor = (category) => category === 'Обувь' ? 'shoe' : category === 'Фото' ? 'camera' : 'phone';
  box.innerHTML = searches.slice(0, 6).map((s) => `
    <button class="search-row" data-search-id="${s.id}">
      <span class="search-dot"></span>
      <span><b>${escapeHtml(s.query)}</b><small>${escapeHtml(s.category || 'Без категории')}</small></span>
      <span class="search-status">${s.active ? 'Активен' : 'Пауза'}</span>
      <i></i>
    </button>
  `).join('');
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
}

async function loadMe() {
  try {
    me = await api('/api/me');
    const user = me.user || {};
    document.getElementById('profileName').textContent = user.username ? `@${user.username}` : (user.firstName || '@username');
    document.getElementById('profileId').textContent = `Telegram ID: ${user.telegramId || DEV_TELEGRAM_ID}`;
    document.getElementById('profileStatus').textContent = me.subscription?.text ? `Подписка ${me.subscription.text}` : 'Подписка не активна';
    renderSearches(me.searches || []);
  } catch {
    renderSearches([]);
  }
}

loadMe();
