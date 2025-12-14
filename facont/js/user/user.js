
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

// === Export ===
window.facontInitSettings = facontInitSettings;
window.facontInitProfile = facontInitProfile;