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
    if (bodyEl) bodyEl.textContent = text || '';
  }

  function clearActions() {
    if (!actionsEl) return;
    actionsEl.innerHTML = '';
    actionsEl.style.display = 'none';
  }

  function addBtn(label, view, variant = 'primary') {
    if (!actionsEl) return;
    const btn = document.createElement('button');
    btn.className = variant === 'secondary' ? 'facont-btn secondary' : 'facont-btn';
    btn.type = 'button';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      if (window.facontShowView) {
        facontShowView(view);
      }
    });
    actionsEl.appendChild(btn);
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
      if (allDone) {
        if (titleEl) titleEl.textContent = 'Чем займемся сегодня?';
        setBody('');
      } else {
        if (titleEl) titleEl.textContent = 'Добро пожаловать в Фабрику контента!';
        setBody(
          'Что будем делать сейчас?\n' +
          '- Завершим настройку системы под вас (это займёт 5–7 минут)'
        );
      }

      // Actions for partial or full onboarding
      ensureActionsVisible();

      if (!allDone) {
        addBtn('Завершить настройку', 'onboarding_overview');
      }

      // Generators
      addBtn('Пост из голоса', 'voice_post', 'secondary');
      addBtn('Сторис из текста', 'stories_text', 'secondary');
      addBtn('Заголовки', 'titles', 'secondary');
      addBtn('Карусель', 'carousel', 'secondary');
      addBtn('Reels', 'reels', 'secondary');

      // Content list
      addBtn('Готовый контент', 'content_list');

      if (!allDone) {
        // Add text after buttons for non-complete state
        setBody(
          'Добро пожаловать в Фабрику контента!\n\n' +
          'Что будем делать сейчас?\n' +
          '- Завершим настройку системы под вас (это займёт 5–7 минут)\n\n' +
          '- Начнем создавать контент?\n\n' +
          '- Посмотрим, какой контент уже сделан раньше?'
        );
      }

    } catch (e) {
      if (titleEl) titleEl.textContent = 'Facont';
      setBody('');
      setError('Не удалось загрузить данные пользователя: ' + (e && e.message ? e.message : String(e || '')));
    }
  })();
}

// Export
window.facontInitHome = facontInitHome;
