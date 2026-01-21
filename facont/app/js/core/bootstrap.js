// -----------------------------
// BOOTSTRAP MODULE (extracted from facont.js)
// -----------------------------

// === Render full application shell ===
function facontRenderApp() {
  const root = document.getElementById('facont-root');
  const template = document.getElementById('facont-app-template');
  if (!root || !template) return;

  root.innerHTML = '';
  root.appendChild(template.content.cloneNode(true));

  // Init Sidebar
  const sidebar = root.querySelector('.facont-sidebar');
  if (sidebar) {
    sidebar.addEventListener('click', (e) => {
      const item = e.target.closest('.facont-menu-item');
      if (!item) return;

      const action = item.dataset.action;
      if (action === 'logout') {
        facontLogout();
        return;
      }

      const view = item.dataset.view;
      if (view) facontShowView(view);
    });
  }

  // Enable browser Back/Forward for internal views
  window.addEventListener('popstate', (event) => {
    const state = event && event.state ? event.state : null;

    const routeFromState = state && state.view ? state : null;
    const routeFromUrl = (typeof facontGetRouteFromLocation === 'function')
      ? facontGetRouteFromLocation()
      : { view: '', id: '' };

    const view = (routeFromState && routeFromState.view) ? routeFromState.view : routeFromUrl.view;
    const id = (routeFromState && routeFromState.id) ? routeFromState.id : routeFromUrl.id;

    // If no internal route -> go to default
    if (!view) {
      facontShowView('home', { replace: true, fromPopstate: true });
      return;
    }

    facontShowView(view, { id, fromPopstate: true });
  });

  // Initial view: from URL if present, otherwise default
  const initial = (typeof facontGetRouteFromLocation === 'function')
    ? facontGetRouteFromLocation()
    : { view: '', id: '' };

  if (initial && initial.view) {
    facontShowView(initial.view, { id: initial.id, replace: true });
  } else {
    facontShowView('home', { replace: true });
  }
}

// === Auth Init ===
async function facontInitAuth() {
  try {
    const res = await facontCallAPI('auth_me');
    if (res && res.authenticated) {
      CURRENT_USER = res.user;
      facontRenderApp();
    } else {
      facontShowAuth('login');
    }
  } catch (e) {
    console.error('Auth check failed', e);
    facontShowAuth('login');
  }
}

// === Logout ===
async function facontLogout() {
  try {
    await facontCallAPI('auth_logout');
  } catch (e) {
    console.error(e);
  }
  localStorage.removeItem('facont_session');
  window.location.reload();
}

// === Bootstrap Entry Point ===
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view');

  if (view === 'verify' || view === 'reset_password') {
    const root = document.getElementById('facont-root');
    let file = '';
    if (view === 'verify') file = 'verify.html';
    if (view === 'reset_password') file = 'reset-password.html';

    if (root && file) {
      root.innerHTML = 'Загрузка...';
      facontLoadPartialStr(file).then(html => {
        root.innerHTML = html;
        if (view === 'verify') facontInitVerify();
        if (view === 'reset_password') facontInitResetPassword();
      });
    }
    return;
  }

  facontInitAuth();
});

// === Export to global ===
window.facontRenderApp = facontRenderApp;
window.facontInitAuth = facontInitAuth;
window.facontLogout = facontLogout;
