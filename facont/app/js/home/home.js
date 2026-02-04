// -----------------------------
// HOME MODULE
// -----------------------------

function facontInitHome() {
  const titleEl = document.getElementById('facont-home-title');
  const bodyEl = document.getElementById('facont-home-body');
  const actionsEl = document.getElementById('facont-home-actions');
  const errorEl = document.getElementById('facont-home-error');

  function setError(msg) {
    if (!errorEl) return;
    const t = (msg || '').trim();
    if (!t) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
      return;
    }
    errorEl.textContent = t;
    errorEl.style.display = 'block';
  }

  function setBody(text) {
    if (!bodyEl) return;
    bodyEl.textContent = text || '';
  }

  function setBodyHtml(html) {
    if (!bodyEl) return;
    bodyEl.innerHTML = html || '';
  }

  function clearActions() {
    if (!actionsEl) return;
    actionsEl.innerHTML = '';
    actionsEl.style.display = 'none';
  }

  function addBtn(label, view, mountEl = actionsEl) {
    if (!mountEl) return;

    const btn = document.createElement('button');
    // Home: always primary
    btn.className = 'facont-btn';
    btn.type = 'button';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      if (window.facontShowView) {
        facontShowView(view);
      }
    });

    mountEl.appendChild(btn);
  }

  function ensureActionsVisible() {
    if (!actionsEl) return;
    actionsEl.style.display = 'flex';
    actionsEl.style.flexWrap = 'wrap';
    actionsEl.style.gap = '10px';
  }

  function isDone(value) {
    if (!value) return false;
    if (typeof value === 'object') {
      return (value.status || '') === 'ok';
    }
    return value === 'ok';
  }

  async function loadStats() {
    const statsEl = document.getElementById('facont-home-stats');
    if (!statsEl) return;

    // TODO: Move to settings config. Rate: 1500 RUB/h, Time: 0.5h
    const PRICE_PER_CONTENT = 750;

    try {
      const res = await facontCallAPI('content-list', {});
      
      const rawItems =
        (res && typeof res === 'object' && !Array.isArray(res) && Array.isArray(res.items))
          ? res.items
          : (Array.isArray(res) && res[0] && Array.isArray(res[0].items))
            ? res[0].items
            : [];

      const items = (rawItems || []).filter((it) => {
        const generated = (it && it.generated_content ? String(it.generated_content) : '').trim();
        return generated.length > 0;
      });

      const totalCount = items.length;
      const totalSaved = totalCount * PRICE_PER_CONTENT;

      const now = new Date();
      const todayString = now.toLocaleDateString('ru-RU');
      
      const todayItems = items.filter(it => {
        if (!it.created_at) return false;
        const d = new Date(it.created_at);
        return d.toLocaleDateString('ru-RU') === todayString;
      });

      const todayCount = todayItems.length;
      const todaySaved = todayCount * PRICE_PER_CONTENT;

      const elTotalCount = document.getElementById('stat-total-count');
      const elTotalSaved = document.getElementById('stat-total-saved');
      const elTodayCount = document.getElementById('stat-today-count');
      const elTodaySaved = document.getElementById('stat-today-saved');

      if (elTotalCount) elTotalCount.textContent = String(totalCount);
      if (elTotalSaved) elTotalSaved.textContent = totalSaved.toLocaleString('ru-RU') + ' ₽';
      if (elTodayCount) elTodayCount.textContent = String(todayCount);
      if (elTodaySaved) elTodaySaved.textContent = todaySaved.toLocaleString('ru-RU') + ' ₽';

      statsEl.style.display = 'block';

    } catch (e) {
      console.warn('Failed to load stats:', e);
      statsEl.style.display = 'none';
    }
  }

  (async () => {
    setError('');
    clearActions();

    if (titleEl) titleEl.textContent = 'Загрузка...';
    setBody('');

    try {
      const res = await facontCallAPI('get_settings', {});
      const user = res && res.user ? res.user : {};
      const onboarding = user.onboarding || {};

      const blocks = ['identity', 'product', 'audience', 'style'];
      const doneCount = blocks.reduce((acc, b) => acc + (isDone(onboarding[b]) ? 1 : 0), 0);

      // 0 blocks done
      if (doneCount === 0) {
        if (titleEl) titleEl.textContent = 'Добро пожаловать в Фабрику контента!';
        setBody(
          'Давайте настроим систему под вас.\n' +
          'Это займёт 5–7 минут.\n\n' +
          'Я задам простые вопросы о вас, вашем бизнесе\n' +
          'и аудитории. Можно заполнять в любом порядке,\n' +
          'всё сохраняется автоматически.'
        );
        ensureActionsVisible();
        addBtn('Начать настройку', 'onboarding_overview');
        return;
      }

      // all blocks done
      const allDone = doneCount === blocks.length;

      // all done: show generators as primary buttons
      if (allDone) {
        if (titleEl) titleEl.textContent = 'Чем займемся сегодня?';
        setBody('');

        ensureActionsVisible();
        addBtn('Идея в пост', 'idea_post');
        addBtn('Сторис из текста', 'stories_text');
        addBtn('Заголовки', 'titles');
        addBtn('Карусель', 'carousel');
        addBtn('Reels', 'reels');
        addBtn('Готовый контент', 'content_list');
        loadStats();
        return;
      }

      // partial onboarding: structured layout with buttons under each пункт
      if (titleEl) titleEl.textContent = 'Добро пожаловать в Фабрику контента!';

      // (1) no "Добро пожаловать..." in the body
      // (2) make "Что будем делать сейчас?" bold
      setBodyHtml(
        '<strong>Что будем делать сейчас?</strong>' +
          '<div class="facont-mt-12">- Завершим настройку системы под вас (это займёт 5–7 минут)</div>' +
          '<div id="facont-home-actions-onboarding" class="facont-home-actions facont-mt-10"></div>' +
          '<div class="facont-mt-16">- Начнем создавать контент?</div>' +
          '<div id="facont-home-actions-generators" class="facont-home-actions facont-mt-10"></div>' +
          '<div class="facont-mt-16">- Посмотрим, какой контент уже сделан раньше?</div>' +
          '<div id="facont-home-actions-content" class="facont-home-actions facont-mt-10"></div>'
      );

      const onboardingActionsEl = document.getElementById('facont-home-actions-onboarding');
      const generatorsActionsEl = document.getElementById('facont-home-actions-generators');
      const contentActionsEl = document.getElementById('facont-home-actions-content');

      // (3) "Завершить настройку" under onboarding пункт
      addBtn('Завершить настройку', 'onboarding_overview', onboardingActionsEl);

      // (4) generators under "Начнем создавать контент?"
      addBtn('Идея в пост', 'idea_post', generatorsActionsEl);
      addBtn('Сторис из текста', 'stories_text', generatorsActionsEl);
      addBtn('Заголовки', 'titles', generatorsActionsEl);
      addBtn('Карусель', 'carousel', generatorsActionsEl);
      addBtn('Reels', 'reels', generatorsActionsEl);

      // content list under "Посмотрим..."
      addBtn('Готовый контент', 'content_list', contentActionsEl);
      loadStats();
      return;

    } catch (e) {
      if (titleEl) titleEl.textContent = 'Facont';
      setBody('');
      setError('Не удалось загрузить данные пользователя: ' + (e && e.message ? e.message : String(e || '')));
    }
  })();
}

// Export
window.facontInitHome = facontInitHome;
