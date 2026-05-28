const tg = window.Telegram?.WebApp;
try {
  tg?.ready();
  tg?.expand();
  tg?.setHeaderColor?.('#ffffff');
  tg?.setBackgroundColor?.('#fbfbfc');
} catch {}

const icons = {
  bolt: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M13.1 2.6 4.4 13.2c-.4.5-.05 1.3.6 1.3h5.1l-1.2 6.4c-.14.75.8 1.19 1.3.6l8.8-10.7c.4-.5.05-1.3-.6-1.3h-5.1l1.1-6.4c.14-.76-.82-1.18-1.3-.5Z"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m3.5 10.7 8.5-7 8.5 7"/><path d="M5.6 9.7v10.2h12.8V9.7"/><path d="M10 20v-5.8h4V20"/></svg>',
  diamond: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.1" stroke-linejoin="round"><path d="M4 8.2 7.3 4h9.4L20 8.2 12 20 4 8.2Z"/><path d="M4 8.2h16M8 4l4 16 4-16"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.15" stroke-linecap="round"><circle cx="12" cy="7.6" r="3.8"/><path d="M4.8 20.2c1.3-4.05 4-6 7.2-6s5.9 1.95 7.2 6"/></svg>',
  help: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.6 9.2a2.7 2.7 0 0 1 2.7-2.3c1.7 0 3 1.1 3 2.7 0 1.9-1.8 2.4-2.6 3.5-.35.48-.45.95-.45 1.65"/><path d="M12 18h.01"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.05" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5.5" width="16" height="14.5" rx="3"/><path d="M8 3.5v4M16 3.5v4M4 10h16"/></svg>',
  infinity: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7.4 15.2c-2 0-3.4-1.4-3.4-3.2s1.4-3.2 3.4-3.2c3.9 0 5.3 6.4 9.2 6.4 2 0 3.4-1.4 3.4-3.2s-1.4-3.2-3.4-3.2c-3.9 0-5.3 6.4-9.2 6.4Z"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.05" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 2.7 5.65 6.2.82-4.55 4.28 1.15 6.15L12 16.92 6.5 19.9l1.15-6.15L3.1 9.47l6.2-.82L12 3Z"/></svg>',
  badge: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M10.1 2.8a3 3 0 0 1 3.8 0l1 .82c.38.31.85.5 1.34.55l1.29.13a3 3 0 0 1 2.69 2.69l.13 1.29c.05.49.24.96.55 1.34l.82 1a3 3 0 0 1 0 3.8l-.82 1a3 3 0 0 0-.55 1.34l-.13 1.29a3 3 0 0 1-2.69 2.69l-1.29.13a3 3 0 0 0-1.34.55l-1 .82a3 3 0 0 1-3.8 0l-1-.82a3 3 0 0 0-1.34-.55l-1.29-.13a3 3 0 0 1-2.69-2.69l-.13-1.29a3 3 0 0 0-.55-1.34l-.82-1a3 3 0 0 1 0-3.8l.82-1c.31-.38.5-.85.55-1.34l.13-1.29a3 3 0 0 1 2.69-2.69l1.29-.13a3 3 0 0 0 1.34-.55l1-.82Zm5 7.38a1 1 0 0 0-1.42-1.42l-2.7 2.7-.66-.66a1 1 0 1 0-1.42 1.42l1.37 1.36a1 1 0 0 0 1.41 0l3.41-3.4Z"/></svg>',
  plane: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M21 4 3.8 11.2c-.85.36-.8 1.58.08 1.86l6.28 2.02 2.03 6.28c.28.88 1.5.93 1.86.08L21 4Z"/><path d="m10.2 15.1 4.9-4.9"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.2C4 7.8 7.55 5 12 5s8 2.8 8 7.2-3.55 7.2-8 7.2c-.9 0-1.75-.12-2.54-.36L5 20l1.14-3.45A6.95 6.95 0 0 1 4 12.2Z"/><path d="M8.8 12h.01M12 12h.01M15.2 12h.01"/></svg>'
};

document.querySelectorAll('[data-icon]').forEach(el => {
  const name = el.dataset.icon;
  if (icons[name]) el.innerHTML = icons[name];
});

const API_URL = window.GOOFISH_API_URL || localStorage.getItem('GOOFISH_API_URL') || '';
const BOT_USERNAME = window.GOOFISH_BOT_USERNAME || localStorage.getItem('GOOFISH_BOT_USERNAME') || '';
const ADMIN_USERNAME = window.GOOFISH_ADMIN_USERNAME || 'taypoov';
const initData = tg?.initData || '';

