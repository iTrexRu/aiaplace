
// -----------------------------
// ONBOARDING MODULE (extracted from facont.js)
// -----------------------------

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

    const btnFill = card.querySelector('[data-open-block]');
    const btnView = card.querySelector('[data-onb-view]');
    const btnRestart = card.querySelector('[data-onb-restart]');

    if (done) {
      if (btnFill) btnFill.style.display = 'none';
      if (btnView) btnView.style.display = 'inline-flex';
      if (btnRestart) btnRestart.style.display = 'inline-flex';
    } else {
      if (btnFill) {
        btnFill.style.display = 'inline-flex';
        btnFill.textContent = 'Заполнить';
      }
      if (btnView) btnView.style.display = 'none';
      if (btnRestart) btnRestart.style.display = 'none';
    }

    // Save answers (meta.answers) for modal preview
    const answers =
      (value && typeof value === 'object' && value.meta && value.meta.answers && typeof value.meta.answers === 'object')
        ? value.meta.answers
        : (value && typeof value === 'object' && value.answers && typeof value.answers === 'object')
          ? value.answers
          : null;

    if (answers && card) {
      try {
        card.dataset.answers = JSON.stringify(answers);
      } catch (_) {
        // ignore
      }
    } else if (card) {
      delete card.dataset.answers;
    }
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

  function openModal(title, answers) {
    const modal = document.getElementById('facont-onb-view-modal');
    const titleEl = document.getElementById('facont-onb-view-title');
    const contentEl = document.getElementById('facont-onb-view-content');

    if (!modal || !contentEl) return;

    if (titleEl) titleEl.textContent = title || 'Просмотр';

    const entries = answers && typeof answers === 'object' ? Object.entries(answers) : [];

    if (!entries.length) {
      contentEl.innerHTML = '<p class="muted">Нет сохранённых ответов для просмотра.</p>';
    } else {
      const html = entries.map(([key, val]) => {
        let q = key;
        let a = '';

        if (Array.isArray(val)) {
          q = (val[0] != null ? String(val[0]) : key);
          a = (val[1] != null ? String(val[1]) : '');
        } else if (val && typeof val === 'object') {
          // fallback: { label, value }
          q = String(val.label || key);
          a = String(val.value || '');
        } else {
          a = (val != null ? String(val) : '');
        }

        return `
          <div class="facont-onb-qa-item">
            <div class="facont-onb-qa-q">${q}</div>
            <div class="facont-onb-qa-a">${a || '—'}</div>
          </div>
        `;
      }).join('');

      contentEl.innerHTML = `<div class="facont-onb-qa">${html}</div>`;
    }

    modal.style.display = 'flex';

    // Close handlers
    const closeBtns = modal.querySelectorAll('[data-modal-close]');
    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modal.style.display = 'none';
      }, { once: true });
    });

    // Esc
    const onKey = (ev) => {
      if (ev.key === 'Escape') {
        modal.style.display = 'none';
        window.removeEventListener('keydown', onKey);
      }
    };
    window.addEventListener('keydown', onKey);
  }

  root.addEventListener('click', (e) => {
    const btnFill = e.target.closest('[data-open-block]');
    if (btnFill) {
      const block = btnFill.dataset.openBlock;
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

    const btnRestart = e.target.closest('[data-onb-restart]');
    if (btnRestart) {
      const block = btnRestart.dataset.onbRestart;
      if (block === 'identity') {
        facontShowView('onboarding_identity');
      } else if (block === 'product') {
        facontShowView('onboarding_product');
      } else if (block === 'audience') {
        facontShowView('onboarding_audience');
      }
      return;
    }

    const btnView = e.target.closest('[data-onb-view]');
    if (btnView) {
      const block = btnView.dataset.onbView;
      const card = btnView.closest('.facont-onb-block');
      let answers = null;
      if (card && card.dataset.answers) {
        try {
          answers = JSON.parse(card.dataset.answers);
        } catch (_) {
          answers = null;
        }
      }

      const titleByBlock = {
        identity: 'Блок 1: Твоя личность — ответы',
        product: 'Блок 2: Продукт — ответы',
        audience: 'Блок 3: Аудитория — ответы'
      };

      openModal(titleByBlock[block] || 'Ответы', answers);
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
    'process',
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

  function collectAnswersRaw() {
    return {
      q1_1_name: (document.getElementById('onb-q1-1-name')?.value || '').trim(),
      q1_2_role: (document.getElementById('onb-q1-2-role')?.value || '').trim(),
      q1_3_achievements: (document.getElementById('onb-q1-3-achievements')?.value || '').trim(),
      q1_4_what: (document.getElementById('onb-q1-4-what')?.value || '').trim(),
      q1_5_values: (document.getElementById('onb-q1-5-values')?.value || '').trim()
    };
  }

  function collectAnswers() {
    const raw = collectAnswersRaw();
    return {
      q1_1_name: ['Имя', raw.q1_1_name],
      q1_2_role: ['Профессиональная роль', raw.q1_2_role],
      q1_3_achievements: ['Достижения', raw.q1_3_achievements],
      q1_4_what: ['Чем занимаешься', raw.q1_4_what],
      q1_5_values: ['Ценности', raw.q1_5_values]
    };
  }

  function buildInputTextFromAnswers(answers) {
    const lines = [];
    Object.keys(answers || {}).forEach(key => {
      const val = (answers && answers[key]) ? String(answers[key]).trim() : '';
      if (val) {
        lines.push(key + ': ' + val);
      }
    });
    return lines.join('\n');
  }

  function extractFinalText(res) {
    if (!res) return '';

    // Sometimes backend may return array
    if (Array.isArray(res) && res[0] && res[0].ok) {
      return String(
        res[0].finalText || res[0].text || res[0].result || res[0].summary || res[0].stylePrompt || ''
      ).trim();
    }

    if (typeof res === 'object') {
      return String(res.finalText || res.text || res.result || res.summary || res.stylePrompt || '').trim();
    }

    return String(res).trim();
  }

  async function submitBlock() {
    const busy = document.getElementById('onb1-submit-busy');
    const status = document.getElementById('onb1-submit-status');
    const finalEl = document.getElementById('onb1-final-text');

    const answers = collectAnswers();
    const answersRaw = collectAnswersRaw();
    const inputText = buildInputTextFromAnswers(answersRaw);

    if (status) status.textContent = '';
    if (busy) busy.style.display = 'inline-block';

    try {
      const res = await facontCallAPI('submit_onboarding', {
        block: 'identity',
        answers,
        inputText,
        meta: {
          answers,
          ui_version: 2,
          submitted_from: 'frontend_onboarding'
        }
      });

      const finalText = extractFinalText(res) || inputText;
      if (finalEl) finalEl.value = finalText;

      // Go to summary
      index = steps.indexOf('summary');
      if (index < 0) index = steps.length - 1;
      showStep();

    } catch (e) {
      if (status) status.textContent = 'Ошибка: ' + (e.message || e);
      // return to last question
      index = steps.indexOf('q1_5');
      if (index < 0) index = 5;
      showStep();
    } finally {
      if (busy) busy.style.display = 'none';
    }
  }

  async function saveBlock() {
    const btn = document.getElementById('btn-onb1-save');
    const busy = document.getElementById('onb1-busy');
    const status = document.getElementById('onb1-status');
    const finalEl = document.getElementById('onb1-final-text');

    if (!btn || !busy || !status || !finalEl) return;

    const answers = collectAnswers();
    const answersRaw = collectAnswersRaw();
    const inputText = buildInputTextFromAnswers(answersRaw);
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
          ui_version: 2,
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

      const currentStep = steps[index];
      const lastQuestionStep = 'q1_5';

      // Last question -> submit to n8n, show process
      if (currentStep === lastQuestionStep) {
        index = steps.indexOf('process');
        if (index < 0) index = steps.length - 2;
        showStep();
        submitBlock();
        return;
      }

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
    'process',
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

  function collectAnswersRaw() {
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

  function collectAnswers() {
    const raw = collectAnswersRaw();
    return {
      q2_1_name: ['Название продукта', raw.q2_1_name],
      q2_2_what: ['Что делает продукт', raw.q2_2_what],
      q2_3_problems: ['Какие проблемы решает', raw.q2_3_problems],
      q2_4_benefits: ['Преимущества', raw.q2_4_benefits],
      q2_5_price_level: ['Уровень цен', raw.q2_5_price_level],
      q2_6_unique: ['Уникальность', raw.q2_6_unique]
    };
  }

  function buildInputTextFromAnswers(answers) {
    const lines = [];
    Object.keys(answers || {}).forEach(key => {
      const val = (answers && answers[key]) ? String(answers[key]).trim() : '';
      if (val) {
        lines.push(key + ': ' + val);
      }
    });
    return lines.join('\n');
  }

  function extractFinalText(res) {
    if (!res) return '';

    if (Array.isArray(res) && res[0] && res[0].ok) {
      return String(
        res[0].finalText || res[0].text || res[0].result || res[0].summary || res[0].stylePrompt || ''
      ).trim();
    }

    if (typeof res === 'object') {
      return String(res.finalText || res.text || res.result || res.summary || res.stylePrompt || '').trim();
    }

    return String(res).trim();
  }

  async function submitBlock() {
    const busy = document.getElementById('onb2-submit-busy');
    const status = document.getElementById('onb2-submit-status');
    const finalEl = document.getElementById('onb2-final-text');

    const answers = collectAnswers();
    const answersRaw = collectAnswersRaw();
    const inputText = buildInputTextFromAnswers(answersRaw);

    if (status) status.textContent = '';
    if (busy) busy.style.display = 'inline-block';

    try {
      const res = await facontCallAPI('submit_onboarding', {
        block: 'product',
        answers,
        inputText,
        meta: {
          answers,
          ui_version: 2,
          submitted_from: 'frontend_onboarding'
        }
      });

      const finalText = extractFinalText(res) || inputText;
      if (finalEl) finalEl.value = finalText;

      index = steps.indexOf('summary');
      if (index < 0) index = steps.length - 1;
      showStep();

    } catch (e) {
      if (status) status.textContent = 'Ошибка: ' + (e.message || e);
      index = steps.indexOf('q2_6');
      if (index < 0) index = 6;
      showStep();
    } finally {
      if (busy) busy.style.display = 'none';
    }
  }

  async function saveBlock() {
    const btn = document.getElementById('btn-onb2-save');
    const busy = document.getElementById('onb2-busy');
    const status = document.getElementById('onb2-status');
    const finalEl = document.getElementById('onb2-final-text');

    if (!btn || !busy || !status || !finalEl) return;

    const answers = collectAnswers();
    const answersRaw = collectAnswersRaw();
    const inputText = buildInputTextFromAnswers(answersRaw);
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
          ui_version: 2,
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

      const currentStep = steps[index];
      const lastQuestionStep = 'q2_6';

      if (currentStep === lastQuestionStep) {
        index = steps.indexOf('process');
        if (index < 0) index = steps.length - 2;
        showStep();
        submitBlock();
        return;
      }

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
    'process',
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

  function collectAnswersRaw() {
    return {
      q3_1_who: (document.getElementById('onb-q3-1-who')?.value || '').trim(),
      q3_2_problems: (document.getElementById('onb-q3-2-problems')?.value || '').trim(),
      q3_3_needs: (document.getElementById('onb-q3-3-needs')?.value || '').trim()
    };
  }

  function collectAnswers() {
    const raw = collectAnswersRaw();
    return {
      q3_1_who: ['Кто твоя ЦА', raw.q3_1_who],
      q3_2_problems: ['Проблемы аудитории', raw.q3_2_problems],
      q3_3_needs: ['Потребности аудитории', raw.q3_3_needs]
    };
  }

  function buildInputTextFromAnswers(answers) {
    const lines = [];
    Object.keys(answers || {}).forEach(key => {
      const val = (answers && answers[key]) ? String(answers[key]).trim() : '';
      if (val) {
        lines.push(key + ': ' + val);
      }
    });
    return lines.join('\n');
  }

  function extractFinalText(res) {
    if (!res) return '';

    if (Array.isArray(res) && res[0] && res[0].ok) {
      return String(
        res[0].finalText || res[0].text || res[0].result || res[0].summary || res[0].stylePrompt || ''
      ).trim();
    }

    if (typeof res === 'object') {
      return String(res.finalText || res.text || res.result || res.summary || res.stylePrompt || '').trim();
    }

    return String(res).trim();
  }

  async function submitBlock() {
    const busy = document.getElementById('onb3-submit-busy');
    const status = document.getElementById('onb3-submit-status');
    const finalEl = document.getElementById('onb3-final-text');

    const answers = collectAnswers();
    const answersRaw = collectAnswersRaw();
    const inputText = buildInputTextFromAnswers(answersRaw);

    if (status) status.textContent = '';
    if (busy) busy.style.display = 'inline-block';

    try {
      const res = await facontCallAPI('submit_onboarding', {
        block: 'audience',
        answers,
        inputText,
        meta: {
          answers,
          ui_version: 2,
          submitted_from: 'frontend_onboarding'
        }
      });

      const finalText = extractFinalText(res) || inputText;
      if (finalEl) finalEl.value = finalText;

      index = steps.indexOf('summary');
      if (index < 0) index = steps.length - 1;
      showStep();

    } catch (e) {
      if (status) status.textContent = 'Ошибка: ' + (e.message || e);
      index = steps.indexOf('q3_3');
      if (index < 0) index = 3;
      showStep();
    } finally {
      if (busy) busy.style.display = 'none';
    }
  }

  async function saveBlock() {
    const btn = document.getElementById('btn-onb3-save');
    const busy = document.getElementById('onb3-busy');
    const status = document.getElementById('onb3-status');
    const finalEl = document.getElementById('onb3-final-text');

    if (!btn || !busy || !status || !finalEl) return;

    const answers = collectAnswers();
    const answersRaw = collectAnswersRaw();
    const inputText = buildInputTextFromAnswers(answersRaw);
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
          ui_version: 2,
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

      const currentStep = steps[index];
      const lastQuestionStep = 'q3_3';

      if (currentStep === lastQuestionStep) {
        index = steps.indexOf('process');
        if (index < 0) index = steps.length - 2;
        showStep();
        submitBlock();
        return;
      }

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

// === Export ===
window.facontInitOnboardingOverview = facontInitOnboardingOverview;
window.facontInitOnboardingIdentity = facontInitOnboardingIdentity;
window.facontInitOnboardingProduct = facontInitOnboardingProduct;
window.facontInitOnboardingAudience = facontInitOnboardingAudience;
window.facontInitOnboardingStyle = facontInitOnboardingStyle;
