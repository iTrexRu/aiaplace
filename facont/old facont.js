/* -----------------------------
   Глобальные настройки
------------------------------*/

const FACONT_API_URL = 'https://itrex-auto-prod.up.railway.app/webhook/d3499289-9710-47bc-bd72-8aa9ccbd1426';
// AUTH API URL - для методов регистрации/логина/сессии (отдельный вебхук или роут, если используется один)
// Предполагаем, что все идет через один URL, но различается cmd, либо используем разные URL.
// В инструкции предложено /webhook/api/..., но у нас пока один URL.
// Будем использовать тот же URL и параметр cmd для маршрутизации, если не указано иное.
// Но для Auth лучше отдельные ендпоинты или cmd.
// Пусть будет cmd: 'auth_login', 'auth_register' и т.д.
const FACONT_BASE_URL = (window.FACONT_BASE_URL || '').replace(/\/$/, '');

let CURRENT_USER = null;

/* -----------------------------
   Вспомогательные функции
------------------------------*/

// Вызов n8n backend
async function facontCallAPI(cmd, data = {}, options = {}) {
  const payload = { cmd, ...data };

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  // Plan B: Manual Token (LocalStorage)
  const sessionId = localStorage.getItem('facont_session');
  if (sessionId) {
    headers['X-Session-ID'] = sessionId;
  }

  const res = await fetch(FACONT_API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
    // credentials: 'include' // Removed to avoid CORS issues with cookies
  });

  if (res.status === 401) {
    // Не авторизован -> редирект на логин
    facontShowAuth('login');
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const txt = await res.text();
    throw new Error('HTTP ' + res.status + ': ' + txt);
  }

  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

// Загрузка partial-файла в #facont-main
async function facontLoadPartial(relativePath) {
  const main = document.getElementById('facont-main');
  if (!main) return null;

  main.innerHTML = 'Загрузка...';

  let url = relativePath.replace(/^\//, '');
  if (FACONT_BASE_URL) {
    url = FACONT_BASE_URL + '/' + url;
  }

  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) {
    main.innerHTML = '<div class="card">Ошибка загрузки: ' + res.status + '</div>';
    return null;
  }

  const html = await res.text();
  main.innerHTML = html;
  return main;
}

/* -----------------------------
   Auth & Navigation
------------------------------*/

async function facontInitAuth() {
  try {
    // Проверяем сессию
    const res = await facontCallAPI('auth_me');
    if (res && res.authenticated) {
      CURRENT_USER = res.user;
      facontRenderApp();
    } else {
      facontShowAuth('login');
    }
  } catch (e) {
    console.error('Auth check failed', e);
    facontShowAuth('login');
  }
}

async function facontShowAuth(type = 'login') {
  const main = document.getElementById('facont-root');
  if (!main) return;

  let file = 'login.html';
  if (type === 'register') file = 'register.html';
  if (type === 'forgot') file = 'forgot-password.html';

  main.innerHTML = 'Загрузка...';
  const html = await facontLoadPartialStr(file);
  main.innerHTML = html;

  if (type === 'login') facontInitLogin();
  if (type === 'register') facontInitRegister();
  if (type === 'forgot') facontInitForgot();
}

// Helper to load string only
async function facontLoadPartialStr(relativePath) {
  let url = relativePath.replace(/^\//, '');
  if (FACONT_BASE_URL) {
    url = FACONT_BASE_URL + '/' + url;
  }
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) return 'Error loading ' + relativePath;
  return await res.text();
}

function facontRenderApp() {
  const root = document.getElementById('facont-root');
  const template = document.getElementById('facont-app-template');
  if (!root || !template) return;

  root.innerHTML = '';
  root.appendChild(template.content.cloneNode(true));

  // Init Sidebar
  const sidebar = root.querySelector('.facont-sidebar');
  if (sidebar) {
    sidebar.addEventListener('click', (e) => {
      const item = e.target.closest('.facont-menu-item');
      if (!item) return;
      
      const action = item.dataset.action;
      if (action === 'logout') {
        facontLogout();
        return;
      }

      const view = item.dataset.view;
      if (view) facontShowView(view);
    });
  }

  // Load default view
  facontShowView('onboarding_overview');
}

async function facontLogout() {
  try {
    await facontCallAPI('auth_logout');
  } catch (e) {
    console.error(e);
  }
  localStorage.removeItem('facont_session'); // Clear token
  window.location.reload();
}

// --- Login Logic ---
function facontInitLogin() {
  const form = document.getElementById('facont-login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value;
    const errEl = document.getElementById('facont-login-error');
    const btn = form.querySelector('button');

    if (!email || !password) return;

    btn.disabled = true;
    if (errEl) errEl.textContent = '';

    try {
      const res = await facontCallAPI('auth_login', { email, password });
      if (res.ok) {
        if (res.sessionId) {
          localStorage.setItem('facont_session', res.sessionId); // Save token
        }
        window.location.reload();
      } else {
        throw new Error(res.message || 'Ошибка входа');
      }
    } catch (err) {
      if (errEl) errEl.textContent = err.message;
      btn.disabled = false;
    }
  });
}

// --- Register Logic ---
function facontInitRegister() {
  const form = document.getElementById('facont-register-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirm = form.confirm.value;
    const errEl = document.getElementById('facont-reg-error');
    const successEl = document.getElementById('facont-reg-success');
    const btn = form.querySelector('button');

    if (password !== confirm) {
      if (errEl) errEl.textContent = 'Пароли не совпадают';
      return;
    }

    btn.disabled = true;
    if (errEl) errEl.textContent = '';
    if (successEl) successEl.style.display = 'none';

    try {
      const res = await facontCallAPI('auth_register', { email, password });
      if (res.ok) {
        if (successEl) {
          successEl.textContent = 'Регистрация успешна! Проверьте почту для подтверждения.';
          successEl.style.display = 'block';
        }
        form.reset();
      } else {
        throw new Error(res.message || 'Ошибка регистрации');
      }
    } catch (err) {
      if (errEl) errEl.textContent = err.message;
    } finally {
      btn.disabled = false;
    }
  });
}

