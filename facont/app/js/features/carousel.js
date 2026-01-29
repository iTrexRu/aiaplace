// -----------------------------
// CAROUSEL FEATURE
// -----------------------------

function facontInitCarousel() {
  
  // Elements
  const tabs = document.querySelectorAll('#carousel-main-card [data-tab]');
  const panes = document.querySelectorAll('#carousel-main-card .facont-tab-pane');
  const resultBlock = document.getElementById('carousel-result-block');
  
  // Modal Elements
  const modal = document.getElementById('carousel-confirm-modal');
  const btnConfirm = document.getElementById('btn-confirm-new');
  const btnCancel = document.getElementById('btn-cancel-new');

  let activeTab = 'text';
  let pendingTab = null;

  function switchTab(target) {
    activeTab = target;
    
    // Reset tabs style
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
  }

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
      // Clear result logic
      if (resultBlock) {
        resultBlock.style.display = 'none';
        // Clear textarea
        const resText = document.getElementById('carousel-result-text');
        if (resText) resText.value = '';
      }

      if (typeof window.facontClearTheme === 'function') {
        window.facontClearTheme();
      }
      
      // Clear inputs? Optional, but "New Post" usually implies fresh start.
      // Keeping input might be useful if they just want to try another format with same text.
      // User said: "if new - button clicked works. if continue - stay".
      // Usually "New" means discard current result.
      
      if (pendingTab) switchTab(pendingTab);
      if (modal) modal.style.display = 'none';
      pendingTab = null;
    });
  }

  if (btnCancel) {
    btnCancel.addEventListener('click', () => {
      if (modal) modal.style.display = 'none';
      pendingTab = null;
    });
  }

  // Info Toggle Logic
  const btnInfo = document.getElementById('carousel-toggle-info');
  const infoContent = document.getElementById('carousel-info-content');
  
  if (btnInfo && infoContent) {
    btnInfo.addEventListener('click', () => {
      const isHidden = infoContent.style.display === 'none';
      infoContent.style.display = isHidden ? 'block' : 'none';
    });
  }

  // Bind Standard Generator Logic
  if (typeof facontBindGeneratorScreen === 'function') {
    facontBindGeneratorScreen({
      generateBtnId: 'carousel-generate-btn',
      inputId: 'carousel-input-text',
      // instructionBlockId removed in new design
      resultBlockId: 'carousel-result-block',
      resultTextareaId: 'carousel-result-text',
      // actionsBlockId removed in new design
      saveBtnId: 'carousel-save-result',
      linkNewId: 'carousel-new-link',
      generateErrorId: 'carousel-error',
      saveErrorId: 'carousel-save-error',

      cmdGenerate: 'gen_carousel',
      generateBtnLoadingText: 'Создаю...',
      generateBtnText: 'Создать карусель',
      saveBtnLoadingText: 'Сохранение...',
      saveBtnText: 'Сохранить',
    });
  }
}

window.facontInitCarousel = facontInitCarousel;