const pages = [...document.querySelectorAll('.page')];
const tabs = [...document.querySelectorAll('.nav-item')];
const toast = document.querySelector('#toast');
const activeSearches = document.querySelector('#activeSearches');
let selectedPlan = 'week';
let searches = JSON.parse(localStorage.getItem('gofish_searches') || '[]');

function showToast(text) {
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
}

function switchPage(name) {
  pages.forEach(p => p.classList.toggle('active', p.dataset.page === name));
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  try { tg?.HapticFeedback?.selectionChanged(); } catch {}
}

tabs.forEach(tab => tab.addEventListener('click', () => switchPage(tab.dataset.tab)));
document.querySelectorAll('[data-tab-jump]').forEach(btn => btn.addEventListener('click', () => switchPage(btn.dataset.tabJump)));

function markSelectValue(select) {
  select.classList.toggle('has-value', Boolean(select.value));
}
document.querySelectorAll('select').forEach(select => {
  markSelectValue(select);
  select.addEventListener('change', () => markSelectValue(select));
});

document.querySelectorAll('.plan').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedPlan = btn.dataset.plan;
    document.querySelectorAll('.plan').forEach(p => p.classList.toggle('selected', p === btn));
    try { tg?.HapticFeedback?.selectionChanged(); } catch {}
  });
});

function renderSearches() {
  if (!searches.length) {
    activeSearches.innerHTML = '<p class="empty">Активных поисков пока нет</p>';
    return;
  }
  activeSearches.innerHTML = searches.slice(0, 5).map(item => `
    <div class="search-row">
      <span class="search-dot"></span>
      <span><b>${escapeHtml(item.query || 'Поиск')}</b><small>${escapeHtml(item.category || 'Без категории')}</small></span>
      <span class="search-status">Активен</span>
      <span class="chev"></span>
    </div>
  `).join('');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[ch]));
}

renderSearches();

document.querySelector('#searchForm')?.addEventListener('submit', async event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const payload = Object.fromEntries(form.entries());
  const item = {
    id: Date.now(),
    query: payload.query || 'Новый поиск',
    category: payload.category || 'Без категории',
    size: payload.size || '',
    minPrice: payload.minPrice || '',
    maxPrice: payload.maxPrice || '',
    keywords: payload.keywords || ''
  };

  searches.unshift(item);
  searches = searches.slice(0, 8);
  localStorage.setItem('gofish_searches', JSON.stringify(searches));
  renderSearches();
  showToast('Поиск сохранен');

  if (API_URL) {
    try {
      await fetch(`${API_URL.replace(/\/$/, '')}/api/searches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Telegram-Init-Data': initData
        },
        body: JSON.stringify(item)
      });
    } catch (error) {
      console.warn('API save failed:', error);
    }
  }

  try { tg?.HapticFeedback?.notificationOccurred('success'); } catch {}
  setTimeout(() => switchPage('profile'), 650);
});

function openTelegramUser(username) {
  const clean = String(username || '').replace('@', '');
  if (!clean) return;
  const url = `https://t.me/${clean}`;
  if (tg?.openTelegramLink) tg.openTelegramLink(url);
  else window.open(url, '_blank');
}

function openBot() {
  if (BOT_USERNAME) openTelegramUser(BOT_USERNAME);
  else showToast('Укажи username бота');
}

document.querySelector('#buyInBot')?.addEventListener('click', openBot);
document.querySelector('#checkStatus')?.addEventListener('click', openBot);
document.querySelector('#openBotFromProfile')?.addEventListener('click', openBot);
document.querySelector('#contactAdmin')?.addEventListener('click', () => openTelegramUser(ADMIN_USERNAME));

async function loadMe() {
  if (!API_URL || !initData) return;
  try {
    const res = await fetch(`${API_URL.replace(/\/$/, '')}/api/me`, { headers: { 'X-Telegram-Init-Data': initData } });
    if (!res.ok) return;
    const data = await res.json();
    const user = data.user || data;
    if (user.username) document.querySelector('#profileName').textContent = '@' + user.username.replace('@', '');
    if (user.telegramId) document.querySelector('#profileId').textContent = 'Telegram ID: ' + user.telegramId;
    if (user.subscriptionUntil) {
      const d = new Date(user.subscriptionUntil);
      document.querySelector('#profileStatus').textContent = 'Подписка активна до ' + d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  } catch (e) { console.warn('me failed', e); }
}
loadMe();
