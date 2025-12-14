// -----------------------------
// GENERIC GENERATOR HELPERS
// -----------------------------
// Shared behaviour for generator screens (titles/carousel/reels + stories-text refactor)

function facontNormalizeError(e) {
  if (!e) return 'Неизвестная ошибка';
  if (typeof e === 'string') return e;
  if (e.message) return e.message;
  try {
    return JSON.stringify(e);
  } catch (_) {
    return String(e);
  }
}

function facontShowInlineError(el, message) {
  if (!el) return;
  const msg = (message || '').trim();
  if (!msg) {
    el.textContent = '';
    el.style.display = 'none';
    return;
  }
  el.textContent = msg;
  el.style.display = 'block';
}

// Binds behaviour similar to stories-text:
// - generate: cmdGenerate with { text }
// - save: cmdSave with { id, generated_content }
function facontBindGeneratorScreen(cfg) {
  const {
    // dom
    generateBtnId,
    inputId,
    instructionBlockId,
    resultBlockId,
    resultTextareaId,
    actionsBlockId,
    saveBtnId,
    linkNewId,
    generateErrorId,
    saveErrorId,

    // behavior
    cmdGenerate,
    generateBtnLoadingText,
    generateBtnText,
    saveBtnLoadingText,
    saveBtnText,
  } = cfg;

  const btnGenerate = document.getElementById(generateBtnId);
  const inputEl = document.getElementById(inputId);
  const instructionBlock = document.getElementById(instructionBlockId);
  const resultBlock = document.getElementById(resultBlockId);
  const resultText = document.getElementById(resultTextareaId);
  const actionsBlock = actionsBlockId ? document.getElementById(actionsBlockId) : null;
  const btnSave = saveBtnId ? document.getElementById(saveBtnId) : null;
  const linkNew = linkNewId ? document.getElementById(linkNewId) : null;
  const generateErrorEl = generateErrorId ? document.getElementById(generateErrorId) : null;
  const saveErrorEl = saveErrorId ? document.getElementById(saveErrorId) : null;

  if (!btnGenerate) return;

  // Generate Handler
  btnGenerate.addEventListener('click', async () => {
    facontShowInlineError(generateErrorEl, '');
    facontShowInlineError(saveErrorEl, '');

    const text = (inputEl && inputEl.value ? inputEl.value : '').trim();
    if (!text) {
      facontShowInlineError(generateErrorEl, 'Пожалуйста, введите текст.');
      return;
    }

    btnGenerate.disabled = true;
    btnGenerate.textContent = generateBtnLoadingText || 'Генерирую...';

    try {
      const res = await facontCallAPI(cmdGenerate, { text });

      // If backend returns a logical error in JSON with HTTP 200
      if (res && typeof res === 'object') {
        const logicalError =
          res.error ||
          res.err ||
          (res.success === false ? (res.message || res.error || res.err || 'Ошибка выполнения') : null);

        if (logicalError) {
          throw new Error(logicalError);
        }
      }

      const content =
        typeof res === 'string'
          ? res
          : (res && (res.result || res.text || res.generated_content)
              ? (res.result || res.text || res.generated_content)
              : '');
      const id = res ? res.id : null;

      if (id && resultBlock) {
        resultBlock.dataset.id = id;
      }

      if (instructionBlock) instructionBlock.style.display = 'none';
      if (resultBlock) resultBlock.style.display = 'block';
      if (resultText) resultText.value = content;
      if (actionsBlock) actionsBlock.style.display = 'flex';

    } catch (e) {
      facontShowInlineError(generateErrorEl, 'Ошибка: ' + facontNormalizeError(e));
    } finally {
      btnGenerate.disabled = false;
      btnGenerate.textContent = generateBtnText || btnGenerate.textContent || 'Сгенерировать';
      // Ensure stable label
      if (generateBtnText) btnGenerate.textContent = generateBtnText;
    }
  });

  // Save Handler
  if (btnSave) {
    btnSave.addEventListener('click', async () => {
      facontShowInlineError(saveErrorEl, '');

      const content = resultText ? (resultText.value || '') : '';
      if (!content.trim()) return;

      const id = resultBlock ? resultBlock.dataset.id : null;
      if (!id) {
        facontShowInlineError(saveErrorEl, 'Ошибка: ID записи не найден. Возможно, генерация не вернула ID.');
        return;
      }

      btnSave.disabled = true;
      btnSave.textContent = saveBtnLoadingText || 'Сохранение...';

      try {
        const res = await facontCallAPI('content-update', {
          id,
          generated_content: content
        });

        if (res && typeof res === 'object') {
          const logicalError =
            res.error ||
            res.err ||
            (res.success === false ? (res.message || res.error || res.err || 'Ошибка сохранения') : null);
          if (logicalError) {
            throw new Error(logicalError);
          }
        }

        facontShowInlineError(saveErrorEl, '');
      } catch (e) {
        facontShowInlineError(saveErrorEl, 'Ошибка сохранения: ' + facontNormalizeError(e));
      } finally {
        btnSave.disabled = false;
        if (saveBtnText) btnSave.textContent = saveBtnText;
      }
    });
  }

  // Navigation handlers
  if (actionsBlock) {
    actionsBlock.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-open]');
      if (btn) {
        const view = btn.dataset.open;
        if (view && window.facontShowView) {
          facontShowView(view);
        }
      }
    });
  }

  // "Create new" link
  if (linkNew) {
    linkNew.addEventListener('click', (e) => {
      e.preventDefault();

      if (inputEl) inputEl.value = '';

      if (resultBlock) {
        resultBlock.style.display = 'none';
        delete resultBlock.dataset.id;
      }
      if (instructionBlock) instructionBlock.style.display = 'block';
      if (resultText) resultText.value = '';

      facontShowInlineError(generateErrorEl, '');
      facontShowInlineError(saveErrorEl, '');

      window.scrollTo(0, 0);
    });
  }
}

// Export
window.facontBindGeneratorScreen = facontBindGeneratorScreen;
window.facontNormalizeError = facontNormalizeError;
window.facontShowInlineError = facontShowInlineError;
