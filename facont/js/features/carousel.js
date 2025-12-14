// -----------------------------
// CAROUSEL FEATURE
// -----------------------------

function facontInitCarousel() {
  if (typeof facontBindGeneratorScreen !== 'function') return;

  facontBindGeneratorScreen({
    generateBtnId: 'carousel-generate-btn',
    inputId: 'carousel-text-input',
    instructionBlockId: 'carousel-instruction-block',
    resultBlockId: 'carousel-result-block',
    resultTextareaId: 'carousel-result-text',
    actionsBlockId: 'carousel-actions',
    saveBtnId: 'carousel-save-result',
    linkNewId: 'carousel-new-link',
    generateErrorId: 'carousel-error',
    saveErrorId: 'carousel-save-error',

    cmdGenerate: 'gen_carousel',
    generateBtnLoadingText: 'Генерирую...',
    generateBtnText: 'Сгенерировать карусель',
    saveBtnLoadingText: 'Сохранение...',
    saveBtnText: 'Сохранить',
  });
}

window.facontInitCarousel = facontInitCarousel;
