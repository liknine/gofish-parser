const screens = document.querySelectorAll('.screen');
const tabs = document.querySelectorAll('.tab');
const toast = document.getElementById('toast');

function showScreen(name) {
  screens.forEach(s => s.classList.toggle('active', s.dataset.screen === name));
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
}

tabs.forEach(tab => tab.addEventListener('click', () => showScreen(tab.dataset.tab)));
document.querySelectorAll('[data-go]').forEach(btn => btn.addEventListener('click', () => showScreen(btn.dataset.go)));

document.querySelectorAll('select').forEach(select => {
  const update = () => select.classList.toggle('has-value', Boolean(select.value));
  select.addEventListener('change', update);
  update();
});

document.querySelectorAll('.plan').forEach(plan => {
  plan.addEventListener('click', () => {
    document.querySelectorAll('.plan').forEach(p => p.classList.remove('selected'));
    plan.classList.add('selected');
  });
});

document.getElementById('searchForm').addEventListener('submit', (e) => {
  e.preventDefault();
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2300);
});
