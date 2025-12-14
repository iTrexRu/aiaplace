// -----------------------------
// ROUTER MODULE (extracted from facont.js)
// -----------------------------

// Основная функция отображения экранов
async function facontShowView(view) {
  const sidebar = document.querySelector('.facont-sidebar');
  if (sidebar) {
    sidebar.querySelectorAll('.facont-menu-item')
      .forEach(item => item.classList.toggle('active', item.dataset.view === view));
  }

  // ==========================
  // РОУТЫ ОНБОРДИНГА
  // ==========================

  if (view === 'onboarding_overview') {
    const main = await facontLoadPartial('onboarding-overview.html');
    if (main) facontInitOnboardingOverview();
    return;
  }

  if (view === 'onboarding_identity') {
    const main = await facontLoadPartial('onboarding-identity.html');
    if (main) facontInitOnboardingIdentity();
    return;
  }

  if (view === 'onboarding_product') {
    const main = await facontLoadPartial('onboarding-product.html');
    if (main) facontInitOnboardingProduct();
    return;
  }

  if (view === 'onboarding_audience') {
    const main = await facontLoadPartial('onboarding-audience.html');
    if (main) facontInitOnboardingAudience();
    return;
  }

  if (view === 'onboarding_style') {
    const main = await facontLoadPartial('onboarding-style.html');
    if (main) facontInitOnboardingStyle();
    return;
  }

  // ==========================
  // ПОЛЬЗОВАТЕЛЬСКИЕ ЭКРАНЫ
  // ==========================

  if (view === 'settings') {
    const main = await facontLoadPartial('settings.html');
    if (main) facontInitSettings();
    return;
  }

  if (view === 'profile') {
    const main = await facontLoadPartial('profile.html');
    if (main) facontInitProfile();
    return;
  }

  // ==========================
  // КОНТЕНТНЫЕ ЭКРАНЫ
  // ==========================

  if (view === 'voice_post') {
    await facontLoadPartial('voice-post.html');
    return;
  }

  if (view === 'content_list') {
    const main = await facontLoadPartial('content-list.html');
    if (main) facontInitContentList();
    return;
  }

  if (view === 'content_review') {
    const main = await facontLoadPartial('content-review.html');
    if (main) facontInitContentReview();
    return;
  }

  // ==========================
  // ПУБЛИЧНЫЕ ЭКРАНЫ
  // ==========================

  if (view === 'verify') {
    const main = await facontLoadPartial('verify.html');
    if (main) facontInitVerify();
    return;
  }

  if (view === 'reset_password') {
    const main = await facontLoadPartial('reset-password.html');
    if (main) facontInitResetPassword();
    return;
  }

  // ==========================
  // НОВЫЕ ЭКРАНЫ
  // ==========================

  if (view === 'stories_text') {
    const main = await facontLoadPartial('stories-text.html');
    if (typeof facontInitStoriesText === 'function') facontInitStoriesText();
    return;
  }

  if (view === 'carousel') {
    await facontLoadPartial('carousel.html');
    return;
  }

  if (view === 'reels') {
    await facontLoadPartial('reels.html');
    return;
  }

  if (view === 'nlp') {
    await facontLoadPartial('nlp.html');
    return;
  }
}

// Отдельный просмотр элемента
async function facontShowReview(contentId) {
  const main = await facontLoadPartial('content-review.html');
  if (main) facontInitContentReview(contentId);
}

// Экспорт в глобальную область
window.facontShowView = facontShowView;
window.facontShowReview = facontShowReview;