// -----------------------------
// IDEA POST FEATURE 
// -----------------------------

function facontInitIdeaPost() {
  
  // Elements
  const tabs = document.querySelectorAll('#idea-main-card [data-tab]');
  const panes = document.querySelectorAll('#idea-main-card .facont-tab-pane');
  const submitBtnContainer = document.querySelector('#idea-submit-btn').parentElement;
  const resultBlock = document.getElementById('idea-result-block');
  
  // Modal Elements
  const modal = document.getElementById('idea-confirm-modal');
  const btnConfirm = document.getElementById('btn-confirm-new');
  const btnCancel = document.getElementById('btn-cancel-new');
  
  let activeTab = 'text';
  let pendingTab = null;

  function switchTab(target) {
    activeTab = target;
    
    // Reset styles
    tabs.forEach(t => {
      t.classList.add('secondary');
      if (t.dataset.tab === target) {
        t.classList.remove('secondary');
      }
    });
    
    // Show pane
    panes.forEach(p => p.style.display = 'none');
    const activePane = document.getElementById('tab-content-' + target);
    if (activePane) activePane.style.display = 'block';
    
    // Hide submit button for Voice (since it uses Telegram link)
    if (target === 'voice') {
      submitBtnContainer.style.display = 'none';
    } else {
      submitBtnContainer.style.display = 'block';
    }
  }

  // Tabs Logic
  if (tabs.length > 0) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        if (target === activeTab) return;
        
        // Check if result is visible (content generated)
        if (resultBlock && resultBlock.style.display !== 'none') {
          pendingTab = target;
          if (modal) modal.style.display = 'flex';
        } else {
          switchTab(target);
        }
      });
    });
  }
  
  // Modal Handlers
  if (btnConfirm) {
    btnConfirm.addEventListener('click', () => {
      // Clear result
      resetForm();
      if (modal) modal.style.display = 'none';
      
      // Switch tab
      if (pendingTab) switchTab(pendingTab);
      pendingTab = null;
    });
  }
  
  if (btnCancel) {
    btnCancel.addEventListener('click', () => {
      if (modal) modal.style.display = 'none';
      pendingTab = null;
    });
  }

  // Info Toggle
  const btnInfo = document.getElementById('idea-toggle-info');
  const infoContent = document.getElementById('idea-info-content');
  if (btnInfo && infoContent) {
    btnInfo.addEventListener('click', () => {
      const isHidden = infoContent.style.display === 'none';
      infoContent.style.display = isHidden ? 'block' : 'none';
    });
  }

  // File Input Handler
  const fileInput = document.getElementById('idea-image-input');
  if (fileInput) {
    fileInput.addEventListener('change', () => {
      const filenameEl = document.getElementById('idea-filename');
      if (filenameEl) {
        if (fileInput.files && fileInput.files[0]) {
          filenameEl.textContent = 'Выбран файл: ' + fileInput.files[0].name;
        } else {
          filenameEl.textContent = '';
        }
      }
    });
  }

  // Submit Handler
  const btnSubmit = document.getElementById('idea-submit-btn');
  if (btnSubmit) {
    btnSubmit.addEventListener('click', async () => {
      if (activeTab === 'text') {
        await submitText();
      } else if (activeTab === 'image') {
        await submitImage();
      }
    });
  }

  // Save Result Handler
  const btnSave = document.getElementById('btn-save-idea-result');
  if (btnSave) {
    btnSave.addEventListener('click', saveResult);
  }

  // New Post Handler
  const btnNew = document.getElementById('btn-new-post');
  if (btnNew) {
    btnNew.addEventListener('click', resetForm);
  }
}

async function submitText() {
  const input = document.getElementById('idea-text-input');
  const text = input ? input.value.trim() : '';
  
  if (!text) {
    alert('Введите текст идеи');
    return;
  }

  setBusy(true);
  setError('');

  try {
    const res = await facontCallAPI('post-from-text', { text });
    showResult(res);
  } catch (e) {
    setError('Ошибка: ' + e.message);
  } finally {
    setBusy(false);
  }
}

async function submitImage() {
  const input = document.getElementById('idea-image-input');
  if (!input || !input.files || !input.files[0]) {
    alert('Выберите файл');
    return;
  }

  const file = input.files[0];
  setBusy(true);
  setError('');

  const reader = new FileReader();
  reader.onload = async function(e) {
    const base64Data = e.target.result;
    try {
      const res = await facontCallAPI('post-from-img', {
        image: base64Data,
        filename: file.name
      });
      showResult(res);
    } catch (err) {
      setError('Ошибка отправки: ' + err.message);
    } finally {
      setBusy(false);
    }
  };
  reader.readAsDataURL(file);
}

function showResult(res) {
  const resultBlock = document.getElementById('idea-result-block');
  const resultText = document.getElementById('idea-result-text');
  const mainCard = document.getElementById('idea-main-card');
  
  const text = res.text || res.result || res.content || JSON.stringify(res);
  
  if (resultText) resultText.value = text;
  if (resultBlock) {
    resultBlock.style.display = 'block';
    if (res.id) resultBlock.dataset.id = res.id;
    // Scroll to result
    resultBlock.scrollIntoView({ behavior: 'smooth' });
  }
  // Optional: hide main card? User usually wants to see input too.
}

async function saveResult() {
  const resultBlock = document.getElementById('idea-result-block');
  const resultText = document.getElementById('idea-result-text');
  const status = document.getElementById('idea-save-status');
  const btn = document.getElementById('btn-save-idea-result');
  
  const contentId = resultBlock ? resultBlock.dataset.id : null;
  const text = resultText ? resultText.value : '';

  if (!contentId || !text) return;

  btn.disabled = true;
  if (status) status.textContent = 'Сохранение...';

  try {
    await facontCallAPI('content-update', {
      id: contentId,
      generated_content: text
    });
    if (status) {
      status.textContent = 'Сохранено!';
      status.style.color = 'var(--facont-success)';
    }
  } catch (e) {
    if (status) {
      status.textContent = 'Ошибка: ' + e.message;
      status.style.color = 'var(--facont-danger)';
    }
  } finally {
    btn.disabled = false;
  }
}

function resetForm() {
  const resultBlock = document.getElementById('idea-result-block');
  const mainCard = document.getElementById('idea-main-card');
  const textInput = document.getElementById('idea-text-input');
  const imageInput = document.getElementById('idea-image-input');
  const fileLabel = document.getElementById('idea-filename');
  const status = document.getElementById('idea-save-status');
  
  if (resultBlock) {
    resultBlock.style.display = 'none';
    delete resultBlock.dataset.id;
  }
  
  if (mainCard) mainCard.style.display = 'block';
  if (textInput) textInput.value = '';
  if (imageInput) imageInput.value = '';
  if (fileLabel) fileLabel.textContent = '';
  if (status) status.textContent = '';
  
  setError('');
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setBusy(isBusy) {
  const s = document.getElementById('idea-busy');
  const btn = document.getElementById('idea-submit-btn');
  if (s) s.style.display = isBusy ? 'inline-block' : 'none';
  if (btn) btn.disabled = isBusy;
}

function setError(msg) {
  const el = document.getElementById('idea-error');
  if (el) {
    el.style.display = msg ? 'block' : 'none';
    el.textContent = msg;
  }
}

window.facontInitIdeaPost = facontInitIdeaPost;
