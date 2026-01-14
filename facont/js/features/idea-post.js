// -----------------------------
// IDEA POST FEATURE
// -----------------------------

let currentIdeaTab = 'text';
let pendingIdeaTab = null;

function facontInitIdeaPost() {
  // Инициализация (по умолчанию открываем текст)
  facontIdeaPostSwitchTab('text');

  // Обработка кнопки "Сохранить в базу"
  const saveBtn = document.getElementById('btn-save-idea-result');
  if (saveBtn) {
    const newBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newBtn, saveBtn);
    
    newBtn.addEventListener('click', async () => {
      const text = document.getElementById('idea-result-text').value;
      if (!text) return;

      const spinner = document.getElementById('idea-save-busy');
      const status = document.getElementById('idea-save-status');

      newBtn.disabled = true;
      if (spinner) spinner.style.display = 'inline-block';
      if (status) status.textContent = '';

      try {
        await facontCallAPI('save_content', {
          type: 'post',
          content: text,
          source: 'idea_post' 
        });
        if (status) {
          status.textContent = 'Сохранено!';
          status.className = 'facont-status facont-text-success';
        }
      } catch (e) {
        if (status) {
          status.textContent = 'Ошибка: ' + e.message;
          status.className = 'facont-status facont-text-danger';
        }
      } finally {
        newBtn.disabled = false;
        if (spinner) spinner.style.display = 'none';
      }
    });
  }

  // Обработчики модалки подтверждения
  const confirmBtn = document.getElementById('btn-confirm-new');
  if (confirmBtn) {
    confirmBtn.onclick = facontIdeaConfirmNew;
  }
  const cancelBtn = document.getElementById('btn-cancel-new');
  if (cancelBtn) {
    cancelBtn.onclick = facontIdeaCancelNew;
  }
}

// Очистка формы
function clearIdeaResult() {
  // Скрыть результат
  const block = document.getElementById('idea-result-block');
  if (block) block.style.display = 'none';
  
  // Очистить поля ввода
  const textInput = document.getElementById('idea-text-input');
  if (textInput) textInput.value = '';
  
  const imageInput = document.getElementById('idea-image-input');
  if (imageInput) imageInput.value = '';
  
  const filenameEl = document.getElementById('idea-image-filename');
  if (filenameEl) filenameEl.textContent = 'Файл не выбран';

  const resultText = document.getElementById('idea-result-text');
  if (resultText) resultText.value = '';

  const saveStatus = document.getElementById('idea-save-status');
  if (saveStatus) saveStatus.textContent = '';
  
  const errorEl = document.getElementById('idea-error');
  if (errorEl) {
    errorEl.style.display = 'none';
    errorEl.textContent = '';
  }
}

// Логика переключения табов
function facontIdeaPostSwitchTab(tabName) {
  // Если нажали на уже активный таб - ничего не делаем
  if (tabName === currentIdeaTab) return;

  // Проверяем, есть ли результат
  const resultBlock = document.getElementById('idea-result-block');
  if (resultBlock && resultBlock.style.display !== 'none') {
    // Показываем подтверждение
    pendingIdeaTab = tabName;
    const modal = document.getElementById('idea-confirm-modal');
    if (modal) modal.style.display = 'flex';
    return;
  }

  performTabSwitch(tabName);
}

function performTabSwitch(tabName) {
  currentIdeaTab = tabName;

  // Скрываем все
  const tText = document.getElementById('tab-content-text');
  const tImage = document.getElementById('tab-content-image');
  const tVoice = document.getElementById('tab-content-voice');
  
  if (tText) tText.style.display = 'none';
  if (tImage) tImage.style.display = 'none';
  if (tVoice) tVoice.style.display = 'none';

  // Сбрасываем активный класс кнопок
  const btnText = document.getElementById('tab-btn-text');
  const btnImage = document.getElementById('tab-btn-image');
  const btnVoice = document.getElementById('tab-btn-voice');

  if (btnText) {
    btnText.classList.add('secondary');
    btnText.classList.remove('active');
  }
  if (btnImage) {
    btnImage.classList.add('secondary');
    btnImage.classList.remove('active');
  }
  if (btnVoice) {
    btnVoice.classList.add('secondary');
    btnVoice.classList.remove('active');
  }

  // Показываем нужный
  const targetContent = document.getElementById('tab-content-' + tabName);
  if (targetContent) targetContent.style.display = 'block';
  
  // Активируем кнопку
  const activeBtn = document.getElementById('tab-btn-' + tabName);
  if (activeBtn) {
    activeBtn.classList.remove('secondary');
    // activeBtn.classList.add('active'); 
  }
}

