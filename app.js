const tg = window.Telegram?.WebApp || null;
const urlParams = new URLSearchParams(location.search);
const config = {
  API_URL: urlParams.get('api') || window.GOFISH_CONFIG?.API_URL || localStorage.getItem('GOFISH_API_URL') || '',
  BOT_USERNAME: urlParams.get('bot') || window.GOFISH_CONFIG?.BOT_USERNAME || localStorage.getItem('GOFISH_BOT_USERNAME') || '',
  ADMIN_USERNAME: window.GOFISH_CONFIG?.ADMIN_USERNAME || 'taypoov',
  ADMIN_TEXT: window.GOFISH_CONFIG?.ADMIN_TEXT || 'Есть вопрос по боту. Хочу оплатить подписку на карту.',
};

const plans = [
  { key: 'week', title: 'Неделя', duration: '7 дней', usd: 2, stars: 100, icon: 'calendar' },
  { key: 'month', title: 'Месяц', duration: '30 дней', usd: 8, stars: 400, icon: 'calendar' },
  { key: 'three_months', title: '3 месяца', duration: '90 дней', usd: 20, stars: 1000, icon: 'spark' },
  { key: 'year', title: 'Год', duration: '365 дней', usd: 100, stars: 5000, icon: 'star' },
  { key: 'lifetime', title: 'Навсегда', duration: 'пожизненный доступ', usd: 140, stars: 7000, icon: 'infinity' },
];

const faq = [
  ['Куда приходят объявления?', 'Все новые объявления приходят прямо в чат Telegram-бота. Mini App нужен только для настройки поиска и управления подпиской.'],
  ['Как купить подписку?', 'Во вкладке «Тарифы» выберите период и оплатите Telegram Stars. Для оплаты картой нажмите «Оплатить на карту» — откроется личка админа.'],
  ['Как остановить поиск?', 'В профиле откройте активный поиск и отключите его. На MVP-этапе можно также написать админу, если нужно удалить поиск вручную.'],
  ['Что делать, если бот молчит?', 'Проверьте активна ли подписка и корректно ли настроен поиск. Если подписка активна, но объявлений нет, возможно, по фильтрам пока нет новых товаров.'],
  ['Как связаться с админом?', 'Нажмите «Написать админу». Мы откроем @taypoov и скопируем текст сообщения, чтобы его можно было быстро отправить.'],
];

let selectedPlan = 'lifetime';
let me = null;
let searches = [];

const screens = document.querySelectorAll('.screen');
const tabs = document.querySelectorAll('.tab');
const toast = document.getElementById('toast');
const plansRoot = document.getElementById('plans');
const faqRoot = document.getElementById('faqList');
const searchesList = document.getElementById('searchesList');

function showToast(text) {
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function haptic(type = 'light') {
  try { tg?.HapticFeedback?.impactOccurred(type); } catch {}
}

function showScreen(name) {
  screens.forEach((screen) => screen.classList.toggle('active', screen.dataset.screen === name));
  tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === name));
  haptic('soft');
}

tabs.forEach((tab) => tab.addEventListener('click', () => showScreen(tab.dataset.tab)));
document.querySelectorAll('[data-go]').forEach((btn) => btn.addEventListener('click', () => showScreen(btn.dataset.go)));

function iconMarkup(name) {
  const icons = {
    calendar: '<svg viewBox="0 0 24 24"><path d="M7 3v3M17 3v3M4.5 9.5h15M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/></svg>',
    spark: '<svg viewBox="0 0 24 24"><path d="M12 3v18M3 12h18M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="M12 3 14.8 8.7 21 9.6l-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2 7.5 14 3 9.6l6.2-.9L12 3Z"/></svg>',
    infinity: '<svg viewBox="0 0 24 24"><path d="M7.5 14.5c-2.2 0-4-1.6-4-3.5s1.8-3.5 4-3.5c3.7 0 5.3 7 9 7 2.2 0 4-1.6 4-3.5s-1.8-3.5-4-3.5c-3.7 0-5.3 7-9 7Z"/></svg>',
  };
  return icons[name] || icons.calendar;
}

