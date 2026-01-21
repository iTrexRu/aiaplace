const FACONT_API_URL = "https://itrex-auto-prod.up.railway.app/webhook/d3499289-9710-47bc-bd72-8aa9ccbd1426";
const FACONT_BASE_URL = (window.FACONT_BASE_URL || "").replace(/\/$/, "");

// -----------------------------
// API utilities (extracted from facont.js)
// -----------------------------

// Вызов n8n backend
async function facontCallAPI(cmd, data = {}, options = {}) {
  const payload = { cmd, ...data };

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  // Plan B: Manual Token (LocalStorage)
  const sessionId = localStorage.getItem("facont_session");
  if (sessionId) {
    headers["X-Session-ID"] = sessionId;
  }

  const res = await fetch(FACONT_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    // credentials: 'include' // Removed to avoid CORS issues with cookies
  });

  if (res.status === 401) {
    // Не авторизован -> редирект на логин
    facontShowAuth("login");
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const txt = await res.text();
    throw new Error("HTTP " + res.status + ": " + txt);
  }

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

// Загрузка partial-файла в #facont-main
async function facontLoadPartial(relativePath) {
  const main = document.getElementById("facont-main");
  if (!main) return null;

  main.innerHTML = "Загрузка...";

  let url = relativePath.replace(/^\//, "");
  if (FACONT_BASE_URL) {
    url = FACONT_BASE_URL + "/" + url;
  }

  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) {
    // If partial missing -> show friendly 404 stub
    if (res.status === 404) {
      try {
        const stub = await facontLoadPartialStr('404.html');
        main.innerHTML = stub;
      } catch (_) {
        main.innerHTML = '<div class="card">Ошибка загрузки: 404</div>';
      }
      return null;
    }

    main.innerHTML = '<div class="card">Ошибка загрузки: ' + res.status + "</div>";
    return null;
  }

  const html = await res.text();
  main.innerHTML = html;
  return main;
}

// Helper to load string only
async function facontLoadPartialStr(relativePath) {
  let url = relativePath.replace(/^\//, "");
  if (FACONT_BASE_URL) {
    url = FACONT_BASE_URL + "/" + url;
  }
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) return "Error loading " + relativePath;
  return await res.text();
}

// Экспортируем функции в глобальную область, чтобы старый код продолжал работать
window.facontCallAPI = facontCallAPI;
window.facontLoadPartial = facontLoadPartial;
window.facontLoadPartialStr = facontLoadPartialStr;
