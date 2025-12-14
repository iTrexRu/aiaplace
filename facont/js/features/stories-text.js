
// -----------------------------
// STORIES TEXT FEATURE
// -----------------------------

function facontInitStoriesText() {
  const btnGenerate = document.getElementById('stories-generate-btn');
  const inputEl = document.getElementById('stories-text-input');
  const instructionBlock = document.getElementById('stories-instruction-block');
  const resultBlock = document.getElementById('stories-result-block');
  const resultText = document.getElementById('stories-result-text');
  const actionsBlock = document.getElementById('stories-actions');
  const btnSave = document.getElementById('stories-save-result');
  const linkNew = document.getElementById('stories-new-link');

  if (!btnGenerate) return;

  // Generate Handler
  btnGenerate.addEventListener('click', async () => {
    const text = (inputEl.value || '').trim();
    if (!text) {
      alert('Пожалуйста, введите текст.');
      return;
    }

    btnGenerate.disabled = true;
    btnGenerate.textContent = 'Генерирую...';
    
    try {
      // Call n8n webhook
      const res = await facontCallAPI('stories_text', { text });
      
      const content = res.result || res.text || res.generated_content || '';
      const id = res.id; // Capture ID if provided

      if (id && resultBlock) {
        resultBlock.dataset.id = id;
      }

      if (instructionBlock) {
        instructionBlock.style.display = 'none';
      }

      if (resultBlock) {
        resultBlock.style.display = 'block';
      }
      if (resultText) {
        resultText.value = content;
      }
      if (actionsBlock) {
        actionsBlock.style.display = 'flex';
      }

    } catch (e) {
      alert('Ошибка генерации: ' + e.message);
    } finally {
      btnGenerate.disabled = false;
      btnGenerate.textContent = 'Создать сторис';
    }
  });

  // Save Handler
  if (btnSave) {
    btnSave.addEventListener('click', async () => {
      const content = resultText.value;
      if (!content) return;

      // Get ID from dataset
      const id = resultBlock ? resultBlock.dataset.id : null;

      if (!id) {
        alert('Ошибка: ID записи не найден. Возможно, генерация не вернула ID.');
        return;
      }

      btnSave.disabled = true;
      btnSave.textContent = 'Сохранение...';

      try {
        await facontCallAPI('content-update', {
          id: id,
          generated_content: content
        });
        alert('Сохранено успешно!'); 
      } catch (e) {
        alert('Ошибка сохранения: ' + e.message);
      } finally {
        btnSave.disabled = false;
        btnSave.textContent = 'Сохранить';
      }
    });
  }

  // Navigation Handlers for Buttons
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
      // Reset form
      if (inputEl) inputEl.value = '';
      
      // Toggle visibility back
      if (resultBlock) {
        resultBlock.style.display = 'none';
        delete resultBlock.dataset.id; // Clear ID
      }
      if (instructionBlock) instructionBlock.style.display = 'block';
      
      if (resultText) resultText.value = '';
      window.scrollTo(0, 0);
    });
  }
}

// Export
window.facontInitStoriesText = facontInitStoriesText;