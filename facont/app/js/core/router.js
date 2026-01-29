// -----------------------------
// ROUTER MODULE (extracted from facont.js)
// -----------------------------

function facontGetRouteFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view') || '';
  const id = params.get('id') || '';
  return { view, id };
}

function facontBuildUrlForRoute(route) {
  const url = new URL(window.location.href);
  const params = url.searchParams;

  if (route && route.view) {
    params.set('view', route.view);
  } else {
    params.delete('view');
  }

  // ID актуален только для content_review
  if (route && route.view === 'content_review' && route.id) {
    params.set('id', route.id);
  } else {
    params.delete('id');
  }

  url.search = params.toString();
  return url.toString();
}

function facontSyncHistory(route, options = {}) {
  const { replace = false, fromPopstate = false } = options || {};
  if (fromPopstate) return;

  const url = facontBuildUrlForRoute(route);
  const state = { ...(route || {}) };

  if (replace) {
    history.replaceState(state, '', url);
  } else {
    history.pushState(state, '', url);
  }
}

// Основная функция отображения экранов
async function facontShowView(view, options = {}) {
  const opts = options || {};

  // Safety: content_review без id -> отправляем на список
  if (view === 'content_review' && !opts.id) {
    view = 'content_list';
  }

  facontSyncHistory({ view, id: opts.id }, opts);

  const sidebar = document.querySelector('.facont-sidebar');
  if (sidebar) {
    sidebar.querySelectorAll('.facont-menu-item')
      .forEach(item => item.classList.toggle('active', item.dataset.view === view));
  }

  // ==========================
  // РОУТЫ ОНБОРДИНГА
  // ==========================

  if (view === 'home') {
    const main = await facontLoadPartial('home.html');
    if (main && typeof facontInitHome === 'function') facontInitHome();
    if (typeof facontUpdateThemeBar === 'function') facontUpdateThemeBar(view);
    return;
  }

  if (view === 'onboarding_overview') {
    const main = await facontLoadPartial('onboarding-overview.html');
    if (main) facontInitOnboardingOverview();
    if (typeof facontUpdateThemeBar === 'function') facontUpdateThemeBar(view);
    return;
  }

  if (view === 'onboarding_identity') {
    const main = await facontLoadPartial('onboarding-identity.html');
    if (main) facontInitOnboardingIdentity();
    if (typeof facontUpdateThemeBar === 'function') facontUpdateThemeBar(view);
    return;
  }

  if (view === 'onboarding_product') {
    const main = await facontLoadPartial('onboarding-product.html');
    if (main) facontInitOnboardingProduct();
    if (typeof facontUpdateThemeBar === 'function') facontUpdateThemeBar(view);
    return;
  }

  if (view === 'onboarding_audience') {
    const main = await facontLoadPartial('onboarding-audience.html');
    if (main) facontInitOnboardingAudience();
    if (typeof facontUpdateThemeBar === 'function') facontUpdateThemeBar(view);
    return;
  }

  if (view === 'onboarding_style') {
    const main = await facontLoadPartial('onboarding-style.html');
    if (main) facontInitOnboardingStyle();
    if (typeof facontUpdateThemeBar === 'function') facontUpdateThemeBar(view);
    return;
  }

  // ==========================
  // ПОЛЬЗОВАТЕЛЬСКИЕ ЭКРАНЫ
  // ==========================

  if (view === 'settings') {
    const main = await facontLoadPartial('settings.html');
    if (main) facontInitSettings();
    if (typeof facontUpdateThemeBar === 'function') facontUpdateThemeBar(view);
    return;
  }

  if (view === 'profile') {
    const main = await facontLoadPartial('profile.html');
    if (main) facontInitProfile();
    if (typeof facontUpdateThemeBar === 'function') facontUpdateThemeBar(view);
    return;
  }

  // ==========================
  // КОНТЕНТНЫЕ ЭКРАНЫ
  // ==========================

  if (view === 'idea_post') {
    await facontLoadPartial('idea-post.html');
    if (typeof facontInitIdeaPost === 'function') facontInitIdeaPost();
    if (typeof facontUpdateThemeBar === 'function') facontUpdateThemeBar(view);
    return;
  }

  if (view === 'content_list') {
    const main = await facontLoadPartial('content-list.html');
    if (main) facontInitContentList();
    if (typeof facontUpdateThemeBar === 'function') facontUpdateThemeBar(view);
    return;
  }

  if (view === 'content_review') {
    const main = await facontLoadPartial('content-review.html');
    if (main) facontInitContentReview(opts.id);
    if (typeof facontUpdateThemeBar === 'function') facontUpdateThemeBar(view);
    return;
  }

  // ==========================
  // ПУБЛИЧНЫЕ ЭКРАНЫ
  // ==========================

  if (view === 'verify') {
    const main = await facontLoadPartial('verify.html');
    if (main) facontInitVerify();
    if (typeof facontUpdateThemeBar === 'function') facontUpdateThemeBar(view);
    return;
  }

  if (view === 'reset_password') {
    const main = await facontLoadPartial('reset-password.html');
    if (main) facontInitResetPassword();
    if (typeof facontUpdateThemeBar === 'function') facontUpdateThemeBar(view);
    return;
  }

  // ==========================
  // НОВЫЕ ЭКРАНЫ
  // ==========================

  if (view === 'stories_text') {
    const main = await facontLoadPartial('stories-text.html');
    if (typeof facontInitStoriesText === 'function') facontInitStoriesText();
    if (typeof facontUpdateThemeBar === 'function') facontUpdateThemeBar(view);
    return;
  }

  if (view === 'titles') {
    const main = await facontLoadPartial('titles.html');
    if (typeof facontInitTitles === 'function') facontInitTitles();
    if (typeof facontUpdateThemeBar === 'function') facontUpdateThemeBar(view);
    return;
  }

  if (view === 'carousel') {
    const main = await facontLoadPartial('carousel.html');
    if (typeof facontInitCarousel === 'function') facontInitCarousel();
    if (typeof facontUpdateThemeBar === 'function') facontUpdateThemeBar(view);
    return;
  }

  if (view === 'reels') {
    const main = await facontLoadPartial('reels.html');
    if (typeof facontInitReels === 'function') facontInitReels();
    if (typeof facontUpdateThemeBar === 'function') facontUpdateThemeBar(view);
    return;
  }

  if (view === 'my_prompt') {
    const main = await facontLoadPartial('my-prompt.html');
    if (typeof facontInitMyPrompt === 'function') facontInitMyPrompt();
    if (typeof facontUpdateThemeBar === 'function') facontUpdateThemeBar(view);
    return;
  }

  if (view === 'my_prompt_manage') {
    const main = await facontLoadPartial('my-prompt-manage.html');
    if (typeof facontInitMyPromptManage === 'function') facontInitMyPromptManage();
    if (typeof facontUpdateThemeBar === 'function') facontUpdateThemeBar(view);
    return;
  }

  // Unknown view -> 404 placeholder
  await facontLoadPartial('404.html');
  if (typeof facontUpdateThemeBar === 'function') facontUpdateThemeBar(view);
}

// Отдельный просмотр элемента
async function facontShowReview(contentId, options = {}) {
  // Делегируем в facontShowView, чтобы URL/History синхронизировались в одном месте
  return facontShowView('content_review', { ...(options || {}), id: contentId });
}

// Экспорт в глобальную область
window.facontGetRouteFromLocation = facontGetRouteFromLocation;
window.facontShowView = facontShowView;
window.facontShowReview = facontShowReview;
