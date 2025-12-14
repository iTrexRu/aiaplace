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

  // Load default view
  facontShowView('onboarding_overview');
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