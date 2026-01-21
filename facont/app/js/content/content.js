
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

      // Нормализация формата ответа:
      // - ожидаемый формат: { items: [...] }
      // - иногда приходит массив: [ { ok: true, items: [...] } ]
      const rawItems =
        (res && typeof res === 'object' && !Array.isArray(res) && Array.isArray(res.items))
          ? res.items
          : (Array.isArray(res) && res[0] && Array.isArray(res[0].items))
            ? res[0].items
            : [];

      // В "Готовом контенте" показываем только готовые записи:
      // если есть запись "в обработке" (generated_content пустой) — не отображаем её здесь.
      const items = (rawItems || []).filter((it) => {
        const generated = (it && it.generated_content ? String(it.generated_content) : '').trim();
        return generated.length > 0;
      });

      if (tbody) {
        tbody.innerHTML = '';

        // Empty-state: нет готового контента
        if (items.length === 0) {
          if (status) {
            status.textContent = 'Вы еще не делали контент. Как только сделаете, он появится здесь';
            status.style.display = 'block';
          }
          // таблицу оставляем скрытой
          if (table) table.style.display = 'none';
          return;
        }

        // Есть готовый контент -> статус прячем
        if (status) status.style.display = 'none';

        items.forEach(item => {
          const row = document.createElement('tr');
          
          // Дата
          const dateStr = item.created_at ? new Date(item.created_at).toLocaleString('ru-RU') : '—';
          
          // Начало текста (сниппет)
          const text = item.generated_content || '';
          const snippet = text.length > 60 ? text.substring(0, 60) + '...' : text;
          
          // В этом списке показываем только готовые записи
          const statusLabel = '<span class="facont-text-success">Готово</span>';

          row.innerHTML = `
            <td class="facont-td">${dateStr}</td>
            <td class="facont-td">${statusLabel}</td>
            <td class="facont-td facont-text-muted">${snippet}</td>
            <td class="facont-td facont-td-right">
              <button class="facont-btn secondary small" data-open-id="${item.id}">Открыть</button>
            </td>
          `;
          tbody.appendChild(row);
        });
      }

      if (status) status.style.display = 'none';
      if (table) table.style.display = 'table';

    } catch (e) {
      const msg = (e && e.message ? String(e.message) : String(e || '')).trim();

      // n8n в сценарии «контента нет» иногда возвращает 500 Workflow execution failed.
      // Это не критичная ошибка для пользователя — показываем empty-state.
      const isEmptyWorkflowFailure =
        /HTTP\s*500/i.test(msg) && /Workflow execution failed/i.test(msg);

      if (status) {
        if (isEmptyWorkflowFailure) {
          status.textContent = 'Вы еще не делали контент. Как только сделаете, он появится здесь';
        } else {
          status.textContent = 'Ошибка загрузки: ' + msg;
        }
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
