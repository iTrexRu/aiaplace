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
        addBtn('Пост из голоса', 'voice_post');
        addBtn('Сторис из текста', 'stories_text');
        addBtn('Заголовки', 'titles');
        addBtn('Карусель', 'carousel');
        addBtn('Reels', 'reels');
        addBtn('Готовый контент', 'content_list');
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
      addBtn('Пост из голоса', 'voice_post', generatorsActionsEl);
      addBtn('Сторис из текста', 'stories_text', generatorsActionsEl);
      addBtn('Заголовки', 'titles', generatorsActionsEl);
      addBtn('Карусель', 'carousel', generatorsActionsEl);
      addBtn('Reels', 'reels', generatorsActionsEl);

      // content list under "Посмотрим..."
      addBtn('Готовый контент', 'content_list', contentActionsEl);
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
