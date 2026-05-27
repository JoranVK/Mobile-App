const STORAGE_KEY = 'takenlijst-items-v1';
const LANGUAGE_KEY = 'takenlijst-language-v1';

const translations = {
  nl: {
    appTitle: 'Takenlijst',
    languageLabel: 'Taal',
    navHome: 'Home',
    navAdd: 'Toevoegen',
    navOverview: 'Overzicht',
    navSettings: 'Info',
    homeTitle: 'Dashboard',
    homeIntro: 'Beheer je taken offline en filter op dag, week of maand.',
    totalItems: 'Totaal taken',
    totalValue: 'Totale waarde',
    addTitle: 'Item toevoegen',
    dateLabel: 'Datum',
    categoryLabel: 'Categorie',
    descriptionLabel: 'Omschrijving',
    valueLabel: 'Waarde',
    saveButton: 'Opslaan',
    overviewTitle: 'Overzicht',
    filterDay: 'Dag',
    filterWeek: 'Week',
    filterMonth: 'Maand',
    chartTitle: 'Categorieverdeling',
    settingsTitle: 'Instellingen & info',
    settingsIntro: 'De gegevens worden lokaal opgeslagen en blijven offline beschikbaar.',
    resetButton: 'Alles resetten',
    footerText: 'Takenlijst PWA · Werkt offline',
    savedFeedback: 'Item opgeslagen.',
    resetFeedback: 'Alle items zijn verwijderd.',
    emptyState: 'Geen items voor deze periode.',
    confirmReset: 'Weet je zeker dat je alle items wilt verwijderen?',
    dateText: 'Datum',
    categoryText: 'Categorie',
    valueText: 'Waarde',
    requiredField: 'Vul alle velden correct in.'
  },
  en: {
    appTitle: 'Task list',
    languageLabel: 'Language',
    navHome: 'Home',
    navAdd: 'Add',
    navOverview: 'Overview',
    navSettings: 'Info',
    homeTitle: 'Dashboard',
    homeIntro: 'Manage tasks offline and filter by day, week, or month.',
    totalItems: 'Total tasks',
    totalValue: 'Total value',
    addTitle: 'Add item',
    dateLabel: 'Date',
    categoryLabel: 'Category',
    descriptionLabel: 'Description',
    valueLabel: 'Value',
    saveButton: 'Save',
    overviewTitle: 'Overview',
    filterDay: 'Day',
    filterWeek: 'Week',
    filterMonth: 'Month',
    chartTitle: 'Category distribution',
    settingsTitle: 'Settings & info',
    settingsIntro: 'Data is stored locally and remains available offline.',
    resetButton: 'Reset all',
    footerText: 'Task list PWA · Works offline',
    savedFeedback: 'Item saved.',
    resetFeedback: 'All items were removed.',
    emptyState: 'No items for this period.',
    confirmReset: 'Are you sure you want to remove all items?',
    dateText: 'Date',
    categoryText: 'Category',
    valueText: 'Value',
    requiredField: 'Please fill in all fields correctly.'
  }
};

const state = {
  items: [],
  filter: 'day',
  language: 'nl'
};

const form = document.querySelector('#taskForm');
const dateInput = document.querySelector('#date');
const categoryInput = document.querySelector('#category');
const descriptionInput = document.querySelector('#description');
const valueInput = document.querySelector('#value');
const taskList = document.querySelector('#taskList');
const totalItems = document.querySelector('#totalItems');
const totalValue = document.querySelector('#totalValue');
const chart = document.querySelector('#chart');
const resetButton = document.querySelector('#resetButton');
const feedback = document.querySelector('#feedback');
const filterButtons = Array.from(document.querySelectorAll('.filter-button'));
const languageSwitch = document.querySelector('#languageSwitch');

init();

function init() {
  loadState();
  applyTranslations();
  bindEvents();
  render();
  registerServiceWorker();
}

function loadState() {
  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(items)) {
      state.items = items;
    }

    const language = localStorage.getItem(LANGUAGE_KEY);
    if (language === 'nl' || language === 'en') {
      state.language = language;
      languageSwitch.value = language;
      document.documentElement.lang = language;
    }
  } catch {
    state.items = [];
  }
}

