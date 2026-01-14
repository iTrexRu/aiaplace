// -----------------------------
// IDEA POST FEATURE
// -----------------------------

function facontInitIdeaPost() {
  // Инициализация (по умолчанию открываем текст)
  facontIdeaPostSwitchTab('text');

  // Обработка кнопки "Сохранить в базу"
  const saveBtn = document.getElementById('btn-save-idea-result');
  if (saveBtn) {
    // Удаляем старые слушатели, чтобы не дублировать при повторном входе
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
}

// Логика переключения табов
function facontIdeaPostSwitchTab(tabName) {
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
      inputText: text
    });

    const resultText = res.text || res.result || res.content || JSON.stringify(res);
    showIdeaResult(resultText);

  } catch (e) {
    setIdeaError('Ошибка: ' + e.message);
  } finally {
    setIdeaBusy(false);
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