// --- Forgot Password Logic ---
function facontInitForgot() {
  const form = document.getElementById('facont-forgot-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const statusEl = document.getElementById('facont-forgot-status');
    const btn = form.querySelector('button');

    btn.disabled = true;
    if (statusEl) {
      statusEl.textContent = 'Отправка...'; 
      statusEl.style.display = 'block';
      statusEl.style.color = 'black';
    }

    try {
      await facontCallAPI('auth_forgot_password', { email });
      if (statusEl) {
        statusEl.textContent = 'Если такой email существует, мы отправили ссылку.';
        statusEl.style.color = 'green';
      }
    } catch (err) {
      if (statusEl) {
        statusEl.textContent = 'Ошибка: ' + err.message;
        statusEl.style.color = '#b91c1c';
      }
    } finally {
      btn.disabled = false;
    }
  });
}

// --- Verify Email Logic ---
function facontInitVerify() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const statusEl = document.getElementById('verify-status');
  const successEl = document.getElementById('verify-success');
  const errorEl = document.getElementById('verify-error');

  if (!token) {
    if (statusEl) statusEl.style.display = 'none';
    if (errorEl) {
      errorEl.textContent = 'Ошибка: Токен не найден.';
      errorEl.style.display = 'block';
    }
    return;
  }

  (async () => {
    try {
      const res = await facontCallAPI('auth_confirm_email', { token }, { skipAuth: true });
      if (statusEl) statusEl.style.display = 'none';
      if (res.ok) {
        if (successEl) successEl.style.display = 'block';
      } else {
        throw new Error(res.message || 'Неверный или истекший токен.');
      }
    } catch (e) {
      if (statusEl) statusEl.style.display = 'none';
      if (errorEl) {
        errorEl.textContent = 'Ошибка: ' + e.message;
        errorEl.style.display = 'block';
      }
    }
  })();
}

// --- Reset Password Logic ---
function facontInitResetPassword() {
  const form = document.getElementById('facont-reset-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    const password = document.getElementById('reset-password').value;
    const confirm = document.getElementById('reset-confirm').value;
    const errorEl = document.getElementById('reset-error');
    const successEl = document.getElementById('reset-success');
    const btn = form.querySelector('button');

    if (!token) {
      if (errorEl) errorEl.textContent = 'Ошибка: Токен не найден в ссылке.';
      return;
    }

    if (password !== confirm) {
      if (errorEl) errorEl.textContent = 'Пароли не совпадают.';
      return;
    }

    btn.disabled = true;
    if (errorEl) errorEl.textContent = '';
    if (successEl) successEl.style.display = 'none';

    try {
      const res = await facontCallAPI('auth_reset_password', { token, password }, { skipAuth: true });
      if (res.ok) {
        if (successEl) successEl.style.display = 'block';
        form.reset();
      } else {
        throw new Error(res.message || 'Ошибка сброса пароля.');
      }
    } catch (err) {
      if (errorEl) errorEl.textContent = err.message;
    } finally {
      btn.disabled = false;
    }
  });
}

/* -----------------------------
   Роутер по экранам
------------------------------*/

async function facontShowView(view) {
  const sidebar = document.querySelector('.facont-sidebar');
  if (sidebar) {
    sidebar.querySelectorAll('.facont-menu-item').forEach(item => {
      item.classList.toggle('active', item.dataset.view === view);
    });
  }

  if (view === 'onboarding_overview') {
    const main = await facontLoadPartial('onboarding-overview.html');
    if (main) facontInitOnboardingOverview();
  } else if (view === 'onboarding_identity') {
    const main = await facontLoadPartial('onboarding-identity.html');
    if (main) facontInitOnboardingIdentity();
  } else if (view === 'onboarding_product') {
    const main = await facontLoadPartial('onboarding-product.html');
    if (main) facontInitOnboardingProduct();
  } else if (view === 'onboarding_audience') {
    const main = await facontLoadPartial('onboarding-audience.html');
    if (main) facontInitOnboardingAudience();
  } else if (view === 'onboarding_style') {
    const main = await facontLoadPartial('onboarding-style.html');
    if (main) facontInitOnboardingStyle();
  } else if (view === 'settings') {
    const main = await facontLoadPartial('settings.html');
    if (main) facontInitSettings();
  } else if (view === 'profile') {
    const main = await facontLoadPartial('profile.html');
    if (main) facontInitProfile();
  } else if (view === 'voice_post') {
    await facontLoadPartial('voice-post.html');
  } else if (view === 'content_list') {
    const main = await facontLoadPartial('content-list.html');
    if (main) facontInitContentList();
  } else if (view === 'content_review') {
    const main = await facontLoadPartial('content-review.html');
  } else if (view === 'verify') {
    const main = await facontLoadPartial('verify.html');
    if (main) facontInitVerify();
  } else if (view === 'reset_password') {
    const main = await facontLoadPartial('reset-password.html');
    if (main) facontInitResetPassword();
  }
}

async function facontShowReview(contentId) {
  const main = await facontLoadPartial('content-review.html');
  if (main) facontInitContentReview(contentId);
}

/* -----------------------------
   Экран: Обзор онбординга
   (onboarding-overview.html)
------------------------------*/

