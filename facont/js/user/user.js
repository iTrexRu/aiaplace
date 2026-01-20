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
  const blocks = ['identity', 'product', 'audience', 'style'];
  
  // Elements
  const linksContainer = document.getElementById('prof-links-list');
  const btnAddLink = document.getElementById('btn-add-link-item');
  const newLinkUrl = document.getElementById('prof-new-link-url');
  const newLinkType = document.getElementById('prof-new-link-type');
  const saveLinksStatus = document.getElementById('save-links-status');

  const btnAddUrl = document.getElementById('btn-add-url');
  const inputAddUrl = document.getElementById('prof-add-url');
  const statusAddUrl = document.getElementById('prof-add-url-status');

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
      // Load Settings (Onboarding status) + Profile (Links)
      const [resSettings, resProfile] = await Promise.all([
        facontCallAPI('get_settings', {}),
        facontCallAPI('get_profile', {})
      ]);

      const user = resSettings.user || {};
      const onboarding = user.onboarding || {};
      const onboardingByStep = resSettings.onboardingByStep || {};
      const profile = (resProfile && resProfile.profile) || (resProfile && resProfile.user) || resProfile || {};

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
          // Try to get summary from onboardingByStep
          const entry = onboardingByStep[block];
          let text = '';
          if (entry && entry.meta) {
             text = entry.meta.summary || entry.meta.finalText || entry.meta.result || '';
          }
          // If empty but done, maybe we don't have meta yet?
          if (!text && isDone) text = 'Данные заполнены.';
          if (!text && !isDone) text = 'Пройдите этот блок в онбординге.';
          
          summaryEl.textContent = text.length > 150 ? text.substring(0, 150) + '...' : text;
        }

        // Buttons
        if (btnView) btnView.style.display = isDone ? 'inline-flex' : 'none';
        if (btnEdit) {
           btnEdit.textContent = isDone ? 'Редактировать' : 'Заполнить';
           // If not done, maybe highlight?
           if (!isDone) {
             btnEdit.style.background = 'var(--facont-btn-bg)';
             btnEdit.classList.remove('secondary');
           } else {
             btnEdit.classList.add('secondary'); // or keep primary? Screenshot shows primary for Edit
             btnEdit.style.background = 'var(--facont-btn-bg)';
           }
        }
      });

      // Render Links
      renderLinks(profile.links || []);

    } catch (e) {
      console.error(e);
    }
  }

  // --- Handlers ---

  // Card Buttons
  document.querySelectorAll('[data-prof-action]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = btn.dataset.profAction;
      const block = btn.dataset.block;
      
      if (action === 'view') {
        // Show modal with answers? Or go to onboarding view?
        // Reuse onboarding modal if possible? 
        // Or just redirect to onboarding block page which has "View" logic?
        // Let's redirect to onboarding block.
        if (window.facontShowView) window.facontShowView('onboarding_' + block);
      } else if (action === 'edit') {
        if (window.facontShowView) window.facontShowView('onboarding_' + block);
      }
    });
  });

  // Add Link
  if (btnAddLink) {
    btnAddLink.addEventListener('click', async (e) => {
      const url = newLinkUrl.value.trim();
      const type = newLinkType.value;
      
      if (!url) return;
      
      // Save immediately
      try {
        if (saveLinksStatus) saveLinksStatus.textContent = 'Сохранение...';
        
        // We need to get current links first? Or just append?
        // API 'modify_links' usually replaces? Or adds?
        // Let's fetch current profile again to be safe or maintain local state.
        // Assuming we just send the NEW list.
        
        // Collect existing links from DOM? No, better from state.
        // But for simplicity, let's assume we need to send ALL links.
        // We'll reload profile, add new one, save all.
        
        const res = await facontCallAPI('get_profile', {});
        const currentLinks = (res.profile && res.profile.links) || [];
        
        currentLinks.push({ url, type, id: Date.now() });
        
        await facontCallAPI('modify_links', { links: currentLinks });
        
        newLinkUrl.value = '';
        renderLinks(currentLinks);
        if (saveLinksStatus) saveLinksStatus.textContent = '';
        
      } catch (e) {
        if (saveLinksStatus) saveLinksStatus.textContent = 'Ошибка: ' + e.message;
      }
    });
  }

  // Remove Link
  if (linksContainer) {
    linksContainer.addEventListener('click', async (e) => {
      if (e.target.closest('[data-remove-link]')) {
        const row = e.target.closest('.facont-link-row');
        // Delete from server?
        // We need to save the new state without this link.
        // Simple approach: remove from DOM, then save all DOM links.
        if (row) {
           row.remove();
           // Collect all links from DOM
           const links = [];
           linksContainer.querySelectorAll('.facont-link-row').forEach(r => {
              const url = r.querySelector('a').href;
              const type = r.querySelector('div > div').textContent.toLowerCase(); // rough
              // Better to store data in row
              links.push({ url, type: 'saved' }); // We lose type info if parsing DOM text?
           });
           
           // Actually, better to reload-modify-save logic.
           // But here let's just trigger reload? No.
           // Let's re-implement saveLinks properly.
           saveAllLinksFromDOM();
        }
      }
    });
  }
  
  async function saveAllLinksFromDOM() {
     // This is tricky if we don't store structured data in DOM.
     // Let's reload logic: fetch, filter, save.
     // To filter, we need ID.
     // I added data-id to row.
     // ...
     // Let's defer complexity. The user wants "Add/Remove".
     // I'll stick to a simpler flow: Add calls API. Remove calls API (if API supports remove).
     // Current API `modify_links` replaces whole list.
     // So I need the list.
     
     // REWRITE: Keep links in memory.
  }
  
  let currentLinksState = [];
  
  // Override loadProfile to store state
  const originalLoadProfile = loadProfile;
  loadProfile = async function() {
     await originalLoadProfile();
     // Update local state from what we rendered? 
     // Better: Update renderLinks to update state.
     // But renderLinks is called by loadProfile.
     // Let's just fetch again in loadProfile and set state.
     const res = await facontCallAPI('get_profile', {});
     currentLinksState = (res.profile && res.profile.links) || [];
     renderLinks(currentLinksState);
  }

  // Add Link (Updated)
  if (btnAddLink) {
    // Remove old listener if any? No, we are defining new function scope.
    // Replace element to clear listeners
    const newBtn = btnAddLink.cloneNode(true);
    btnAddLink.parentNode.replaceChild(newBtn, btnAddLink);
    
    newBtn.addEventListener('click', async () => {
       const url = newLinkUrl.value.trim();
       const type = newLinkType.value;
       if (!url) return;
       
       currentLinksState.push({ url, type, id: Date.now() });
       renderLinks(currentLinksState);
       newLinkUrl.value = '';
       
       try {
         await facontCallAPI('modify_links', { links: currentLinksState });
       } catch(e) { console.error(e); }
    });
  }
  
  // Remove Link logic in renderLinks
  // We need to re-attach event delegation or handle it.
  // Using existing delegation on linksContainer.
  linksContainer.addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-remove-link]');
      if (!btn) return;
      const row = btn.closest('.facont-link-row');
      const id = row.dataset.id;
      
      currentLinksState = currentLinksState.filter(l => String(l.id) !== String(id));
      renderLinks(currentLinksState);
      
      try {
         await facontCallAPI('modify_links', { links: currentLinksState });
      } catch(e) { console.error(e); }
  });


  // Add Data from URL
  if (btnAddUrl) {
    btnAddUrl.addEventListener('click', async () => {
      const url = inputAddUrl.value.trim();
      if (!url) return;
      
      btnAddUrl.disabled = true;
      statusAddUrl.textContent = 'Обработка...';
      
      try {
        await facontCallAPI('collect_site', { websiteUrl: url });
        statusAddUrl.textContent = 'Данные добавлены в профиль.';
        inputAddUrl.value = '';
      } catch(e) {
        statusAddUrl.textContent = 'Ошибка: ' + e.message;
      } finally {
        btnAddUrl.disabled = false;
      }
    });
  }

  loadProfile();
}

window.facontInitSettings = facontInitSettings;
window.facontInitProfile = facontInitProfile;
