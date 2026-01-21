// -----------------------------
// REELS FEATURE
// -----------------------------

function facontInitReels() {
  if (typeof facontBindGeneratorScreen !== 'function') return;

  facontBindGeneratorScreen({
    generateBtnId: 'reels-generate-btn',
    inputId: 'reels-text-input',
    instructionBlockId: 'reels-instruction-block',
    resultBlockId: 'reels-result-block',
    resultTextareaId: 'reels-result-text',
    actionsBlockId: 'reels-actions',
    saveBtnId: 'reels-save-result',
    linkNewId: 'reels-new-link',
    generateErrorId: 'reels-error',
    saveErrorId: 'reels-save-error',

    cmdGenerate: 'gen_reels',
    generateBtnLoadingText: 'Генерирую...',
    generateBtnText: 'Сгенерировать стратегию',
    saveBtnLoadingText: 'Сохранение...',
    saveBtnText: 'Сохранить',
  });
}

window.facontInitReels = facontInitReels;
