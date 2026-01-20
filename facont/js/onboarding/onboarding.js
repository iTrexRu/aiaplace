// -----------------------------
// ONBOARDING MODULE (Refactored)
// -----------------------------

/* -----------------------------
   Helpers
------------------------------*/
function isDoneValue(value) {
  let status = null;
  if (value && typeof value === 'object') {
    status = value.status || null;
  } else {
    status = value;
  }
  return status === 'ok';
}

function renderBlockCard(block) {
  return `
    <div class="facont-card facont-onb-block" data-block="${block.id}">
      <h2>${block.title}</h2>
      <p>${block.description}</p>
      <p class="facont-onb-status" data-status="${block.id}">Загрузка…</p>
      <div class="facont-onb-actions">
        <button class="facont-btn" data-open-block="${block.id}">Заполнить</button>
        <button class="facont-btn secondary" data-onb-view="${block.id}" style="display:none;">Просмотреть</button>
        <button class="facont-btn" data-onb-restart="${block.id}" style="display:none;">Пройти заново</button>
      </div>
    </div>
  `;
}

function updateBlockStatus(root, blockId, value) {
  const el = root.querySelector(`[data-status="${blockId}"]`);
  if (!el) return;

  const done = isDoneValue(value);
  el.textContent = done ? 'Готово' : 'Не заполнен';
  el.classList.remove('done', 'todo');
  el.classList.add(done ? 'done' : 'todo');

  const card = root.querySelector(`.facont-onb-block[data-block="${blockId}"]`);
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
}

function storeBlockAnswers(root, blockId, answers) {
  const card = root.querySelector(`.facont-onb-block[data-block="${blockId}"]`);
  if (!card) return;

  if (!answers || typeof answers !== 'object' || !Object.keys(answers).length) {
    delete card.dataset.answers;
    return;
  }

  try {
    card.dataset.answers = JSON.stringify(answers);
  } catch (_) {
    delete card.dataset.answers;
  }
}