async function facontInitOnboardingOverview() {
  const root = document.getElementById('facont-onb0');
  if (!root) return;

  const statusElems = {
    identity: root.querySelector('[data-status="identity"]'),
    product: root.querySelector('[data-status="product"]'),
    audience: root.querySelector('[data-status="audience"]'),
    style: root.querySelector('[data-status="style"]')
  };
  const completeCard = root.querySelector('#facont-onb-complete');

  function isDoneValue(value) {
    let status = null;
    if (value && typeof value === 'object') {
      status = value.status || null;
    } else {
      status = value;
    }
    return status === 'ok';
  }

  function setStatus(block, value) {
    const el = statusElems[block];
    if (!el) return;

    const done = isDoneValue(value);

    el.textContent = done ? 'Готово' : 'Не заполнен';
    el.classList.remove('done', 'todo');
    el.classList.add(done ? 'done' : 'todo');

    const card = root.querySelector('.facont-onb-block[data-block="' + block + '"]');
    if (!card) return;

    const btn = card.querySelector('[data-open-block]');
    if (!btn) return;

    btn.textContent = done ? 'Редактировать' : 'Заполнить';
  }

  let onboarding = {};

  try {
    const res = await facontCallAPI('get_settings', {});
    const user = res && res.user ? res.user : {};
    onboarding = user.onboarding || {};

    setStatus('identity', onboarding.identity || null);
    setStatus('product', onboarding.product || null);
    setStatus('audience', onboarding.audience || null);
    setStatus('style', onboarding.style || null);
  } catch (e) {
    ['identity', 'product', 'audience', 'style'].forEach(b => setStatus(b, null));
  }

  const allDone = ['identity', 'product', 'audience', 'style']
    .every(b => isDoneValue(onboarding[b] || null));

  if (completeCard) {
    completeCard.style.display = allDone ? 'block' : 'none';
  }

  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-open-block]');
    if (btn) {
      const block = btn.dataset.openBlock;
      if (block === 'identity') {
        facontShowView('onboarding_identity');
      } else if (block === 'product') {
        facontShowView('onboarding_product');
      } else if (block === 'audience') {
        facontShowView('onboarding_audience');
      } else if (block === 'style') {
        facontShowView('onboarding_style');
      }
      return;
    }

    const fin = e.target.closest('[data-onb-complete]');
    if (fin) {
      const action = fin.dataset.onbComplete;
      if (action === 'extended') {
        alert('Расширенная настройка пока не реализована.');
      } else if (action === 'content') {
        alert('Создание контента пока не реализовано.');
      }
    }
  });
}

/* -----------------------------
   Блок 1: Identity
------------------------------*/

function facontInitOnboardingIdentity() {
  const anyStep = document.querySelector('.onb1-step');
  if (!anyStep) return;
  const root = anyStep.parentElement || document;

  const steps = [
    'intro',
    'q1_1',
    'q1_2',
    'q1_3',
    'q1_4',
    'q1_5',
    'summary'
  ];
  let index = 0;

  const total = steps.length;
  const label = document.getElementById('onb1-progress-label');
  const bar = document.getElementById('onb1-progress-bar-inner');

  function showStep() {
    const all = root.querySelectorAll('.onb1-step');
    all.forEach(el => { el.style.display = 'none'; });

    const currentId = 'onb1-step-' + steps[index];
    const current = document.getElementById(currentId);
    if (current) current.style.display = 'block';

    if (label) {
      label.textContent = 'Шаг ' + (index + 1) + ' из ' + total;
    }
    if (bar) {
      const maxIndex = total - 1;
      const percent = maxIndex > 0 ? (index / maxIndex) * 100 : 100;
      bar.style.width = percent + '%';
    }
  }

  function validateRequired(requireId) {
    if (!requireId) return true;

    const el = document.getElementById(requireId);
    if (!el) return true;

    const value = (el.value || '').trim();
    if (!value) {
      alert('Заполни поле перед тем, как идти дальше.');
      el.focus();
      return false;
    }
    return true;
  }

  function collectAnswers() {
    return {
      q1_1_name: (document.getElementById('onb-q1-1-name')?.value || '').trim(),
      q1_2_role: (document.getElementById('onb-q1-2-role')?.value || '').trim(),
      q1_3_achievements: (document.getElementById('onb-q1-3-achievements')?.value || '').trim(),
      q1_4_what: (document.getElementById('onb-q1-4-what')?.value || '').trim(),
      q1_5_values: (document.getElementById('onb-q1-5-values')?.value || '').trim()
    };
  }

  async function saveBlock() {
    const btn = document.getElementById('btn-onb1-save');
    const busy = document.getElementById('onb1-busy');
    const status = document.getElementById('onb1-status');
    const finalEl = document.getElementById('onb1-final-text');

    if (!btn || !busy || !status || !finalEl) return;

    const answers = collectAnswers();

    const lines = [];
    Object.keys(answers).forEach(key => {
      const val = answers[key];
      if (val) {
        lines.push(key + ': ' + val);
      }
    });
    const inputText = lines.join('\n');
    const finalText = (finalEl.value || '').trim() || inputText;

    btn.disabled = true;
    busy.style.display = 'inline-block';
    status.textContent = '';

    try {
      await facontCallAPI('onboarding_save', {
        block: 'identity',
        answers,
        inputText,
        finalText,
        meta: {
          answers,
          ui_version: 1,
          saved_from: 'frontend_onboarding'
        }
      });
      status.textContent = 'Сохранено.';
    } catch (e) {
      status.textContent = 'Ошибка: ' + (e.message || e);
    } finally {
      btn.disabled = false;
      busy.style.display = 'none';
    }
  }

  root.addEventListener('click', (e) => {
    const nextBtn = e.target.closest('[data-onb1-next]');
    if (nextBtn) {
      const requireId = nextBtn.dataset.onb1Require || null;
      if (!validateRequired(requireId)) return;
      if (index < steps.length - 1) {
        index += 1;
        showStep();
      }
      return;
    }

    const prevBtn = e.target.closest('[data-onb1-prev]');
    if (prevBtn) {
      if (index > 0) {
        index -= 1;
        showStep();
      }
      return;
    }

    const saveBtn = e.target.closest('#btn-onb1-save');
    if (saveBtn) {
      saveBlock();
    }
  });

  showStep();
}

