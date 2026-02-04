// -----------------------------
// USER MODULE (extracted from facont.js)
// -----------------------------

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
   Экран: Профиль (Redesigned)
------------------------------*/

function facontInitProfile() {
  console.log('Profile Init Started');
  const blocks = ['identity', 'product', 'audience', 'style'];
  
  // Local state
  let currentLinksState = [];
  let lastOnboardingByStep = {};

  // Elements
  const linksContainer = document.getElementById('prof-links-list');
  const btnAddLink = document.getElementById('btn-add-link-item');
  const newLinkUrl = document.getElementById('prof-new-link-url');
  const newLinkType = document.getElementById('prof-new-link-type');
  const saveLinksStatus = document.getElementById('save-links-status');

  const btnAddUrl = document.getElementById('btn-add-url');
  const inputAddUrl = document.getElementById('prof-add-url');
  const statusAddUrl = document.getElementById('prof-add-url-status');

  const btnUpgradePro = document.getElementById('btn-upgrade-pro');
  const statusPayment = document.getElementById('payment-status');

  // --- Helper: Render Link Row ---
  function createLinkRow(link = {}) {
    if (!linksContainer) return;

    const row = document.createElement('div');
    row.className = 'facont-link-row';
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.justifyContent = 'space-between';
    row.style.padding = '10px';
    row.style.background = 'var(--facont-bg-main)';
    row.style.borderRadius = '8px';
    row.style.marginBottom = '8px';
    row.style.border = '1px solid var(--facont-border-soft)';

    if (link.id) row.dataset.id = String(link.id);
    
    // Icon based on type? For now just generic or text
    const typeLabel = link.type || 'Ссылка';
    
    row.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px; overflow:hidden;">
        <div style="background:#eee; padding:6px; border-radius:4px; font-size:12px; font-weight:600; text-transform:uppercase;">${typeLabel}</div>
        <a href="${link.url}" target="_blank" style="text-decoration:none; color:var(--facont-text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${link.url}</a>
      </div>
      <button class="btn secondary" data-remove-link style="padding:4px 10px; font-size:12px;">✕</button>
    `;

    linksContainer.appendChild(row);
  }

  function renderLinks(links) {
    if (!linksContainer) return;
    linksContainer.innerHTML = '';
    if (Array.isArray(links) && links.length) {
      links.forEach(link => createLinkRow(link));
    } else {
      linksContainer.innerHTML = '<p class="muted" style="font-size:13px; padding:10px;">Нет добавленных ссылок</p>';
    }
  }

  // --- Load Data ---
  async function loadProfile() {
    try {
      console.log('Loading Profile Data...');
      // Use get_profile primarily as requested
      const resProfile = await facontCallAPI('get_profile', {});
      const profile = (Array.isArray(resProfile) ? resProfile[0] : resProfile) || {};
      
      // Also get onboarding status from settings if needed
      const resSettings = await facontCallAPI('get_settings', {});
      const settingsData = (Array.isArray(resSettings) ? resSettings[0] : resSettings) || {};
      const user = settingsData.user || {};
      const onboarding = user.onboarding || {};
      
      // Merge onboardingByStep from profile (if exists) or settings
      const onboardingByStep = profile.onboardingByStep || settingsData.onboardingByStep || {};
      lastOnboardingByStep = onboardingByStep;
      console.log('OnboardingByStep Loaded:', lastOnboardingByStep);

      // Render Cards
      blocks.forEach(block => {
        const card = document.getElementById(`prof-card-${block}`);
        if (!card) return;

        const statusBadge = card.querySelector(`[data-prof-status="${block}"]`);
        const summaryEl = card.querySelector(`[data-prof-summary="${block}"]`);
        const btnView = card.querySelector(`[data-prof-action="view"]`);
        const btnEdit = card.querySelector(`[data-prof-action="edit"]`);

        const isDone = (onboarding[block] && (onboarding[block].status === 'ok' || onboarding[block] === 'ok'));
        
        // Status Badge
        if (statusBadge) {
          if (isDone) {
            statusBadge.textContent = 'Заполнено';
            statusBadge.style.background = 'var(--facont-btn-bg)'; // Yellow
            statusBadge.style.color = 'var(--facont-text)';
          } else {
            statusBadge.textContent = 'Не заполнен';
            statusBadge.style.background = '#ffe0e0'; // Pinkish
            statusBadge.style.color = 'var(--facont-danger)';
          }
        }

        // Summary
        if (summaryEl) {
          let text = '';
          // Check onboardingByStep[block].aiOutput
          const stepData = onboardingByStep[block];
          if (stepData && stepData.aiOutput) {
             text = stepData.aiOutput;
          } else if (stepData && stepData.meta) {
             // Fallback
             text = stepData.meta.summary || stepData.meta.finalText || '';
          }
          
          if (!text && isDone) text = 'Данные заполнены.';
          if (!text && !isDone) text = 'Пройдите этот блок в онбординге.';
          
          summaryEl.textContent = text.length > 150 ? text.substring(0, 150) + '...' : text;
        }

        // Buttons
        if (btnView) btnView.style.display = isDone ? 'inline-flex' : 'none';
        if (btnEdit) {
           btnEdit.textContent = isDone ? 'Редактировать' : 'Заполнить';
           if (!isDone) {
             btnEdit.style.background = 'var(--facont-btn-bg)';
             btnEdit.classList.remove('secondary');
           } else {
             btnEdit.classList.add('secondary');
             btnEdit.style.background = 'var(--facont-btn-bg)';
           }
        }
      });

      // Render Links
      const links = profile.links || (profile.user && profile.user.links) || [];
      currentLinksState = links;
      renderLinks(currentLinksState);

      // --- Subscription UI ---
      const isPro = onboarding && onboarding.pro === 'ok';
      const subActions = document.getElementById('prof-sub-actions');
      const subStatusOk = document.getElementById('prof-sub-status-ok');
      const subDesc = document.getElementById('prof-sub-desc');

      if (isPro) {
        if (subActions) subActions.style.display = 'none';
        if (subStatusOk) subStatusOk.style.display = 'flex';
        if (subDesc) subDesc.textContent = 'У вас активирован полный доступ ко всем функциям системы.';
      } else {
        if (subActions) subActions.style.display = 'flex';
        if (subStatusOk) subStatusOk.style.display = 'none';
        if (subDesc) subDesc.textContent = 'Доступ ко всем генераторам и неограниченному количеству контента.';
      }

    } catch (e) {
      console.error('Error loading profile:', e);
    }
  }

  // --- Handlers ---

  document.querySelectorAll('[data-prof-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = btn.dataset.profAction;
      const block = btn.dataset.block;
      console.log('Profile Action Clicked:', action, block);
      
      if (action === 'view') {
        const stepData = lastOnboardingByStep[block];
        const answers = stepData && stepData.meta && stepData.meta.answers;
        const aiOutput = stepData && stepData.aiOutput;
        
        console.log('View Data:', { stepData, answers, aiOutput });
        
        const blockConfig = window.FACONT_ONBOARDING_CONFIG ? window.FACONT_ONBOARDING_CONFIG.blocks.find(b => b.id === block) : null;
        const title = blockConfig ? `${blockConfig.title} — ответы` : 'Ответы';
        
        if (window.facontOpenOnboardingModal) {
           console.log('Opening Modal via Global Function');
           window.facontOpenOnboardingModal(title, answers, aiOutput);
        } else {
           console.error('facontOpenOnboardingModal not found');
        }
      } else if (action === 'edit') {
        if (window.facontShowView) window.facontShowView('onboarding_' + block);
      }
    });
  });

  // Add Link
  if (btnAddLink) {
    const newBtn = btnAddLink.cloneNode(true);
    btnAddLink.parentNode.replaceChild(newBtn, btnAddLink);
    
    newBtn.addEventListener('click', async () => {
       const url = newLinkUrl.value.trim();
       const type = newLinkType.value;
       if (!url) return;
       
       if (saveLinksStatus) saveLinksStatus.textContent = 'Сохранение...';
       
       const newLinks = [...currentLinksState, { url, type, id: Date.now() }];
       
       try {
         const res = await facontCallAPI('modify_links', { links: newLinks });
         
         if (res.ok === false && res.text) {
            if (saveLinksStatus) saveLinksStatus.textContent = res.text;
            return;
         }
         
         // Success
         currentLinksState = newLinks;
         renderLinks(currentLinksState);
         newLinkUrl.value = '';
         if (saveLinksStatus) saveLinksStatus.textContent = '';
         
       } catch(e) { 
         if (saveLinksStatus) saveLinksStatus.textContent = 'Ошибка: ' + e.message;
       }
    });
  }
  
  // Remove Link
  linksContainer.addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-remove-link]');
      if (!btn) return;
      const row = btn.closest('.facont-link-row');
      const id = row.dataset.id;
      
      const newLinks = currentLinksState.filter(l => String(l.id) !== String(id));
      
      try {
         const res = await facontCallAPI('modify_links', { links: newLinks });
         
         if (res.ok === false && res.text) {
            alert(res.text); // Fallback alert for remove error
            return;
         }
         
         currentLinksState = newLinks;
         renderLinks(currentLinksState);
      } catch(e) { console.error(e); }
  });


  // Upgrade to PRO
  if (btnUpgradePro) {
    btnUpgradePro.addEventListener('click', async () => {
      btnUpgradePro.disabled = true;
      if (statusPayment) {
        statusPayment.style.display = 'block';
        statusPayment.textContent = 'Подготовка оплаты...';
      }

      try {
        const res = await facontCallAPI('payment_init', {
          amount: 10,
          currency: 'USD',
          tariff: 'pro_monthly'
        });

        if (res && res.payment_url) {
          const w = 500;
          const h = 700;
          const left = (screen.width / 2) - (w / 2);
          const top = (screen.height / 2) - (h / 2);
          
          window.open(
            res.payment_url, 
            'AllPay', 
            `width=${w},height=${h},top=${top},left=${left},status=yes,toolbar=no,menubar=no,location=no`
          );

          if (statusPayment) {
            statusPayment.textContent = 'Окно оплаты открыто. После завершения платежа обновите страницу.';
            statusPayment.classList.remove('facont-text-danger');
            statusPayment.classList.add('facont-text-success');
          }
          btnUpgradePro.disabled = false;
        } else {
          throw new Error(res.message || 'Не удалось получить ссылку на оплату');
        }
      } catch (e) {
        if (statusPayment) {
          statusPayment.textContent = 'Ошибка: ' + (e.message || e);
          statusPayment.classList.add('facont-text-danger');
        }
        btnUpgradePro.disabled = false;
      }
    });
  }

  // Add Data from URL
  if (btnAddUrl) {
    btnAddUrl.addEventListener('click', async () => {
      const url = inputAddUrl.value.trim();
      if (!url) return;
      
      btnAddUrl.disabled = true;
      statusAddUrl.textContent = 'Обработка...';
      
      try {
        const res = await facontCallAPI('collect_site', { websiteUrl: url });
        
        if (res.ok === false && res.text) {
           statusAddUrl.textContent = res.text;
        } else {
           statusAddUrl.textContent = 'Данные добавлены в профиль.';
           inputAddUrl.value = '';
           // Reload profile to see changes?
           loadProfile();
        }
      } catch(e) {
        statusAddUrl.textContent = 'Ошибка: ' + e.message;
      } finally {
        btnAddUrl.disabled = false;
      }
    });
  }

  // --- Handle Payment Return ---
  function checkPaymentStatus() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      if (statusPayment) {
        statusPayment.style.display = 'block';
        statusPayment.textContent = 'Оплата прошла успешно! Ваш аккаунт PRO активирован.';
        statusPayment.classList.remove('facont-text-danger');
        statusPayment.classList.add('facont-text-success');
      }
      
      // Clear URL params to avoid message on refresh
      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      window.history.replaceState({}, '', url.toString());

      // Notify user with alert or modal if needed
      // alert('Поздравляем! Доступ PRO активирован.');
    }
  }

  loadProfile();
  checkPaymentStatus();
}

window.facontInitSettings = facontInitSettings;
window.facontInitProfile = facontInitProfile;