/* -----------------------------
   Overview Page
------------------------------*/
async function facontInitOnboardingOverview() {
  const root = document.getElementById('facont-onb0');
  if (!root) return;

  const grid = document.getElementById('onb-overview-grid');
  const config = window.FACONT_ONBOARDING_CONFIG;

  if (!config || !config.blocks) {
    if (grid) grid.innerHTML = '<p class="error">Ошибка конфигурации: blocks not found. (Config script might not be loaded)</p>';
    return;
  }

  // Sort blocks
  const blocks = config.blocks.sort((a, b) => a.order - b.order);

  // Render Grid
  if (grid) {
    grid.innerHTML = blocks.map(block => renderBlockCard(block)).join('');
  }

  // Load Status
  try {
    const res = await facontCallAPI('get_settings', {});
    const user = res && res.user ? res.user : {};
    const onboarding = user.onboarding || {};
    const onboardingByStep = (res && res.onboardingByStep && typeof res.onboardingByStep === 'object') 
      ? res.onboardingByStep 
      : {};

    // Update statuses and progress
    let doneCount = 0;
    blocks.forEach(block => {
      const done = isDoneValue(onboarding[block.id]);
      if (done) doneCount++;
      
      updateBlockStatus(root, block.id, onboarding[block.id]);
      
      // Answers for modal
      const entry = onboardingByStep[block.id];
      const answers = entry && entry.meta && entry.meta.answers ? entry.meta.answers : null;
      storeBlockAnswers(root, block.id, answers);
    });

    // Progress Bar
    const totalCount = blocks.length;
    const progressEl = document.getElementById('onb-total-progress-bar');
    const progressText = document.getElementById('onb-total-progress-text');
    if (progressEl) progressEl.style.width = ((doneCount / totalCount) * 100) + '%';
    if (progressText) progressText.textContent = `${doneCount}/${totalCount}`;

    // Completion
    const allDone = doneCount === totalCount;
    const completeCard = root.querySelector('#facont-onb-complete');
    if (completeCard) completeCard.style.display = allDone ? 'block' : 'none';

    // Welcome Modal logic
    const welcomeModal = document.getElementById('facont-onb-welcome-modal');
    if (welcomeModal) {
      const seen = localStorage.getItem('facont_onboarding_welcome_seen');
      // Show if not seen yet
      if (!seen) {
        welcomeModal.style.display = 'flex';
        
        const startBtn = document.getElementById('btn-onb-start');
        if (startBtn) {
          // Clone to prevent duplicate listeners if re-inited
          const newBtn = startBtn.cloneNode(true);
          startBtn.parentNode.replaceChild(newBtn, startBtn);
          
          newBtn.addEventListener('click', () => {
            welcomeModal.style.display = 'none';
            localStorage.setItem('facont_onboarding_welcome_seen', 'true');
          });
        }
      }
    }

  } catch (e) {
    console.error('Failed to load settings', e);
  }

  // Event Handlers (Click delegation)
  // Check if listener already attached to avoid duplicates? 
  // Ideally we should remove old listener or use a flag. 
  // Simplest: just attach. If re-attached, multiple events? 
  // root is typically replaced when view changes, so fine.
  
  root.addEventListener('click', (e) => {
    // Fill / Restart
    const btnOpen = e.target.closest('[data-open-block]') || e.target.closest('[data-onb-restart]');
    if (btnOpen) {
      const blockId = btnOpen.dataset.openBlock || btnOpen.dataset.onbRestart;
      facontShowView('onboarding_' + blockId);
      return;
    }

    // View Answers
    const btnView = e.target.closest('[data-onb-view]');
    if (btnView) {
      const blockId = btnView.dataset.onbView;
      const card = btnView.closest('.facont-onb-block');
      let answers = null;
      if (card && card.dataset.answers) {
        try { answers = JSON.parse(card.dataset.answers); } catch (_) {}
      }
      
      const blockConfig = blocks.find(b => b.id === blockId);
      const title = blockConfig ? `${blockConfig.title} — ответы` : 'Ответы';
      openModal(title, answers);
      return;
    }

    // Complete Actions
    const fin = e.target.closest('[data-onb-complete]');
    if (fin) {
      const action = fin.dataset.onbComplete;
      if (action === 'extended') alert('Расширенная настройка пока не реализована.');
      else if (action === 'content') {
        // Redirect to content creation (e.g. idea post)
        if (window.facontShowView) window.facontShowView('idea_post');
      }
    }
  });
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

  const closeBtns = modal.querySelectorAll('[data-modal-close]');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => { modal.style.display = 'none'; }, { once: true });
  });

  const onKey = (ev) => {
    if (ev.key === 'Escape') {
      modal.style.display = 'none';
      window.removeEventListener('keydown', onKey);
    }
  };
  window.addEventListener('keydown', onKey);
}

/* -----------------------------
   Generic Block Init
------------------------------*/
function facontInitOnboardingGeneric(blockId, containerId) {
  const config = window.FACONT_ONBOARDING_CONFIG;
  if (!config || !config.blocks) {
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = '<p class="error">Ошибка конфигурации: blocks not found. (Config script might not be loaded)</p>';
    console.error('Onboarding config missing');
    return;
  }
  
  const blockConfig = config.blocks.find(b => b.id === blockId);
  if (!blockConfig) {
    console.error(`Block config for ${blockId} not found`);
    return;
  }

  // If engine class is loaded
  if (typeof OnboardingEngine === 'function') {
    const engine = new OnboardingEngine(containerId, blockConfig);
    engine.start();
  } else {
    const container = document.getElementById(containerId);
    if (container) container.innerHTML = '<p class="error">Ошибка: OnboardingEngine class not found.</p>';
    console.error('OnboardingEngine class not found');
  }
}

// Exports
window.facontInitOnboardingOverview = facontInitOnboardingOverview;
window.facontInitOnboardingIdentity = () => facontInitOnboardingGeneric('identity', 'facont-onb-identity-container');
window.facontInitOnboardingProduct = () => facontInitOnboardingGeneric('product', 'facont-onb-product-container');
window.facontInitOnboardingAudience = () => facontInitOnboardingGeneric('audience', 'facont-onb-audience-container');
window.facontInitOnboardingStyle = () => facontInitOnboardingGeneric('style', 'facont-onb-style-container');
