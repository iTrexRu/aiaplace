// -----------------------------
// AUTH MODULE (extracted from facont.js)
// -----------------------------

// === Show Auth Screen ===
async function facontShowAuth(type = "login") {
  const main = document.getElementById("facont-root");
  if (!main) return;

  let file = "login.html";
  if (type === "register") file = "register.html";
  if (type === "forgot") file = "forgot-password.html";

  main.innerHTML = "Загрузка...";
  const html = await facontLoadPartialStr(file);
  main.innerHTML = html;

  if (type === "login") facontInitLogin();
  if (type === "register") facontInitRegister();
  if (type === "forgot") facontInitForgot();
}

// === Login Logic ===
function facontInitLogin() {
  const form = document.getElementById("facont-login-form");
  if (!form) return;

  // Auto-fill email if registered just now
  if (window.facontLastRegisteredEmail) {
    if (form.email && !form.email.value) {
      form.email.value = window.facontLastRegisteredEmail;
    }
    // Clear it so it doesn't persist forever in session
    window.facontLastRegisteredEmail = null;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value;
    const errEl = document.getElementById("facont-login-error");
    const btn = form.querySelector("button");

    if (!email || !password) return;

    btn.disabled = true;
    if (errEl) errEl.textContent = "";

    try {
      const res = await facontCallAPI("auth_login", { email, password });
      if (res.ok) {
        if (res.sessionId) {
          localStorage.setItem("facont_session", res.sessionId);
        }
        window.location.reload();
      } else {
        throw new Error(res.message || "Ошибка входа");
      }
    } catch (err) {
      if (errEl) errEl.textContent = err.message;
      btn.disabled = false;
    }
  });
}

// === Register Logic ===
function facontInitRegister() {
  const form = document.getElementById("facont-register-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirm = form.confirm.value;
    const errEl = document.getElementById("facont-reg-error");
    const btn = form.querySelector("button");
    
    // Блоки для переключения видимости
    const contentBlock = document.getElementById("facont-register-content");
    const successBlock = document.getElementById("facont-reg-success-block");

    if (password !== confirm) {
      if (errEl) errEl.textContent = "Пароли не совпадают";
      return;
    }

    btn.disabled = true;
    if (errEl) errEl.textContent = "";

    try {
      const res = await facontCallAPI("auth_register", { email, password });
      if (res.ok) {
        // Запоминаем email для автозаполнения логина
        window.facontLastRegisteredEmail = email;

        // Успех: скрываем форму, показываем блок успеха
        if (contentBlock) contentBlock.style.display = "none";
        if (successBlock) successBlock.style.display = "block";
        // Форму можно сбросить, но она всё равно скрыта
        form.reset();
      } else {
        throw new Error(res.message || "Ошибка регистрации");
      }
    } catch (err) {
      if (errEl) errEl.textContent = err.message;
      btn.disabled = false;
    }
  });
}

// === Forgot Password Logic ===
function facontInitForgot() {
  const form = document.getElementById("facont-forgot-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const statusEl = document.getElementById("facont-forgot-status");
    const btn = form.querySelector("button");

    btn.disabled = true;
    if (statusEl) {
      statusEl.textContent = "Отправка...";
      statusEl.style.display = "block";
      statusEl.classList.remove('facont-text-success', 'facont-text-danger');
    }

    try {
      await facontCallAPI("auth_forgot_password", { email });
      if (statusEl) {
        statusEl.textContent = "Если такой email существует, мы отправили ссылку.";
        statusEl.classList.remove('facont-text-danger');
        statusEl.classList.add('facont-text-success');
      }
    } catch (err) {
      if (statusEl) {
        statusEl.textContent = "Ошибка: " + err.message;
        statusEl.classList.remove('facont-text-success');
        statusEl.classList.add('facont-text-danger');
      }
    } finally {
      btn.disabled = false;
    }
  });
}

// === Verify Email Logic ===
function facontInitVerify() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const statusEl = document.getElementById('verify-status');
  const successEl = document.getElementById('verify-success');
  const errorEl = document.getElementById('verify-error');

  if (!token) {
    if (statusEl) statusEl.style.display = 'none';
    if (errorEl) {
      errorEl.textContent = 'Ошибка: Токен не найден.';
      errorEl.style.display = 'block';
    }
    return;
  }

  (async () => {
    try {
      const res = await facontCallAPI('auth_confirm_email', { token }, { skipAuth: true });
      if (statusEl) statusEl.style.display = 'none';
      if (res.ok) {
        if (successEl) successEl.style.display = 'block';
      } else {
        throw new Error(res.message || 'Неверный или истекший токен.');
      }
    } catch (e) {
      if (statusEl) statusEl.style.display = 'none';
      if (errorEl) {
        errorEl.textContent = 'Ошибка: ' + e.message;
        errorEl.style.display = 'block';
      }
    }
  })();
}

// === Reset Password Logic ===
function facontInitResetPassword() {
  const form = document.getElementById('facont-reset-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    const password = document.getElementById('reset-password').value;
    const confirm = document.getElementById('reset-confirm').value;
    const errorEl = document.getElementById('reset-error');
    const successEl = document.getElementById('reset-success');
    const btn = form.querySelector('button');

    if (!token) {
      if (errorEl) errorEl.textContent = 'Ошибка: Токен не найден в ссылке.';
      return;
    }

    if (password !== confirm) {
      if (errorEl) errorEl.textContent = 'Пароли не совпадают.';
      return;
    }

    btn.disabled = true;
    if (errorEl) errorEl.textContent = '';
    if (successEl) successEl.style.display = 'none';

    try {
      const res = await facontCallAPI('auth_reset_password', { token, password }, { skipAuth: true });
      if (res.ok) {
        if (successEl) successEl.style.display = 'block';
        form.reset();
      } else {
        throw new Error(res.message || 'Ошибка сброса пароля.');
      }
    } catch (err) {
      if (errorEl) errorEl.textContent = err.message;
    } finally {
      btn.disabled = false;
    }
  });
}

// === Export to global ===
window.facontShowAuth = facontShowAuth;
window.facontInitLogin = facontInitLogin;
window.facontInitRegister = facontInitRegister;
window.facontInitForgot = facontInitForgot;
window.facontInitVerify = facontInitVerify;
window.facontInitResetPassword = facontInitResetPassword;
