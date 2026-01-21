// -----------------------------
// TITLES FEATURE
// -----------------------------

function facontInitTitles() {
  if (typeof facontBindGeneratorScreen !== 'function') return;

  facontBindGeneratorScreen({
    generateBtnId: 'titles-generate-btn',
    inputId: 'titles-text-input',
    instructionBlockId: 'titles-instruction-block',
    resultBlockId: 'titles-result-block',
    resultTextareaId: 'titles-result-text',
    actionsBlockId: 'titles-actions',
    saveBtnId: 'titles-save-result',
    linkNewId: 'titles-new-link',
    generateErrorId: 'titles-error',
    saveErrorId: 'titles-save-error',

    cmdGenerate: 'gen_titles',
    generateBtnLoadingText: 'Генерирую...',
    generateBtnText: 'Сгенерировать заголовки',
    saveBtnLoadingText: 'Сохранение...',
    saveBtnText: 'Сохранить',
  });
}

window.facontInitTitles = facontInitTitles;