function renderPlans() {
  plansRoot.innerHTML = plans.map((plan) => `
    <button class="plan ${plan.key === selectedPlan ? 'selected' : ''}" data-plan="${plan.key}">
      <span class="plan-icon">${iconMarkup(plan.icon)}</span>
      <span class="plan-copy"><strong>${plan.title}</strong><small>${plan.duration}</small></span>
      <span class="plan-price">$${plan.usd}<small>${plan.stars} ⭐</small></span>
      <span class="radio"></span>
    </button>
  `).join('');

  plansRoot.querySelectorAll('.plan').forEach((node) => {
    node.addEventListener('click', () => {
      selectedPlan = node.dataset.plan;
      renderPlans();
      haptic('light');
    });
  });
}

function renderFAQ() {
  faqRoot.innerHTML = faq.map(([q, a], index) => `
    <button class="faq-item" data-faq="${index}"><span>${q}</span><i></i></button>
    <div class="faq-answer">${a}</div>
  `).join('');

  faqRoot.querySelectorAll('.faq-item').forEach((button) => {
    button.addEventListener('click', () => {
      button.classList.toggle('open');
      haptic('light');
    });
  });
}

function setSelectState(select) {
  select.classList.toggle('placeholder', !select.value);
}

document.querySelectorAll('select').forEach((select) => {
  select.addEventListener('change', () => setSelectState(select));
  setSelectState(select);
});

function displayNameFromTelegram(user) {
  if (!user) return '@username';
  if (user.username) return `@${user.username}`;
  const name = [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
  return name || '@username';
}

function getTelegramUser() {
  return tg?.initDataUnsafe?.user || null;
}

function applyUser(user, subscriptionText = 'Подписка не активна') {
  const profileName = document.getElementById('profileName');
  const profileId = document.getElementById('profileId');
  const profileStatus = document.getElementById('profileStatus');
  const avatar = document.getElementById('tgAvatar');

  profileName.textContent = displayNameFromTelegram(user);
  profileId.textContent = `Telegram ID: ${user?.id || user?.telegramId || '—'}`;
  profileStatus.textContent = subscriptionText;

  if (user?.photo_url || user?.photoUrl) {
    const src = user.photo_url || user.photoUrl;
    avatar.innerHTML = `<img src="${src}" alt="avatar" referrerpolicy="no-referrer" />`;
  }
}

function renderSearches(list) {
  searches = Array.isArray(list) ? list : [];
  if (!searches.length) {
    searchesList.innerHTML = '<div class="empty-state">Активных поисков пока нет. Настройте первый поиск на главной.</div>';
    return;
  }

  const icon = '<svg viewBox="0 0 24 24"><path d="M9 2.8h6a2 2 0 0 1 2 2v14.4a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V4.8a2 2 0 0 1 2-2Z"/></svg>';
  searchesList.innerHTML = searches.map((search) => `
    <button class="search-row" data-search-id="${search.id}">
      <span class="round-icon">${icon}</span>
      <span><b>${escapeHtml(search.query || 'Без названия')}</b><small>${escapeHtml(search.category || search.size || 'Поиск')}</small></span>
      <em>${search.active === false ? 'Пауза' : 'Активен'}</em><i></i>
    </button>
  `).join('');
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
}

function apiUrl(path) {
  if (!config.API_URL) return '';
  return `${config.API_URL.replace(/\/$/, '')}${path}`;
}

async function apiFetch(path, options = {}) {
  const url = apiUrl(path);
  if (!url) throw new Error('API_URL_EMPTY');
  const initData = tg?.initData || '';
  const headers = {
    'Content-Type': 'application/json',
    ...(initData ? { 'x-telegram-init-data': initData } : { 'x-dev-telegram-id': '123456789' }),
    ...(options.headers || {}),
  };
  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) throw new Error(data.error || 'REQUEST_FAILED');
  return data;
}

async function loadMe() {
  const tgUser = getTelegramUser();
  applyUser(tgUser || { id: '—', username: 'username' }, tgUser ? 'Статус подписки загружается...' : 'Локальный предпросмотр');

  if (!config.API_URL) {
    const local = JSON.parse(localStorage.getItem('GOFISH_LOCAL_SEARCHES') || '[]');
    renderSearches(local);
    return;
  }

  try {
    const data = await apiFetch('/api/me');
    me = data.user;
    applyUser({ ...tgUser, ...data.user, id: data.user.telegramId, photo_url: tgUser?.photo_url || data.user.photoUrl }, `Подписка ${data.subscription?.text || 'не активна'}`);
    if (data.plans) mergePlanStars(data.plans);
    if (data.config?.botUsername && !config.BOT_USERNAME) config.BOT_USERNAME = data.config.botUsername;
    renderPlans();
    renderSearches(data.searches || []);
  } catch (err) {
    console.warn(err);
    showToast('Не удалось загрузить профиль. Проверьте API.');
  }
}