// Подтверждение смены таба (новый пост)
function facontIdeaConfirmNew() {
  const modal = document.getElementById('idea-confirm-modal');
  if (modal) modal.style.display = 'none';
  
  clearIdeaResult();
  if (pendingIdeaTab) {
    performTabSwitch(pendingIdeaTab);
    pendingIdeaTab = null;
  }
}

// Отмена смены таба
function facontIdeaCancelNew() {
  const modal = document.getElementById('idea-confirm-modal');
  if (modal) modal.style.display = 'none';
  pendingIdeaTab = null;
}

// Утилиты для UI
function setIdeaBusy(isBusy) {
  const s = document.getElementById('idea-busy');
  if (s) s.style.display = isBusy ? 'inline-block' : 'none';
}

function setIdeaError(msg) {
  const el = document.getElementById('idea-error');
  if (!el) return;
  if (!msg) {
    el.style.display = 'none';
    el.textContent = '';
  } else {
    el.style.display = 'block';
    el.textContent = msg;
  }
}

function showIdeaResult(text) {
  const block = document.getElementById('idea-result-block');
  const area = document.getElementById('idea-result-text');
  const actions = document.getElementById('idea-actions');
  
  if (block) block.style.display = 'block';
  if (area) area.value = text;
  if (actions) actions.style.display = 'flex';
  
  // Скролл к результату
  if (block) block.scrollIntoView({ behavior: 'smooth' });
}

// Логика отправки ТЕКСТА
async function facontIdeaPostSubmitText() {
  const input = document.getElementById('idea-text-input');
  if (!input) return;
  
  const text = input.value.trim();
  if (!text) {
    alert('Введите текст идеи');
    return;
  }

  setIdeaBusy(true);
  setIdeaError('');

  try {
    const res = await facontCallAPI('post-from-text', {
      text: text
    });

    const resultText = res.text || res.result || res.content || JSON.stringify(res);
    showIdeaResult(resultText);

  } catch (e) {
    setIdeaError('Ошибка: ' + e.message);
  } finally {
    setIdeaBusy(false);
  }
}

// Обработчик выбора файла (обновляет текст)
function facontIdeaPostFileChanged(input) {
  const filenameEl = document.getElementById('idea-image-filename');
  if (filenameEl) {
    if (input.files && input.files[0]) {
      filenameEl.textContent = input.files[0].name;
    } else {
      filenameEl.textContent = 'Файл не выбран';
    }
  }
}

// Логика отправки КАРТИНКИ
async function facontIdeaPostSubmitImage() {
  const input = document.getElementById('idea-image-input');
  if (!input || !input.files || !input.files[0]) {
    alert('Выберите файл');
    return;
  }

  const file = input.files[0];
  
  setIdeaBusy(true);
  setIdeaError('');

  // Читаем файл в base64
  const reader = new FileReader();
  reader.onload = async function(e) {
    const base64Data = e.target.result;

    try {
      const res = await facontCallAPI('post-from-img', {
        image: base64Data,
        filename: file.name
      });

      const resultText = res.text || res.result || res.content || JSON.stringify(res);
      showIdeaResult(resultText);

    } catch (err) {
      setIdeaError('Ошибка отправки: ' + err.message);
    } finally {
      setIdeaBusy(false);
    }
  };
  reader.onerror = function() {
    setIdeaError('Ошибка чтения файла');
    setIdeaBusy(false);
  };
  reader.readAsDataURL(file);
}

// Экспорт глобально
window.facontInitIdeaPost = facontInitIdeaPost;
window.facontIdeaPostSwitchTab = facontIdeaPostSwitchTab;
window.facontIdeaPostSubmitText = facontIdeaPostSubmitText;
window.facontIdeaPostSubmitImage = facontIdeaPostSubmitImage;
window.facontIdeaPostFileChanged = facontIdeaPostFileChanged;