/* -----------------------------
   Блок 2: Product
------------------------------*/

function facontInitOnboardingProduct() {
  const anyStep = document.querySelector('.onb2-step');
  if (!anyStep) return;
  const root = anyStep.parentElement || document;

  const steps = [
    'intro',
    'q2_1',
    'q2_2',
    'q2_3',
    'q2_4',
    'q2_5',
    'q2_6',
    'summary'
  ];
  let index = 0;

  const total = steps.length;
  const label = document.getElementById('onb2-progress-label');
  const bar = document.getElementById('onb2-progress-bar-inner');

  function showStep() {
    const all = root.querySelectorAll('.onb2-step');
    all.forEach(el => { el.style.display = 'none'; });

    const currentId = 'onb2-step-' + steps[index];
    const current = document.getElementById(currentId);
    if (current) current.style.display = 'block';

    if (label) {
      label.textContent = 'Шаг ' + (index + 1) + ' из ' + total;
    }
    if (bar) {
      const maxIndex = total - 1;
      const percent = maxIndex > 0 ? (index / maxIndex) * 100 : 100;
      bar.style.width = percent + '%';
    }
  }

  function validateRequired(requireKey) {
    if (!requireKey) return true;

    if (requireKey === 'price') {
      const checked = root.querySelector('input[name="onb-q2-5-price"]:checked');
      if (!checked) {
        alert('Выбери примерный ценовой уровень перед продолжением.');
        return false;
      }
      return true;
    }

    const el = document.getElementById(requireKey);
    if (!el) return true;

    const value = (el.value || '').trim();
    if (!value) {
      alert('Заполни поле перед тем, как идти дальше.');
      el.focus();
      return false;
    }
    return true;
  }

  function collectAnswers() {
    const priceInput = root.querySelector('input[name="onb-q2-5-price"]:checked');
    const priceLevel = priceInput ? priceInput.value : '';

    return {
      q2_1_name: (document.getElementById('onb-q2-1-name')?.value || '').trim(),
      q2_2_what: (document.getElementById('onb-q2-2-what')?.value || '').trim(),
      q2_3_problems: (document.getElementById('onb-q2-3-problems')?.value || '').trim(),
      q2_4_benefits: (document.getElementById('onb-q2-4-benefits')?.value || '').trim(),
      q2_5_price_level: priceLevel,
      q2_6_unique: (document.getElementById('onb-q2-6-unique')?.value || '').trim()
    };
  }

  async function saveBlock() {
    const btn = document.getElementById('btn-onb2-save');
    const busy = document.getElementById('onb2-busy');
    const status = document.getElementById('onb2-status');
    const finalEl = document.getElementById('onb2-final-text');

    if (!btn || !busy || !status || !finalEl) return;

    const answers = collectAnswers();

    const lines = [];
    Object.keys(answers).forEach(key => {
      const val = answers[key];
      if (val) {
        lines.push(key + ': ' + val);
      }
    });
    const inputText = lines.join('\n');
    const finalText = (finalEl.value || '').trim() || inputText;

    btn.disabled = true;
    busy.style.display = 'inline-block';
    status.textContent = '';

    try {
      await facontCallAPI('onboarding_save', {
        block: 'product',
        answers,
        inputText,
        finalText,
        meta: {
          answers,
          ui_version: 1,
          saved_from: 'frontend_onboarding'
        }
      });
      status.textContent = 'Сохранено.';
    } catch (e) {
      status.textContent = 'Ошибка: ' + (e.message || e);
    } finally {
      btn.disabled = false;
      busy.style.display = 'none';
    }
  }

  root.addEventListener('click', (e) => {
    const nextBtn = e.target.closest('[data-onb2-next]');
    if (nextBtn) {
      const requireKey = nextBtn.dataset.onb2Require || null;
      if (!validateRequired(requireKey)) return;
      if (index < steps.length - 1) {
        index += 1;
        showStep();
      }
      return;
    }

    const prevBtn = e.target.closest('[data-onb2-prev]');
    if (prevBtn) {
      if (index > 0) {
        index -= 1;
        showStep();
      }
      return;
    }

    const saveBtn = e.target.closest('#btn-onb2-save');
    if (saveBtn) {
      saveBlock();
    }
  });

  showStep();
}

/* -----------------------------
   Блок 3: Audience
------------------------------*/

