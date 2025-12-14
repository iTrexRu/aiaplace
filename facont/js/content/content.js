
// -----------------------------
// CONTENT MODULE (extracted from facont.js)
// -----------------------------

/* -----------------------------
   Экран: Готовый контент (Список)
------------------------------*/

function facontInitContentList() {
  const tbody = document.getElementById('content-list-tbody');
  const table = document.getElementById('content-list-table');
  const status = document.getElementById('content-list-status');
  const btnRefresh = document.getElementById('btn-refresh-content');

  async function loadList() {
    if (status) {
      status.style.display = 'block';
      status.textContent = 'Загрузка...';
    }
    if (table) table.style.display = 'none';

    try {
      // Запрашиваем список у n8n
      const res = await facontCallAPI('content-list', {});
      // Ожидаем массив items: [{ id, created_at, generated_content, ... }]
      const items = (res && res.items) ? res.items : [];

      if (tbody) {
        tbody.innerHTML = '';
        if (items.length === 0) {
          if (status) {
            status.textContent = 'Нет созданного контента.';
            status.style.display = 'block';
          }
          return;
        }

        items.forEach(item => {
          const row = document.createElement('tr');
          
          // Дата
          const dateStr = item.created_at ? new Date(item.created_at).toLocaleString('ru-RU') : '—';
          
          // Начало текста (сниппет)
          const text = item.generated_content || '';
          const snippet = text.length > 60 ? text.substring(0, 60) + '...' : text;
          
          // Статус (если есть поле status, иначе по наличию текста)
          const isDone = !!text;
          const statusLabel = isDone ? '<span style="color:green">Готово</span>' : '<span style="color:orange">В обработке</span>';

          row.innerHTML = `
            <td style="padding:12px; border-bottom:1px solid #eee;">${dateStr}</td>
            <td style="padding:12px; border-bottom:1px solid #eee;">${statusLabel}</td>
            <td style="padding:12px; border-bottom:1px solid #eee; color:#555;">${snippet}</td>
            <td style="padding:12px; border-bottom:1px solid #eee; text-align:right;">
              <button class="facont-btn secondary small" data-open-id="${item.id}">Открыть</button>
            </td>
          `;
          tbody.appendChild(row);
        });
      }

      if (status) status.style.display = 'none';
      if (table) table.style.display = 'table';

    } catch (e) {
      if (status) {
        status.textContent = 'Ошибка загрузки: ' + (e.message || e);
        status.style.display = 'block';
      }
    }
  }

  if (btnRefresh) {
    btnRefresh.addEventListener('click', loadList);
  }
  
  if (tbody) {
    tbody.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-open-id]');
      if (btn) {
        const id = btn.dataset.openId;
        facontShowReview(id);
      }
    });
  }

  loadList();
}

/* -----------------------------
   Экран: Просмотр/Редактирование контента
------------------------------*/

async function facontInitContentReview(contentId) {
  if (!contentId) return;

  const titleEl = document.getElementById('review-title');
  const dateEl = document.getElementById('review-date');
  const transEl = document.getElementById('review-transcription');
  const contentEl = document.getElementById('review-content');
  
  const btnSave = document.getElementById('btn-save-content');
  const statusEl = document.getElementById('save-content-status');
  const busyEl = document.getElementById('save-content-busy');

  try {
    // Загрузка деталей
    const res = await facontCallAPI('content-get', { id: contentId });
    const item = res.item || {};

    if (dateEl) dateEl.textContent = item.created_at ? new Date(item.created_at).toLocaleString('ru-RU') : '';
    if (transEl) transEl.textContent = item.transcription || '(нет транскрипции)';
    if (contentEl) contentEl.value = item.generated_content || '';
    
  } catch (e) {
    if (transEl) transEl.textContent = 'Ошибка загрузки: ' + e.message;
  }

  // Сохранение
  if (btnSave) {
    btnSave.addEventListener('click', async () => {
      const newContent = contentEl ? contentEl.value : '';
      
      btnSave.disabled = true;
      if (busyEl) busyEl.style.display = 'inline-block';
      if (statusEl) statusEl.textContent = '';
      
      try {
        await facontCallAPI('content-update', {
          id: contentId,
          generated_content: newContent
        });
        if (statusEl) statusEl.textContent = 'Сохранено!';
      } catch (e) {
        if (statusEl) statusEl.textContent = 'Ошибка: ' + e.message;
      } finally {
        btnSave.disabled = false;
        if (busyEl) busyEl.style.display = 'none';
      }
    });
  }
}

// === Export ===
window.facontInitContentList = facontInitContentList;
window.facontInitContentReview = facontInitContentReview;