// -----------------------------
// MY PROMPT FEATURE
// -----------------------------

function facontNormalizeMyPromptItem(item) {
  if (!item || typeof item !== 'object') return null;
  return {
    id: item.id || item.prompt_id || item._id || null,
    title: item.title || item.name || item.prompt_title || 'Без названия',
    text: item.prompt_text || item.text || item.prompt || ''
  };
}

async function facontFetchMyPrompts() {
  const res = await facontCallAPI('list_my_prompts');
  const raw = Array.isArray(res) ? res : (res && (res.items || res.prompts || res.data) ? (res.items || res.prompts || res.data) : []);
  return raw.map(facontNormalizeMyPromptItem).filter(Boolean);
}

function facontFillThemeInput(inputEl) {
  if (!inputEl) return;
  if (inputEl.value) return;
  try {
    const savedTheme = (localStorage.getItem('facont_current_theme') || '').trim();
    if (savedTheme) inputEl.value = savedTheme;
  } catch (_) {}
}

// === RUN SCREEN ===
function facontInitMyPrompt() {
  const selectEl = document.getElementById('my-prompt-select');
  const promptTextEl = document.getElementById('my-prompt-text');
  const themeEl = document.getElementById('my-prompt-theme');
  const btnRun = document.getElementById('my-prompt-run');
  const btnManage = document.getElementById('my-prompt-manage-link');
  const resultBlock = document.getElementById('my-prompt-result');
  const resultText = document.getElementById('my-prompt-result-text');
  const errorEl = document.getElementById('my-prompt-generate-error');
  const busyEl = document.getElementById('my-prompt-busy');

  if (!selectEl || !promptTextEl || !themeEl || !btnRun) return;

  facontFillThemeInput(themeEl);

  let promptsCache = [];

  function setError(message) {
    if (!errorEl) return;
    errorEl.textContent = message || '';
    errorEl.style.display = message ? 'block' : 'none';
  }

  function setBusy(isBusy) {
    if (busyEl) busyEl.style.display = isBusy ? 'inline-block' : 'none';
    btnRun.disabled = isBusy;
  }

  function renderSelect(prompts) {
    selectEl.innerHTML = '';
    if (!prompts || !prompts.length) {
      const opt = document.createElement('option');
      opt.value = '__add__';
      opt.textContent = 'Добавить...';
      selectEl.appendChild(opt);
      promptTextEl.value = '';
      return;
    }

    const first = document.createElement('option');
    first.value = prompts[0].id || '';
    first.textContent = prompts[0].title || 'Промт';
    selectEl.appendChild(first);

    prompts.slice(1).forEach((prompt) => {
      const opt = document.createElement('option');
      opt.value = prompt.id || '';
      opt.textContent = prompt.title || 'Промт';
      selectEl.appendChild(opt);
    });

    promptTextEl.value = prompts[0].text || '';
  }

  async function loadPrompts() {
    try {
      promptsCache = await facontFetchMyPrompts();
      renderSelect(promptsCache);
    } catch (e) {
      setError('Ошибка загрузки промтов: ' + facontNormalizeError(e));
    }
  }

  selectEl.addEventListener('change', () => {
    const selected = selectEl.value;
    if (selected === '__add__') {
      if (btnManage && window.facontShowView) {
        window.facontShowView('my_prompt_manage');
      }
      return;
    }
    const prompt = promptsCache.find(p => String(p.id) === String(selected));
    if (prompt) {
      promptTextEl.value = prompt.text || '';
    }
  });

  if (btnManage) {
    btnManage.addEventListener('click', () => {
      if (window.facontShowView) window.facontShowView('my_prompt_manage');
    });
  }

  btnRun.addEventListener('click', async () => {
    setError('');
    const promptText = (promptTextEl.value || '').trim();
    const themeText = (themeEl.value || '').trim();

    if (!promptText) {
      setError('Введите текст промта.');
      return;
    }
    if (!themeText) {
      setError('Введите тему.');
      return;
    }

    setBusy(true);
    try {
      if (typeof window.facontSetThemeFromInput === 'function') {
        window.facontSetThemeFromInput(themeText);
      }
      if (typeof window.facontMarkThemeProgress === 'function') {
        window.facontMarkThemeProgress('my_prompt');
      }
      const res = await facontCallAPI('run_my_prompt', {
        prompt_text: promptText,
        theme: themeText
      });

      const content =
        typeof res === 'string'
          ? res
          : (res && (res.result || res.text || res.generated_content)
              ? (res.result || res.text || res.generated_content)
              : '');

      if (resultText) resultText.value = content || 'Ответ пустой.';
      if (resultBlock) resultBlock.style.display = 'block';
      if (resultBlock) resultBlock.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
      setError('Ошибка выполнения: ' + facontNormalizeError(e));
    } finally {
      setBusy(false);
    }
  });

  loadPrompts();
}