function facontInitOnboardingAudience() {
  const anyStep = document.querySelector('.onb3-step');
  if (!anyStep) return;
  const root = anyStep.parentElement || document;

  const steps = [
    'intro',
    'q3_1',
    'q3_2',
    'q3_3',
    'summary'
  ];
  let index = 0;

  const total = steps.length;
  const label = document.getElementById('onb3-progress-label');
  const bar = document.getElementById('onb3-progress-bar-inner');

  function showStep() {
    const all = root.querySelectorAll('.onb3-step');
    all.forEach(el => { el.style.display = 'none'; });

    const currentId = 'onb3-step-' + steps[index];
    const current = document.getElementById(currentId);
    if (current) current.style.display = 'block';

    if (label) {
      label.textContent = 'Шаг ' + (index + 1) + ' из ' + total;
    }
    if (bar) {
      const maxIndex = total - 1;
      const percent = maxIndex > 0 ? (index / maxIndex) * 100 : 100;
      bar.style.width = percent + '%';
    }
  }

  function validateRequired(requireId) {
    if (!requireId) return true;

    const el = document.getElementById(requireId);
    if (!el) return true;

    const value = (el.value || '').trim();
    if (!value) {
      alert('Заполни поле перед тем, как идти дальше.');
      el.focus();
      return false;
    }
    return true;
  }

  function collectAnswers() {
    return {
      q3_1_who: (document.getElementById('onb-q3-1-who')?.value || '').trim(),
      q3_2_problems: (document.getElementById('onb-q3-2-problems')?.value || '').trim(),
      q3_3_needs: (document.getElementById('onb-q3-3-needs')?.value || '').trim()
    };
  }

  async function saveBlock() {
    const btn = document.getElementById('btn-onb3-save');
    const busy = document.getElementById('onb3-busy');
    const status = document.getElementById('onb3-status');
    const finalEl = document.getElementById('onb3-final-text');

    if (!btn || !busy || !status || !finalEl) return;

    const answers = collectAnswers();

    const lines = [];
    Object.keys(answers).forEach(key => {
      const val = answers[key];
      if (val) {
        lines.push(key + ': ' + val);
      }
    });
    const inputText = lines.join('\n');
    const finalText = (finalEl.value || '').trim() || inputText;

    btn.disabled = true;
    busy.style.display = 'inline-block';
    status.textContent = '';

    try {
      await facontCallAPI('onboarding_save', {
        block: 'audience',
        answers,
        inputText,
        finalText,
        meta: {
          answers,
          ui_version: 1,
          saved_from: 'frontend_onboarding'
        }
      });
      status.textContent = 'Сохранено.';
    } catch (e) {
      status.textContent = 'Ошибка: ' + (e.message || e);
    } finally {
      btn.disabled = false;
      busy.style.display = 'none';
    }
  }

  root.addEventListener('click', (e) => {
    const nextBtn = e.target.closest('[data-onb3-next]');
    if (nextBtn) {
      const requireId = nextBtn.dataset.onb3Require || null;
      if (!validateRequired(requireId)) return;
      if (index < steps.length - 1) {
        index += 1;
        showStep();
      }
      return;
    }

    const prevBtn = e.target.closest('[data-onb3-prev]');
    if (prevBtn) {
      if (index > 0) {
        index -= 1;
        showStep();
      }
      return;
    }

    const saveBtn = e.target.closest('#btn-onb3-save');
    if (saveBtn) {
      saveBlock();
    }
  });

  showStep();
}

/* -----------------------------
   Блок 4: Style
------------------------------*/

function facontInitOnboardingStyle() {
  const anyStep = document.querySelector('.onb4-step');
  if (!anyStep) return;
  const root = anyStep.parentElement || document;

  const steps = [
    'intro',
    'q4_1',
    'q4_2',
    'process',
    'result',
    'full'
  ];
  let index = 0;

  const total = steps.length;
  const label = document.getElementById('onb4-progress-label');
  const bar = document.getElementById('onb4-progress-bar-inner');
  const statusEl = document.getElementById('onb4-status');
  const busyEl = document.getElementById('onb4-busy');

  function showStep() {
    const all = root.querySelectorAll('.onb4-step');
    all.forEach(el => { el.style.display = 'none'; });

    const currentId = 'onb4-step-' + steps[index];
    const current = document.getElementById(currentId);
    if (current) current.style.display = 'block';

    if (label) {
      label.textContent = 'Шаг ' + (index + 1) + ' из ' + total;
    }
    if (bar) {
      const maxIndex = total - 1;
      const percent = maxIndex > 0 ? (index / maxIndex) * 100 : 100;
      bar.style.width = percent + '%';
    }
  }

  function validateRequired(id) {
    if (!id) return true;
    const el = document.getElementById(id);
    if (!el) return true;
    const value = (el.value || '').trim();
    if (!value) {
      alert('Заполни поле перед тем, как идти дальше.');
      el.focus();
      return false;
    }
    return true;
  }

  function collectTexts() {
    return {
      text1: (document.getElementById('onb-q4-1-text')?.value || '').trim(),
      text2: (document.getElementById('onb-q4-2-text')?.value || '').trim(),
      text3: (document.getElementById('onb-q4-3-text')?.value || '').trim()
    };
  }

  async function runAnalysis() {
    const texts = collectTexts();
    if (!texts.text1 || !texts.text2) {
      alert('Нужны минимум два текста для анализа.');
      return;
    }

    if (statusEl) statusEl.textContent = '';
    if (busyEl) busyEl.style.display = 'inline-block';

    index = steps.indexOf('process');
    if (index < 0) index = 3;
    showStep();

    try {
      const res = await facontCallAPI('style_analyze', {
        text1: texts.text1,
        text2: texts.text2,
        text3: texts.text3
      });

      const summary = (res && res.summary) || '[краткое резюме стиля пока не сформировано]';
      const full = (res && res.full) || (res && res.analysis) || '';

      const summaryEl = document.getElementById('onb4-summary-short');
      const fullEl = document.getElementById('onb4-full-analysis');

      if (summaryEl) summaryEl.textContent = summary;
      if (fullEl) fullEl.textContent = full || summary;

      const inputText = [texts.text1, texts.text2, texts.text3].filter(Boolean).join('\n\n-----\n\n');
      const finalText = (res && res.stylePrompt) || full || summary;

      await facontCallAPI('onboarding_save', {
        block: 'style',
        answers: texts,
        inputText,
        finalText,
        meta: {
          summary,
          full,
          stylePrompt: res && res.stylePrompt
        }
      });

      if (statusEl) statusEl.textContent = 'Анализ завершён.';

      index = steps.indexOf('result');
      if (index < 0) index = 4;
      showStep();
    } catch (e) {
      if (statusEl) statusEl.textContent = 'Ошибка анализа: ' + (e.message || e);
      index = steps.indexOf('q4_2');
      if (index < 0) index = 2;
      showStep();
    } finally {
      if (busyEl) busyEl.style.display = 'none';
    }
  }

  root.addEventListener('click', (e) => {
    const nextBtn = e.target.closest('[data-onb4-next]');
    if (nextBtn) {
      const requireId = nextBtn.dataset.onb4Require || null;
      if (!validateRequired(requireId)) return;
      if (index < steps.length - 1) {
        index += 1;
        showStep();
      }
      return;
    }

    const prevBtn = e.target.closest('[data-onb4-prev]');
    if (prevBtn) {
      if (index > 0) {
        index -= 1;
        showStep();
      }
      return;
    }

    const analyzeBtn = e.target.closest('[data-onb4-analyze]');
    if (analyzeBtn) {
      runAnalysis();
      return;
    }

    const fullBtn = e.target.closest('[data-onb4-full]');
    if (fullBtn) {
      const idx = steps.indexOf('full');
      if (idx >= 0) {
        index = idx;
        showStep();
      }
      return;
    }

    const finishBtn = e.target.closest('[data-onb4-finish]');
    if (finishBtn) {
      facontShowView('onboarding_overview');
      return;
    }
  });

  showStep();
}

