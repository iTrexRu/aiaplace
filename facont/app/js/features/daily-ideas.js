// -----------------------------
// DAILY IDEAS MODULE
// -----------------------------

function facontInitDailyIdeas(containerId, type = 'block') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const STORAGE_KEY_DATA = 'facont_daily_ideas_data_' + new Date().toLocaleDateString();
  const STORAGE_KEY_STATE = 'facont_daily_ideas_state'; // collapsed/expanded

  let ideasData = null;
  let isExpanded = false;

  // --- Load Data --- 
  async function loadData() {
    // 1. Try local storage for today
    try {
      const cached = localStorage.getItem(STORAGE_KEY_DATA);
      if (cached) {
        ideasData = JSON.parse(cached);
        render();
        return;
      }
    } catch (e) { console.error(e); }

    // 2. Fetch from API
    renderLoading();
    try {
      // TODO: Replace with real API call when ready
      // const res = await facontCallAPI('actual_ideas', {});
      // ideasData = res.data || [];
      
      // Call API
      const res = await facontCallAPI('actual_ideas', {});
      if (res && res.featured) {
        ideasData = res;
        localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(ideasData));
      } else {
        // Fallback if API returns empty
        ideasData = getPlaceholderData();
      }
      render();
    } catch (e) {
      console.error('Failed to load daily ideas', e);
      renderError();
    }
  }

  // --- Load State ---
  function loadState() {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY_STATE);
      isExpanded = savedState === 'expanded';
    } catch(e) {}
  }

  function saveState(expanded) {
    isExpanded = expanded;
    localStorage.setItem(STORAGE_KEY_STATE, expanded ? 'expanded' : 'collapsed');
    render();
  }

  // --- Render ---
  function render() {
    if (!ideasData) return;

    if (type === 'block') {
      // Home Block
      renderHomeBlock();
    } else {
      // Drawer (Strip)
      renderDrawer();
    }
  }

  function renderLoading() {
    container.innerHTML = '<div class="facont-card"><div class="spinner"></div> Загрузка идей...</div>';
  }

  function renderError() {
    container.innerHTML = '<div class="facont-card facont-text-danger">Не удалось загрузить идеи на сегодня</div>';
  }

  // --- HTML Generators ---

  function getPlaceholderData() {
    return {
      featured: {
        title: 'Был ли клиент, с которым вы зареклись работать?',
        hint: 'Мы начнём — вы дополните своим опытом',
        why: 'Откровенные посты вызывают доверие и снимают барьер перед покупкой',
        format: 'Пост · личная история',
        time: '2 мин'
      },
      list: [
        {
          badge: '🔥 Залетает сейчас',
          title: 'Кейс Netflix: как увольнение 30% команды спасло компанию',
          why: 'Узнаваемые бренды привлекают внимание и повышают авторитет автора',
          format: 'Карусель · разбор',
          time: '3м'
        },
        {
          badge: '✓ Проверено',
          title: 'Исследование Gallup: 70% увольняются из-за руководителя',
          why: 'Актуальные факты вызывают реакцию «он в теме» — усиливает экспертность',
          format: 'Пост · экспертный',
          time: '2м'
        },
        {
          badge: '💡 Новый формат',
          title: '«Главная ошибка найма — не в человеке, а в ожиданиях»',
          why: 'Формат личного инсайта вызывает «он такой же как я» — сокращает дистанцию',
          format: 'Reels · инсайт',
          time: '2м'
        }
      ],
      stats: {
        streak: 5,
        days: [true, true, true, false, false, false, false] // Mon-Sun, today is Thu (index 3)
      }
    };
  }

  function renderWeekProgress(stats) {
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const todayIndex = new Date().getDay() - 1; // 0=Sun, 1=Mon... need 0=Mon
    const adjTodayIndex = todayIndex < 0 ? 6 : todayIndex;

    let html = '<div class="week-progress">';
    days.forEach((day, idx) => {
      let classes = 'week-day';
      // Mock logic: randomly done or based on placeholder
      if (stats && stats.days && stats.days[idx]) classes += ' done';
      if (idx === adjTodayIndex) classes += ' today';
      
      html += `<div class="${classes}">${day}</div>`;
    });
    html += '</div>';
    
    const streak = stats ? stats.streak : 0;
    html += `<span class="streak-label">🔥 <strong>${streak} дней</strong> подряд</span>`;
    return html;
  }

  // === HOME BLOCK RENDERER ===
  function renderHomeBlock() {
    const { featured, list, stats } = ideasData;
    const count = list.length;

    if (!isExpanded) {
      // COLLAPSED STATE
      container.innerHTML = `
        <div class="facont-idea-card">
          <div class="facont-idea-card-header">
            <div class="facont-idea-label">
              <span class="facont-idea-label-dot"></span>
              Идея дня
            </div>
          </div>
          <div class="facont-idea-content">
            <div class="facont-idea-main">
              <h2 class="facont-idea-question">${featured.title}</h2>
              <p class="facont-idea-hint">${featured.hint}</p>
              <p class="facont-idea-why">${featured.why}</p>
              <div class="facont-idea-actions">
                <button class="facont-idea-btn" data-action="use-featured">Дополнить историю · ${featured.time}</button>
                <span class="facont-idea-format">${featured.format}</span>
              </div>
            </div>
            <div class="facont-idea-side" data-action="expand">
              <div class="facont-idea-counter">+${count}</div>
              <div class="facont-idea-counter-label">темы<br>ждут вас</div>
              <span class="facont-idea-side-link">Смотреть →</span>
            </div>
          </div>
          <div class="idea-card-footer" style="margin-top:28px; padding-top:24px; border-top:1px solid rgba(255,255,255,0.08); display:flex; justify-content:space-between; align-items:center;">
            ${renderWeekProgress(stats)}
          </div>
        </div>
      `;
    } else {
      // EXPANDED STATE
      let listHtml = '';
      list.forEach(item => {
        listHtml += `
          <div class="facont-idea-item">
            <span class="facont-idea-type-badge">${item.badge}</span>
            <h4>${item.title}</h4>
            <p>${item.why}</p>
            <div class="facont-idea-item-footer">
              <span style="font-size:12px; color:rgba(255,255,255,0.35);">${item.format}</span>
              <button class="facont-idea-item-btn" data-action="use-item" data-title="${item.title}">Создать · ${item.time}</button>
            </div>
          </div>
        `;
      });

      container.innerHTML = `
        <div class="facont-idea-card">
          <div class="facont-idea-expanded-header">
            <h2 class="facont-idea-expanded-title">Ваши идеи для контента сегодня</h2>
            <div class="facont-idea-expanded-actions">
              <button class="facont-idea-expanded-btn" data-action="refresh">🔄 Обновить</button>
              <button class="facont-idea-expanded-btn" data-action="collapse">Свернуть ↑</button>
            </div>
          </div>
          <div class="facont-idea-expanded-layout">
            <div class="facont-idea-featured">
              <span class="facont-idea-featured-label">⭐ Рекомендуем</span>
              <h3>${featured.title}</h3>
              <p class="facont-idea-featured-hint">${featured.hint}</p>
              <p class="facont-idea-featured-why">${featured.why}</p>
              <div class="facont-idea-featured-footer">
                <span class="facont-idea-format">${featured.format}</span>
                <button class="facont-idea-btn" data-action="use-featured">Дополнить · ${featured.time}</button>
              </div>
            </div>
            <div class="facont-idea-list">
              ${listHtml}
            </div>
          </div>
          <div class="idea-card-footer" style="margin-top:28px; padding-top:24px; border-top:1px solid rgba(255,255,255,0.08); display:flex; justify-content:space-between; align-items:center;">
            ${renderWeekProgress(stats)}
          </div>
        </div>
      `;
    }
    attachEvents();
  }

  // === DRAWER RENDERER ===
  function renderDrawer() {
    const { featured, list, stats } = ideasData;
    const count = list.length;

    // Outer Container
    const drawerHtml = `
      <div class="facont-drawer-bar" data-action="toggle-drawer">
        <div style="display:flex; align-items:center; gap:12px; flex:1; min-width:0;">
          <div class="facont-idea-label" style="font-size:10px; padding:4px 10px;">
            <span class="facont-idea-label-dot" style="width:4px; height:4px;"></span>
            Идея дня
          </div>
          <span style="font-size:13px; font-weight:600; color:rgba(255,255,255,0.8); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${featured.title}</span>
        </div>
        <div style="display:flex; align-items:center; gap:12px; flex-shrink:0;">
          <div style="font-size:12px; color:rgba(255,255,255,0.4);"><strong>+${count}</strong> темы</div>
        </div>
      </div>
      <div class="facont-drawer-handle" data-action="toggle-drawer" style="opacity:0.5;">
        <svg width="14" height="7" viewBox="0 0 20 8" stroke="white" stroke-width="2" fill="none"><polyline points="3 1 10 7 17 1"/></svg>
      </div>
      <div class="facont-drawer-expanded ${isExpanded ? 'open' : ''}">
        <div style="padding:0 24px 18px; color:white;">
          <div style="height:1px; background:rgba(255,255,255,0.08); margin-bottom:14px;"></div>
          
          <div class="facont-idea-expanded-header">
            <h2 class="facont-idea-expanded-title" style="font-size:15px;">Подготовили для вашего блога сегодня</h2>
            <div class="facont-idea-expanded-actions">
              <button class="facont-idea-expanded-btn" data-action="refresh" style="font-size:11px; padding:6px 12px;">🔄 Обновить</button>
              <button class="facont-idea-expanded-btn" data-action="collapse" style="font-size:11px; padding:6px 12px;">Свернуть ↑</button>
            </div>
          </div>

          <div class="facont-idea-expanded-layout">
             <!-- Featured -->
             <div class="facont-idea-featured" style="padding:20px;">
                <span class="facont-idea-featured-label" style="font-size:9px; padding:3px 8px; margin-bottom:10px;">⭐ Рекомендуем</span>
                <div style="font-size:16px; font-weight:800; margin-bottom:6px;">${featured.title}</div>
                <p style="font-size:12px; color:rgba(255,255,255,0.45); margin-bottom:10px;">${featured.why}</p>
                <div class="facont-idea-featured-footer" style="margin-top:auto;">
                   <span style="font-size:11px; color:rgba(255,255,255,0.3);">${featured.format}</span>
                   <button class="facont-idea-btn" style="padding:9px 16px; font-size:11px;" data-action="use-featured">Дополнить · ${featured.time}</button>
                </div>
             </div>

             <!-- List -->
             <div class="facont-idea-list">
               ${list.map(item => `
                 <div class="facont-idea-item" style="padding:16px;">
                    <span class="facont-idea-type-badge" style="font-size:9px; padding:3px 8px; margin-bottom:8px;">${item.badge}</span>
                    <h4 style="font-size:13px; margin-bottom:4px;">${item.title}</h4>
                    <p style="font-size:10px; margin-bottom:8px;">${item.why}</p>
                    <div class="facont-idea-item-footer">
                       <span style="font-size:10px; color:rgba(255,255,255,0.35);">${item.format}</span>
                       <button class="facont-idea-item-btn" style="padding:7px 12px; font-size:11px;" data-action="use-item" data-title="${item.title}">Создать · ${item.time}</button>
                    </div>
                 </div>
               `).join('')}
             </div>
          </div>

          <div style="margin-top:14px; padding-top:12px; border-top:1px solid rgba(255,255,255,0.08); display:flex; justify-content:space-between; align-items:center;">
             ${renderWeekProgress(stats)}
          </div>
        </div>
      </div>
    `;
    container.innerHTML = drawerHtml;
    attachEvents();
  }

  function attachEvents() {
    const btns = container.querySelectorAll('[data-action]');
    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        
        if (action === 'expand' || action === 'toggle-drawer') {
          saveState(!isExpanded);
        }
        if (action === 'collapse') {
          saveState(false);
        }
        if (action === 'refresh') {
          localStorage.removeItem(STORAGE_KEY_DATA);
          loadData();
        }
        if (action === 'use-featured' || action === 'use-item') {
          // Logic to use the idea -> copy to clipboard or navigate?
          // For now, let's say it copies title to buffer or just alerts
          const text = action === 'use-featured' ? ideasData.featured.title : btn.dataset.title;
          // alert('Идея выбрана: ' + text);
          // Potential logic: navigate to Idea Post with pre-filled topic
          if (window.facontShowView) {
             // Pass data via some state manager or query param?
             // Simple hack: localStorage
             localStorage.setItem('facont_draft_topic', text);
             window.facontShowView('idea_post');
          }
        }
      });
    });
  }

  // Start
  loadState();
  loadData();
}

window.facontInitDailyIdeas = facontInitDailyIdeas;
