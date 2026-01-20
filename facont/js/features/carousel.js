// -----------------------------
// CAROUSEL FEATURE
// -----------------------------

function facontInitCarousel() {
  
  // Tabs Logic
  const tabs = document.querySelectorAll('#carousel-main-card [data-tab]');
  const panes = document.querySelectorAll('#carousel-main-card .facont-tab-pane');
  
  if (tabs.length > 0) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        
        // Reset all tabs to secondary
        tabs.forEach(t => {
          t.classList.add('secondary');
        });
        // Set active tab to primary
        tab.classList.remove('secondary');
        
        // Show target pane
        panes.forEach(p => p.style.display = 'none');
        const activePane = document.getElementById('tab-content-' + target);
        if (activePane) activePane.style.display = 'block';
      });
    });
  }

  // Info Toggle Logic
  const btnInfo = document.getElementById('carousel-toggle-info');
  const infoContent = document.getElementById('carousel-info-content');
  
  if (btnInfo && infoContent) {
    btnInfo.addEventListener('click', () => {
      const isHidden = infoContent.style.display === 'none';
      infoContent.style.display = isHidden ? 'block' : 'none';
      // Optional: arrow rotation logic could go here
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