/* -----------------------------
   Экран: Настройки
------------------------------*/

function facontInitSettings() {
  const idEl = document.getElementById('set-user-id');
  const emailEl = document.getElementById('set-email');
  const firstNameEl = document.getElementById('set-first-name');
  const lastNameEl = document.getElementById('set-last-name');
  const langEl = document.getElementById('set-lang');

  // Integrations
  const telegramEl = document.getElementById('set-telegram-account');
  const openaiEl = document.getElementById('set-openai-key');
  const geminiEl = document.getElementById('set-gemini-key');
  const claudeEl = document.getElementById('set-claude-key');
  const preferredAiEl = document.getElementById('set-preferred-ai');

  const btnSaveUser = document.getElementById('btn-save-user');
  const busyUser = document.getElementById('save-user-busy');
  const statusUser = document.getElementById('save-user-status');

  async function loadSettings() {
    try {
      const res = await facontCallAPI('get_settings', {});
      const user = res && res.user ? res.user : {};

      if (idEl) idEl.value = user.id || FACONT_USER_ID || '';
      if (emailEl) emailEl.value = user.email || '';
      if (firstNameEl) firstNameEl.value = user.firstName || '';
      if (lastNameEl) lastNameEl.value = user.lastName || '';
      if (langEl) langEl.value = user.lang || user.language || '';

      if (telegramEl) telegramEl.value = user.telegramAccount || '';
      if (openaiEl) openaiEl.value = user.openaiKey || '';
      if (geminiEl) geminiEl.value = user.geminiKey || '';
      if (claudeEl) claudeEl.value = user.claudeKey || '';
      if (preferredAiEl) preferredAiEl.value = user.preferredAI || 'openai';
    } catch (e) {
      if (statusUser) {
        statusUser.textContent = 'Не удалось загрузить настройки: ' + (e.message || e);
      }
    }
  }

  async function saveUser() {
    if (!btnSaveUser || !busyUser || !statusUser) return;

    const email = (emailEl?.value || '').trim();
    const firstName = (firstNameEl?.value || '').trim();
    const lastName = (lastNameEl?.value || '').trim();
    const lang = (langEl?.value || '').trim();

    const telegramAccount = (telegramEl?.value || '').trim();
    const openaiKey = (openaiEl?.value || '').trim();
    const geminiKey = (geminiEl?.value || '').trim();
    const claudeKey = (claudeEl?.value || '').trim();
    const preferredAI = (preferredAiEl?.value || 'openai');

    btnSaveUser.disabled = true;
    busyUser.style.display = 'inline-block';
    statusUser.textContent = '';

    try {
      await facontCallAPI('save_user', {
        email,
        firstName,
        lastName,
        lang,
        telegramAccount,
        openaiKey,
        geminiKey,
        claudeKey,
        preferredAI
      });
      statusUser.textContent = 'Сохранено.';
    } catch (e) {
      statusUser.textContent = 'Ошибка: ' + (e.message || e);
    } finally {
      btnSaveUser.disabled = false;
      busyUser.style.display = 'none';
    }
  }

  if (btnSaveUser) {
    btnSaveUser.addEventListener('click', (e) => {
      e.preventDefault();
      saveUser();
    });
  }

  // Generic toggle handler
  document.querySelectorAll('[data-toggle-pass]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const selector = btn.dataset.togglePass;
      const input = document.querySelector(selector);
      if (input) {
        const isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';
        btn.textContent = isHidden ? 'Скрыть' : 'Показать';
      }
    });
  });
  
  loadSettings();
}

/* -----------------------------
   Экран: Профиль
------------------------------*/