function mergePlanStars(serverPlans) {
  const map = { week: 'week', month: 'month', three_months: 'three_months', year: 'year', lifetime: 'lifetime' };
  plans.forEach((local) => {
    const server = serverPlans[map[local.key]];
    if (server) {
      local.stars = server.stars;
      local.usd = server.usd;
    }
  });
}

function openTelegram(url) {
  if (tg?.openTelegramLink) tg.openTelegramLink(url);
  else window.open(url, '_blank', 'noopener,noreferrer');
}

function botLink(start = '') {
  if (!config.BOT_USERNAME) return '';
  const suffix = start ? `?start=${encodeURIComponent(start)}` : '';
  return `https://t.me/${config.BOT_USERNAME}${suffix}`;
}

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}

async function contactAdmin() {
  await copyText(config.ADMIN_TEXT);
  showToast('Текст скопирован. Открываю админа.');
  setTimeout(() => openTelegram(`https://t.me/${config.ADMIN_USERNAME}`), 420);
}

async function payByStars() {
  haptic('medium');
  const plan = plans.find((item) => item.key === selectedPlan);
  if (!plan) return showToast('Выберите тариф.');

  // ВАЖНО: Mini App не создает invoice сам.
  // Кнопка всегда перекидывает в бота с выбранным тарифом,
  // а уже бот показывает меню оплаты и отправляет Stars invoice.
  const link = botLink(`buy_${selectedPlan}`);
  if (link) return openTelegram(link);

  await copyText(`/start buy_${selectedPlan}`);
  showToast('Команда покупки скопирована. Откройте бота.');
}

async function payByCard() {
  await contactAdmin();
}

async function saveSearch(payload) {
  if (config.API_URL && tg?.initData) {
    const data = await apiFetch('/api/searches', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    renderSearches([data.search, ...searches.filter((x) => x.id !== data.search.id)]);
    return data.search;
  }

  const search = {
    id: `local_${Date.now()}`,
    ...payload,
    active: true,
    createdAt: new Date().toISOString(),
  };
  const local = [search, ...JSON.parse(localStorage.getItem('GOFISH_LOCAL_SEARCHES') || '[]')];
  localStorage.setItem('GOFISH_LOCAL_SEARCHES', JSON.stringify(local));
  renderSearches(local);
  return search;
}

document.getElementById('searchForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector('.primary-btn');
  const payload = {
    query: document.getElementById('queryInput').value.trim(),
    minPrice: document.getElementById('minPriceInput').value.trim(),
    maxPrice: document.getElementById('maxPriceInput').value.trim(),
    category: document.getElementById('categorySelect').value,
    size: document.getElementById('sizeSelect').value,
    keywords: document.getElementById('keywordsInput').value.trim(),
  };

  if (!payload.query) return showToast('Введите, что ищем.');
  button.classList.add('loading');
  button.querySelector('span').textContent = 'Сохраняю...';
  try {
    await saveSearch(payload);
    showToast('Поиск запущен. Объявления придут в бот.');
    haptic('medium');
  } catch (err) {
    console.warn(err);
    if (err.message === 'NO_ACTIVE_SUBSCRIPTION') {
      showScreen('plans');
      showToast('Нужна активная подписка.');
    } else {
      showToast('Не удалось сохранить поиск. Проверьте API.');
    }
  } finally {
    button.classList.remove('loading');
    button.querySelector('span').textContent = 'Сохранить и запустить';
  }
});

document.getElementById('payStarsBtn').addEventListener('click', payByStars);
document.getElementById('payCardBtn').addEventListener('click', payByCard);
document.getElementById('contactAdminBtn').addEventListener('click', contactAdmin);
document.getElementById('checkStatusBtn').addEventListener('click', loadMe);
document.getElementById('openBotRow').addEventListener('click', () => {
  const link = botLink();
  if (link) openTelegram(link);
  else showToast('Укажите BOT_USERNAME в config.');
});

renderPlans();
renderFAQ();

try {
  tg?.ready();
  tg?.expand();
  tg?.setHeaderColor?.('#ffffff');
  tg?.setBackgroundColor?.('#ffffff');
} catch {}

loadMe();