function bindEvents() {
  form.addEventListener('submit', handleSubmit);
  resetButton.addEventListener('click', handleReset);
  languageSwitch.addEventListener('change', handleLanguageChange);

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      state.filter = button.dataset.filter;
      updateFilterButtons();
      render();
    });
  });
}

function handleSubmit(event) {
  event.preventDefault();

  const newItem = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    date: dateInput.value,
    category: categoryInput.value.trim(),
    description: descriptionInput.value.trim(),
    value: Number(valueInput.value)
  };

  if (!isValid(newItem)) {
    setFeedback(t('requiredField'));
    return;
  }

  state.items.push(newItem);
  persistItems();
  form.reset();
  setFeedback(t('savedFeedback'));
  render();
}

function isValid(item) {
  return Boolean(item.date && item.category && item.description && Number.isFinite(item.value) && item.value >= 0);
}

function handleReset() {
  if (!window.confirm(t('confirmReset'))) {
    return;
  }

  state.items = [];
  persistItems();
  setFeedback(t('resetFeedback'));
  render();
}

function handleLanguageChange(event) {
  state.language = event.target.value;
  localStorage.setItem(LANGUAGE_KEY, state.language);
  document.documentElement.lang = state.language;
  applyTranslations();
  render();
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    const translation = t(key);
    if (translation) {
      element.textContent = translation;
    }
  });
}

function t(key) {
  return translations[state.language][key] || key;
}

function persistItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
}

function render() {
  const filtered = getFilteredItems();
  renderList(filtered);
  renderTotals(filtered);
  renderChart(filtered);
}

function getFilteredItems() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  return state.items.filter((item) => {
    const itemDate = new Date(item.date);
    if (Number.isNaN(itemDate.getTime())) {
      return false;
    }

    if (state.filter === 'day') {
      return itemDate.toDateString() === now.toDateString();
    }

    if (state.filter === 'month') {
      return itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
    }

    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    const day = startOfWeek.getDay();
    const offsetToMonday = day === 0 ? 6 : day - 1;
    startOfWeek.setDate(startOfWeek.getDate() - offsetToMonday);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return itemDate >= startOfWeek && itemDate <= endOfWeek;
  });
}

function renderList(items) {
  if (items.length === 0) {
    taskList.innerHTML = `<li>${t('emptyState')}</li>`;
    return;
  }

  taskList.innerHTML = items
    .map(
      (item) => `
      <li>
        <p><strong>${escapeHtml(item.description)}</strong></p>
        <p>${t('dateText')}: ${escapeHtml(item.date)}</p>
        <p>${t('categoryText')}: ${escapeHtml(item.category)}</p>
        <p>${t('valueText')}: ${formatCurrency(item.value)}</p>
      </li>
    `
    )
    .join('');
}

function renderTotals(items) {
  totalItems.textContent = String(items.length);
  const total = items.reduce((sum, item) => sum + item.value, 0);
  totalValue.textContent = formatCurrency(total);
}

function renderChart(items) {
  if (items.length === 0) {
    chart.innerHTML = '';
    return;
  }

  const totalsByCategory = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.value;
    return acc;
  }, {});

  const maxValue = Math.max(...Object.values(totalsByCategory));

  chart.innerHTML = Object.entries(totalsByCategory)
    .map(([category, value]) => {
      const width = maxValue === 0 ? 0 : Math.round((value / maxValue) * 100);
      return `
      <li>
        <span>${escapeHtml(category)} (${formatCurrency(value)})</span>
        <div class="chart-bar" style="width:${width}%"></div>
      </li>
    `;
    })
    .join('');
}

function updateFilterButtons() {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === state.filter;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function setFeedback(message) {
  feedback.textContent = message;
}

function formatCurrency(value) {
  const locale = state.language === 'nl' ? 'nl-NL' : 'en-US';
  const currency = state.language === 'nl' ? 'EUR' : 'USD';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {
      setFeedback('Service worker registratie mislukt.');
    });
  }
}