function facontInitProfile() {
  const companyInfoEl = document.getElementById('prof-company-info');
  const stylePromptEl = document.getElementById('prof-style-prompt');
  const btnSaveStyle = document.getElementById('btn-save-style-profile');
  const busyStyle = document.getElementById('save-style-busy');
  const statusStyle = document.getElementById('save-style-status');

  const linksContainer = document.getElementById('facont-links-list');
  const btnAddLink = document.getElementById('btn-add-link');
  const btnSaveLinks = document.getElementById('btn-save-links');
  const busyLinks = document.getElementById('save-links-busy');
  const statusLinks = document.getElementById('save-links-status');

  function createLinkRow(link = {}) {
    if (!linksContainer) return;

    const row = document.createElement('div');
    row.className = 'facont-link-row';
    if (link.id) {
      row.dataset.id = String(link.id);
    }

    row.innerHTML = `
      <div class="row" style="margin-bottom:6px;">
        <div class="col">
          <input type="text" class="facont-link-url" placeholder="https://..." value="${link.url || ''}">
        </div>
        <div class="col">
          <select class="facont-link-type">
            <option value="">Тип</option>
            <option value="website">Сайт</option>
            <option value="gdoc">Документ Google Docs</option>
            <option value="notion">Документ Notion</option>
            <option value="linkedin">LinkedIn</option>
            <option value="telegram">Telegram-канал</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="threads">Threads</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>
        <div class="col" style="flex:0 0 auto;">
          <button type="button" class="btn secondary" data-remove-link>Удалить</button>
        </div>
      </div>
    `;

    const select = row.querySelector('.facont-link-type');
    if (select && link.type) {
      select.value = link.type;
    }

    linksContainer.appendChild(row);
  }

  function renderLinks(links) {
    if (!linksContainer) return;
    linksContainer.innerHTML = '';
    if (Array.isArray(links) && links.length) {
      links.forEach(link => createLinkRow(link));
    } else {
      createLinkRow();
    }
  }

  async function loadProfile() {
    try {
      const res = await facontCallAPI('get_profile', {});
      const profile =
        (res && res.profile) ||
        (res && res.user) ||
        res ||
        {};

      if (companyInfoEl) companyInfoEl.value = profile.companyInfo || '';
      if (stylePromptEl) stylePromptEl.value = profile.stylePrompt || '';

      renderLinks(profile.links || []);
    } catch (e) {
      if (statusStyle) {
        statusStyle.textContent = 'Не удалось загрузить профиль: ' + (e.message || e);
      }
      if (linksContainer) {
        renderLinks([]);
      }
    }
  }

  async function saveStyle() {
    if (!btnSaveStyle || !busyStyle || !statusStyle || !stylePromptEl) return;

    const stylePrompt = stylePromptEl.value || '';

    btnSaveStyle.disabled = true;
    busyStyle.style.display = 'inline-block';
    statusStyle.textContent = '';

    try {
      await facontCallAPI('save_style', { stylePrompt });
      statusStyle.textContent = 'Стиль сохранён.';
    } catch (e) {
      statusStyle.textContent = 'Ошибка: ' + (e.message || e);
    } finally {
      btnSaveStyle.disabled = false;
      busyStyle.style.display = 'none';
    }
  }

  async function saveLinks() {
    if (!linksContainer || !btnSaveLinks || !busyLinks || !statusLinks) return;

    const rows = linksContainer.querySelectorAll('.facont-link-row');
    const links = [];

    rows.forEach(row => {
      const urlEl = row.querySelector('.facont-link-url');
      const typeEl = row.querySelector('.facont-link-type');
      const url = (urlEl && urlEl.value || '').trim();
      const type = (typeEl && typeEl.value || '').trim();
      if (!url) return;

      const link = { url, type };
      const id = row.dataset.id;
      if (id) link.id = id;
      links.push(link);
    });

    btnSaveLinks.disabled = true;
    busyLinks.style.display = 'inline-block';
    statusLinks.textContent = '';

    try {
      await facontCallAPI('modify_links', { links });
      statusLinks.textContent = 'Ссылки сохранены.';
    } catch (e) {
      statusLinks.textContent = 'Ошибка: ' + (e.message || e);
    } finally {
      btnSaveLinks.disabled = false;
      busyLinks.style.display = 'none';
    }
  }

  if (btnSaveStyle) {
    btnSaveStyle.addEventListener('click', (e) => {
      e.preventDefault();
      saveStyle();
    });
  }

  if (btnAddLink && linksContainer) {
    btnAddLink.addEventListener('click', (e) => {
      e.preventDefault();
      createLinkRow();
    });
  }

  if (linksContainer) {
    linksContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-remove-link]');
      if (!btn) return;
      const row = btn.closest('.facont-link-row');
      if (row) row.remove();
    });
  }

  if (btnSaveLinks) {
    btnSaveLinks.addEventListener('click', (e) => {
      e.preventDefault();
      saveLinks();
    });
  }

  // --- Logic for Collect Info ---
  const btnCollect = document.getElementById('btn-collect-info');
  const urlCollect = document.getElementById('prof-collect-url');
  const statusCollect = document.getElementById('collect-info-status');
  const busyCollect = document.getElementById('collect-info-busy');

  if (btnCollect) {
    btnCollect.addEventListener('click', async () => {
      const url = (urlCollect && urlCollect.value || '').trim();
      if (!url) {
        if (statusCollect) statusCollect.textContent = 'Введите ссылку.';
        return;
      }

      btnCollect.disabled = true;
      if (busyCollect) busyCollect.style.display = 'inline-block';
      if (statusCollect) statusCollect.textContent = '';

      try {
        const res = await facontCallAPI('collect_site', { websiteUrl: url });
        if (companyInfoEl) {
          companyInfoEl.value = res.companyInfo || '';
        }
        if (statusCollect) statusCollect.textContent = 'Информация собрана и обновлена.';
      } catch (e) {
        if (statusCollect) statusCollect.textContent = 'Ошибка: ' + (e.message || e);
      } finally {
        btnCollect.disabled = false;
        if (busyCollect) busyCollect.style.display = 'none';
      }
    });
  }

  loadProfile();
}

