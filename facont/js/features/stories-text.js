// -----------------------------
// STORIES TEXT FEATURE
// -----------------------------

function facontInitStoriesText() {
  // Reuse generic screen binder to align behaviour with new pages
  if (typeof facontBindGeneratorScreen !== 'function') return;

  facontBindGeneratorScreen({
    generateBtnId: 'stories-generate-btn',
    inputId: 'stories-text-input',
    instructionBlockId: 'stories-instruction-block',
    resultBlockId: 'stories-result-block',
    resultTextareaId: 'stories-result-text',
    actionsBlockId: 'stories-actions',
    saveBtnId: 'stories-save-result',
    linkNewId: 'stories-new-link',
    generateErrorId: 'stories-error',
    saveErrorId: 'stories-save-error',

    cmdGenerate: 'stories_text',
    generateBtnLoadingText: 'Генерирую...',
    generateBtnText: 'Создать сторис',
    saveBtnLoadingText: 'Сохранение...',
    saveBtnText: 'Сохранить',
  });
}

// Export
window.facontInitStoriesText = facontInitStoriesText;
