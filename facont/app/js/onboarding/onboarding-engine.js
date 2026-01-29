class OnboardingEngine {
  constructor(containerId, blockConfig) {
    this.container = document.getElementById(containerId);
    this.config = blockConfig;
    this.currentStepIndex = 0;
    this.answers = {};
    this.apiResult = null;
    this.isBusy = false;

    if (!this.container) {
      console.error(`Container #${containerId} not found`);
      return;
    }
  }

  start() {
    this.renderStep();
  }

  getCurrentStep() {
    return this.config.steps[this.currentStepIndex];
  }

  renderStep() {
    if (!this.container) return;
    const step = this.getCurrentStep();
    if (!step) return;

    // Build HTML
    let html = `
      <div class="card fade-in">
        ${this.renderHeader()}
        ${this.renderContent(step)}
      </div>
    `;

    this.container.innerHTML = html;
    this.attachEvents(step);

    // Auto-run process steps
    if (step.type === 'process') {
      this.runProcess(step);
    }
  }

  renderHeader() {
    // Determine progress based on question steps only
    const steps = Array.isArray(this.config.steps) ? this.config.steps : [];
    const questionIndices = steps
      .map((step, index) => ({ step, index }))
      .filter(({ step }) => step && step.type === 'question')
      .map(({ index }) => index);

    const total = questionIndices.length || 1;
    const currentQuestionIndex = questionIndices.findIndex(index => index === this.currentStepIndex);
    const current = currentQuestionIndex >= 0 ? currentQuestionIndex + 1 : 0;
    const percent = total > 0 ? (Math.max(current - 1, 0) / total) * 100 : 0;

    return `
      <div class="onb1-progress">
        <div class="onb1-progress-header">
          <span>${this.config.title}</span>
          <span>Шаг ${current} из ${total}</span>
        </div>
        <div class="onb1-progress-bar">
          <div class="onb1-progress-bar-inner" style="width: ${percent}%"></div>
        </div>
      </div>
    `;
  }

  renderContent(step) {
    let content = '';

    // Optional badge
    if (step.type === 'question' && step.required === false) {
       content += `<div style="float: right; font-size: 12px; background: #eee; padding: 4px 8px; border-radius: 6px; color: #666; margin-left: 10px;">можно пропустить</div>`;
    }

    // Title & Description
    if (step.title) content += `<h2>${step.title}</h2>`;
    if (step.description) content += `<p class="muted">${step.description}</p>`;
    
    // Custom HTML Content (Intro)
    if (step.content) content += step.content;

    // Tips
    if (step.tips && Array.isArray(step.tips)) {
      step.tips.forEach(tip => {
        content += `<p class="muted">${tip}</p>`;
      });
    }

    // Example
    if (step.example) {
      content += `<p class="onb-question-example">${step.example}</p>`;
    }

    // Input Fields
    if (step.type === 'question') {
      const val = this.answers[step.key] || '';
      content += `<div style="margin-top:6px;">`;
      if (step.label) content += `<label for="field-${step.key}">${step.label}</label>`;

      if (step.inputType === 'textarea') {
        content += `<textarea id="field-${step.key}">${val}</textarea>`;
      } else if (step.inputType === 'text') {
        content += `<input type="text" id="field-${step.key}" value="${val}" />`;
      } else if (step.inputType === 'radio') {
        content += `<div style="margin-top:4px;">`;
        step.options.forEach(opt => {
          const checked = val === opt.value ? 'checked' : '';
          content += `
            <label style="display:block; margin-bottom:4px;">
              <input type="radio" name="field-${step.key}" value="${opt.value}" ${checked}>
              ${opt.label}
            </label>
          `;
        });
        content += `</div>`;
      }
      content += `</div>`;
    }

    // Summary / Result Textarea
    if (step.type === 'summary' || (step.type === 'result' && step.key)) {
      let val = '';
      if (step.key === 'finalText' && this.apiResult) {
        val = this.extractFinalText(this.apiResult);
      } else if (this.apiResult && this.apiResult[step.key]) {
        val = this.apiResult[step.key];
      }
      
      // Fallback: build from answers if empty and it's final text
      if (!val && step.key === 'finalText') {
        val = this.buildInputTextFromAnswers();
      }

      if (step.type === 'summary') {
         content += `
          <div style="margin-top:6px;">
            <label for="field-summary">Финальный текст</label>
            <textarea id="field-summary">${val}</textarea>
          </div>
        `;
      } else if (step.type === 'result') {
         // Read-only or pre block
         content += `
          <div id="field-result" class="onb-question-example" style="white-space:pre-wrap;">${val || '[Нет данных]'}</div>
        `;
      }
    }

    // Busy Indicator
    content += `<div id="step-busy" class="spinner" style="display:none;"></div>`;
    content += `<div id="step-status" class="facont-status"></div>`;

    // Buttons
    content += `<div style="margin-top:12px; display:flex; gap:10px; align-items:center;">`;
    
    // Back Button
    if (this.currentStepIndex > 0 && step.type !== 'process') {
      content += `<button class="btn secondary" data-action="prev">Назад</button> `;
    }

    // Skip Button
    if (step.type === 'question' && step.required === false) {
      content += `<button class="btn secondary" data-action="skip" style="border:none; background:transparent;">Пропустить</button> `;
    }

    // Next / Action Button
    if (step.btnNext) {
      content += `<button class="btn" data-action="next">${step.btnNext}</button> `;
    } else if (step.type === 'intro') {
      content += `<button class="btn" data-action="next">Дальше</button> `;
    } else if (step.type === 'question') {
      content += `<button class="btn" data-action="next">Дальше</button> `;
    }

    // Save Button (Summary)
    if (step.btnSave) {
      content += `<button class="btn" data-action="save">${step.btnSave}</button> `;
    }
    
    // Finish Button (Result)
    if (step.btnFinish) {
      content += `<button class="btn secondary" data-action="finish">${step.btnFinish}</button> `;
    }

    content += `</div>`;

    return content;
  }

  attachEvents(step) {
    const btns = this.container.querySelectorAll('button[data-action]');
    btns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        if (action === 'next') this.handleNext();
        if (action === 'prev') this.handlePrev();
        if (action === 'skip') this.handleSkip();
        if (action === 'save') this.handleSave(e.target);
        if (action === 'finish') this.handleFinish();
        if (action === 'nav') this.handleNav(e.target.dataset.target);
      });
    });
  }

  handleNext(force = false) {
    if (this.isBusy && !force) return;
    const step = this.getCurrentStep();
    
    // Validate & Collect
    if (step.type === 'question') {
      if (!this.collectAndValidate(step)) return;
    }

    if (this.currentStepIndex < this.config.steps.length - 1) {
      this.currentStepIndex++;
      this.renderStep();
      
      if (force) {
        this.isBusy = false;
      }
    }
  }

  handleSkip() {
    if (this.isBusy) return;
    // Just move next without validation/collection
    if (this.currentStepIndex < this.config.steps.length - 1) {
      this.currentStepIndex++;
      this.renderStep();
    }
  }

  handlePrev() {
    if (this.isBusy) return;
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.renderStep();
    }
  }

  handleFinish() {
    if (window.facontShowView) {
      window.facontShowView('onboarding_overview');
    }
  }

  handleNav(target) {
    if (target && window.facontShowView) {
      window.facontShowView(target);
    }
  }

  collectAndValidate(step) {
    const key = step.key;
    let val = '';
    
    if (step.inputType === 'radio') {
      const el = this.container.querySelector(`input[name="field-${key}"]:checked`);
      val = el ? el.value : '';
    } else {
      const el = document.getElementById(`field-${key}`);
      val = el ? el.value.trim() : '';
    }

    if (step.required && !val) {
      alert('Заполни поле перед тем, как идти дальше.');
      return false;
    }

    this.answers[key] = val;
    return true;
  }

  async runProcess(step) {
    this.setBusy(true);
    const statusEl = document.getElementById('step-status');
    if (statusEl) statusEl.textContent = '';

    try {
      if (!step.action) throw new Error('No action defined');

      const payload = this.preparePayload(step.action);
      const res = await window.facontCallAPI(step.action, payload);
      this.apiResult = res;

      this.handleNext(true);

    } catch (e) {
      console.error(e);
      if (statusEl) statusEl.textContent = 'Ошибка: ' + (e.message || e);
      this.setBusy(false); 
    }
  }

  async handleSave(btn) {
    this.setBusy(true);
    const statusEl = document.getElementById('step-status');
    if (statusEl) statusEl.textContent = '';

    const summaryEl = document.getElementById('field-summary');
    const finalText = summaryEl ? summaryEl.value : '';

    try {
      const payload = {
        block: this.config.apiBlockName,
        answers: this.formatAnswersForSave(),
        inputText: this.buildInputTextFromAnswers(),
        finalText: finalText,
        meta: {
           answers: this.answers,
           ui_version: 3,
           saved_from: 'frontend_onboarding_engine'
        }
      };
      
      if (this.config.id === 'style') {
        payload.meta.summary = this.apiResult?.summary;
        payload.meta.full = this.apiResult?.full;
        payload.meta.stylePrompt = this.apiResult?.stylePrompt;
      }

      await window.facontCallAPI('onboarding_save', payload);
      
      if (statusEl) statusEl.textContent = 'Сохранено!';
      
      // Determine Next Block Logic
      this.setBusy(false);
      
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Сохранено';
        
        // Find next block
        const allBlocks = window.FACONT_ONBOARDING_CONFIG.blocks.sort((a,b)=>a.order-b.order);
        const currentIdx = allBlocks.findIndex(b => b.id === this.config.id);
        const nextBlock = allBlocks[currentIdx + 1];
        
        const actionsContainer = btn.parentElement;
        
        // Prevent duplicates
        if (actionsContainer.querySelector('[data-action="nav"]')) return;

        if (nextBlock) {
          const nextBtn = document.createElement('button');
          nextBtn.className = 'btn';
          nextBtn.textContent = `Следующий блок: ${nextBlock.title}`;
          nextBtn.dataset.action = 'nav';
          nextBtn.dataset.target = 'onboarding_' + nextBlock.id;
          nextBtn.addEventListener('click', () => this.handleNav('onboarding_' + nextBlock.id));
          actionsContainer.appendChild(nextBtn);
        } else {
          const finishBtn = document.createElement('button');
          finishBtn.className = 'btn';
          finishBtn.textContent = 'Сделать пост';
          finishBtn.dataset.action = 'nav';
          finishBtn.dataset.target = 'idea_post';
          finishBtn.addEventListener('click', () => this.handleNav('idea_post'));
          actionsContainer.appendChild(finishBtn);
        }
      }

    } catch (e) {
      if (statusEl) statusEl.textContent = 'Ошибка: ' + (e.message || e);
      this.setBusy(false);
    }
  }

  preparePayload(cmd) {
    if (cmd === 'style_analyze') {
      return {
        text1: this.answers.text1,
        text2: this.answers.text2,
        text3: this.answers.text3
      };
    }
    
    return {
      block: this.config.apiBlockName,
      answers: this.formatAnswersForSave(),
      inputText: this.buildInputTextFromAnswers(),
      meta: {
        answers: this.answers,
        ui_version: 3,
        submitted_from: 'frontend_onboarding_engine'
      }
    };
  }

  formatAnswersForSave() {
    const result = {};
    this.config.steps.forEach(s => {
      if (s.type === 'question' && s.key && this.answers[s.key]) {
        result[s.key] = [s.title, this.answers[s.key]];
      }
    });
    return result;
  }

  buildInputTextFromAnswers() {
    const lines = [];
    Object.keys(this.answers).forEach(key => {
      const val = this.answers[key];
      if (val) lines.push(key + ': ' + val);
    });
    return lines.join('\n');
  }

  extractFinalText(res) {
    if (!res) return '';
    if (Array.isArray(res) && res[0] && res[0].ok) {
      const item = res[0];
      const value = item.onboarding_res || item.result || item.finalText || item.text || item.summary || item.stylePrompt || '';
      return String(value).trim();
    }
    if (typeof res === 'object') {
      const value = res.onboarding_res || res.result || res.finalText || res.text || res.summary || res.stylePrompt || '';
      return String(value).trim();
    }
    return String(res).trim();
  }

  setBusy(isBusy) {
    this.isBusy = isBusy;
    const busyEl = document.getElementById('step-busy');
    if (busyEl) busyEl.style.display = isBusy ? 'inline-block' : 'none';
    
    const btns = this.container.querySelectorAll('button');
    btns.forEach(b => b.disabled = isBusy);
  }
}

window.OnboardingEngine = OnboardingEngine;