/* -----------------------------
   Инициализация приложения
------------------------------*/

document.addEventListener('DOMContentLoaded', () => {
  // Проверяем URL параметры для роутинга (восстановление пароля, подтверждение почты)
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view');

  if (view === 'verify' || view === 'reset_password') {
    // Рендерим специфическую view без проверки авторизации (или параллельно)
    // Но нам нужна структура. facontShowView загружает в #facont-root, но это внутри main, который внутри #facont-root?
    // Нет, facontShowView загружает в #facont-main, который создается в facontRenderApp.
    // А если мы не залогинены, facontRenderApp не вызывается, и #facont-main нет.
    // Нам нужно загружать эти view прямо в #facont-root (как логин).
    
    // Специальная обработка для публичных страниц
    const root = document.getElementById('facont-root');
    let file = '';
    if (view === 'verify') file = 'verify.html';
    if (view === 'reset_password') file = 'reset-password.html';

    if (root && file) {
      root.innerHTML = 'Загрузка...';
      facontLoadPartialStr(file).then(html => {
        root.innerHTML = html;
        if (view === 'verify') facontInitVerify();
        if (view === 'reset_password') facontInitResetPassword();
      });
    }
    return; 
  }

  facontInitAuth();
});

/* -----------------------------
   Экран: Готовый контент (Список)
------------------------------*/

function facontInitContentList() {
  const tbody = document.getElementById('content-list-tbody');
  const table = document.getElementById('content-list-table');
  const status = document.getElementById('content-list-status');
  const btnRefresh = document.getElementById('btn-refresh-content');

  async function loadList() {
    if (status) {
      status.style.display = 'block';
      status.textContent = 'Загрузка...';
    }
    if (table) table.style.display = 'none';

    try {
      // Запрашиваем список у n8n
      const res = await facontCallAPI('content-list', {});
      // Ожидаем массив items: [{ id, created_at, generated_content, ... }]
      const items = (res && res.items) ? res.items : [];

      if (tbody) {
        tbody.innerHTML = '';
        if (items.length === 0) {
          if (status) {
            status.textContent = 'Нет созданного контента.';
            status.style.display = 'block';
          }
          return;
        }

        items.forEach(item => {
          const row = document.createElement('tr');
          
          // Дата
          const dateStr = item.created_at ? new Date(item.created_at).toLocaleString('ru-RU') : '—';
          
          // Начало текста (сниппет)
          const text = item.generated_content || '';
          const snippet = text.length > 60 ? text.substring(0, 60) + '...' : text;
          
          // Статус (если есть поле status, иначе по наличию текста)
          const isDone = !!text;
          const statusLabel = isDone ? '<span style="color:green">Готово</span>' : '<span style="color:orange">В обработке</span>';

          row.innerHTML = `
            <td style="padding:12px; border-bottom:1px solid #eee;">${dateStr}</td>
            <td style="padding:12px; border-bottom:1px solid #eee;">${statusLabel}</td>
            <td style="padding:12px; border-bottom:1px solid #eee; color:#555;">${snippet}</td>
            <td style="padding:12px; border-bottom:1px solid #eee; text-align:right;">
              <button class="facont-btn secondary small" data-open-id="${item.id}">Открыть</button>
            </td>
          `;
          tbody.appendChild(row);
        });
      }

      if (status) status.style.display = 'none';
      if (table) table.style.display = 'table';

    } catch (e) {
      if (status) {
        status.textContent = 'Ошибка загрузки: ' + (e.message || e);
        status.style.display = 'block';
      }
    }
  }

  if (btnRefresh) {
    btnRefresh.addEventListener('click', loadList);
  }
  
  if (tbody) {
    tbody.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-open-id]');
      if (btn) {
        const id = btn.dataset.openId;
        facontShowReview(id);
      }
    });
  }

  loadList();
}

/* -----------------------------
   Экран: Просмотр/Редактирование контента
------------------------------*/

async function facontInitContentReview(contentId) {
  if (!contentId) return;

  const titleEl = document.getElementById('review-title');
  const dateEl = document.getElementById('review-date');
  const transEl = document.getElementById('review-transcription');
  const contentEl = document.getElementById('review-content');
  
  const btnSave = document.getElementById('btn-save-content');
  const statusEl = document.getElementById('save-content-status');
  const busyEl = document.getElementById('save-content-busy');

  try {
    // Загрузка деталей
    const res = await facontCallAPI('content-get', { id: contentId });
    const item = res.item || {};

    if (dateEl) dateEl.textContent = item.created_at ? new Date(item.created_at).toLocaleString('ru-RU') : '';
    if (transEl) transEl.textContent = item.transcription || '(нет транскрипции)';
    if (contentEl) contentEl.value = item.generated_content || '';
    
  } catch (e) {
    if (transEl) transEl.textContent = 'Ошибка загрузки: ' + e.message;
  }

  // Сохранение
  if (btnSave) {
    btnSave.addEventListener('click', async () => {
      const newContent = contentEl ? contentEl.value : '';
      
      btnSave.disabled = true;
      if (busyEl) busyEl.style.display = 'inline-block';
      if (statusEl) statusEl.textContent = '';
      
      try {
        await facontCallAPI('content-update', {
          id: contentId,
          generated_content: newContent
        });
        if (statusEl) statusEl.textContent = 'Сохранено!';
      } catch (e) {
        if (statusEl) statusEl.textContent = 'Ошибка: ' + e.message;
      } finally {
        btnSave.disabled = false;
        if (busyEl) busyEl.style.display = 'none';
      }
    });
  }
}