// === MANAGE SCREEN ===
function facontInitMyPromptManage() {
  const listEl = document.getElementById('my-prompt-list');
  const listEmpty = document.getElementById('my-prompt-list-empty');
  const errorEl = document.getElementById('my-prompt-manage-error');
  const btnAdd = document.getElementById('my-prompt-add');
  const btnBack = document.getElementById('my-prompt-back');

  const modal = document.getElementById('my-prompt-modal');
  const modalTitle = document.getElementById('my-prompt-modal-title');
  const modalTitleInput = document.getElementById('my-prompt-title');
  const modalBodyInput = document.getElementById('my-prompt-body');
  const modalError = document.getElementById('my-prompt-modal-error');
  const modalCancel = document.getElementById('my-prompt-cancel');
  const modalSave = document.getElementById('my-prompt-save');

  if (!listEl || !btnAdd) return;

  let promptsCache = [];
  let editingPromptId = null;

  function setError(message) {
    if (!errorEl) return;
    errorEl.textContent = message || '';
    errorEl.style.display = message ? 'block' : 'none';
  }

  function setModalError(message) {
    if (!modalError) return;
    modalError.textContent = message || '';
    modalError.style.display = message ? 'block' : 'none';
  }

  function openModal(mode, prompt) {
    editingPromptId = prompt && prompt.id ? prompt.id : null;
    if (modalTitle) modalTitle.textContent = mode === 'edit' ? 'Редактировать промт' : 'Новый промт';
    if (modalTitleInput) modalTitleInput.value = prompt ? prompt.title : '';
    if (modalBodyInput) modalBodyInput.value = prompt ? prompt.text : '';
    setModalError('');
    if (modal) modal.style.display = 'flex';
  }

  function closeModal() {
    if (modal) modal.style.display = 'none';
  }

  async function refreshList() {
    try {
      promptsCache = await facontFetchMyPrompts();
      renderList(promptsCache);
    } catch (e) {
      setError('Ошибка загрузки промтов: ' + facontNormalizeError(e));
    }
  }

  function renderList(prompts) {
    listEl.innerHTML = '';
    if (!prompts || !prompts.length) {
      if (listEmpty) listEmpty.style.display = 'block';
      return;
    }
    if (listEmpty) listEmpty.style.display = 'none';

    prompts.forEach((prompt) => {
      const row = document.createElement('div');
      row.className = 'facont-flex';
      row.style.gap = '10px';
      row.style.alignItems = 'center';
      row.style.justifyContent = 'space-between';
      row.style.padding = '10px 12px';
      row.style.border = '1px solid var(--facont-border-soft)';
      row.style.borderRadius = '10px';
      row.style.background = 'var(--facont-bg-main)';

      const info = document.createElement('div');
      info.style.flex = '1';
      const title = document.createElement('div');
      title.style.fontWeight = '700';
      title.textContent = prompt.title || 'Без названия';
      const preview = document.createElement('div');
      preview.style.fontSize = '12px';
      preview.style.color = 'var(--facont-text-muted)';
      preview.style.marginTop = '4px';
      preview.textContent = (prompt.text || '').slice(0, 120);
      info.appendChild(title);
      info.appendChild(preview);

      const actions = document.createElement('div');
      actions.style.display = 'flex';
      actions.style.gap = '8px';
      const btnEdit = document.createElement('button');
      btnEdit.className = 'btn secondary';
      btnEdit.textContent = 'Редактировать';
      btnEdit.addEventListener('click', () => openModal('edit', prompt));
      const btnDelete = document.createElement('button');
      btnDelete.className = 'btn secondary';
      btnDelete.textContent = 'Удалить';
      btnDelete.addEventListener('click', () => deletePrompt(prompt));

      actions.appendChild(btnEdit);
      actions.appendChild(btnDelete);

      row.appendChild(info);
      row.appendChild(actions);
      listEl.appendChild(row);
    });
  }

  async function savePrompt() {
    setModalError('');
    const title = (modalTitleInput ? modalTitleInput.value : '').trim();
    const body = (modalBodyInput ? modalBodyInput.value : '').trim();
    if (!title || !body) {
      setModalError('Заполните название и текст промта.');
      return;
    }

    try {
      const payload = {
        title,
        prompt_text: body
      };
      if (editingPromptId) payload.id = editingPromptId;
      await facontCallAPI('update_prompt', payload);
      closeModal();
      await refreshList();
    } catch (e) {
      setModalError('Ошибка сохранения: ' + facontNormalizeError(e));
    }
  }

  async function deletePrompt(prompt) {
    if (!prompt || !prompt.id) return;
    if (!confirm('Удалить промт?')) return;
    try {
      await facontCallAPI('update_prompt', { id: prompt.id, delete: true });
      await refreshList();
    } catch (e) {
      setError('Ошибка удаления: ' + facontNormalizeError(e));
    }
  }

  if (btnAdd) {
    btnAdd.addEventListener('click', () => openModal('add', null));
  }

  if (btnBack) {
    btnBack.addEventListener('click', () => {
      if (window.facontShowView) window.facontShowView('my_prompt');
    });
  }

  if (modalCancel) {
    modalCancel.addEventListener('click', closeModal);
  }

  if (modalSave) {
    modalSave.addEventListener('click', savePrompt);
  }

  if (modal) {
    modal.addEventListener('click', (event) => {
      const target = event.target;
      if (target && target.hasAttribute('data-my-prompt-close')) {
        closeModal();
      }
    });
  }

  refreshList();
}

window.facontInitMyPrompt = facontInitMyPrompt;
window.facontInitMyPromptManage = facontInitMyPromptManage;