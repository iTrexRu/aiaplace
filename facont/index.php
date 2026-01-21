<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Facont</title>

    <!-- Tailwind CSS (CDN) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Inter font -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <style>
      body { font-family: 'Inter', sans-serif; }
      html { scroll-behavior: smooth; }
      .tab-btn.active {
        background-color: #eff6ff; /* blue-50 */
        color: #2563eb; /* blue-600 */
        border-bottom: 2px solid #2563eb;
      }
    </style>
  </head>
  <body>
    <div class="min-h-screen font-sans text-slate-900 bg-white">

      <!-- Navigation -->
      <nav class="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-20 items-center">
            <div class="flex-shrink-0 flex items-center gap-2">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-xl">F</span>
              </div>
              <span class="font-bold text-2xl tracking-tight">Facont</span>
            </div>

            <div class="hidden md:flex items-center space-x-8">
              <a href="#problem" class="text-slate-600 hover:text-blue-600 font-medium transition">Проблема</a>
              <a href="#system" class="text-slate-600 hover:text-blue-600 font-medium transition">Система</a>
              <a href="#expertise" class="text-slate-600 hover:text-blue-600 font-medium transition">Экспертиза</a>
              <a href="./app/" class="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 inline-block">
                Получить доступ
              </a>
            </div>

            <div class="md:hidden">
              <button id="mobile-menu-btn" class="text-slate-600 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div id="mobile-menu" class="hidden md:hidden bg-white border-b border-slate-100 p-4 absolute w-full shadow-xl">
          <div class="flex flex-col space-y-4">
            <a href="#problem" class="text-slate-600 font-medium py-2 mobile-link">Проблема</a>
            <a href="#system" class="text-slate-600 font-medium py-2 mobile-link">Система</a>
            <a href="#expertise" class="text-slate-600 font-medium py-2 mobile-link">Экспертиза</a>
            <a href="./app/" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium w-full text-center block">
              Получить доступ
            </a>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <header class="pt-32 pb-20 lg:pt-48 lg:pb-32 bg-slate-50 overflow-hidden relative">
        <div class="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 rounded-bl-[100px] -z-10"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                <span>AI-копилот для маркетинга и продаж</span>
              </div>
              <h1 class="text-4xl lg:text-6xl font-extrabold leading-tight text-slate-900 mb-6">
                Generic контент <br/>
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">не продаёт.</span><br/>
                Нужна Система.
              </h1>
              <p class="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                Системное решение для бизнеса: контент, лид-генерация, воронки.
                Забудьте про бесконечные правки и тексты, которые не попадают в аудиторию.
              </p>
              <div class="flex flex-col sm:flex-row gap-4">
                <a href="./app/" class="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20">
                  Попробовать Facont
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
                <button class="px-8 py-4 rounded-xl font-bold text-lg text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition flex items-center justify-center">
                  Узнать больше
                </button>
              </div>
              <div class="mt-8 flex items-center gap-4 text-sm text-slate-500">
                <div class="flex -space-x-2">
                  <div class="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">U1</div>
                  <div class="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">U2</div>
                  <div class="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">U3</div>
                  <div class="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">U4</div>
                </div>
                <p>Используют 10+ стартапов и агентств</p>
              </div>
            </div>

            <div class="relative">
              <div class="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
                <div class="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                  <div class="flex items-center gap-3">
                    <div class="w-3 h-3 rounded-full bg-red-500"></div>
                    <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span class="text-xs font-mono text-slate-400">Facont System v2.0</span>
                </div>

                <div class="space-y-4">
                  <div class="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div class="flex items-center gap-2 text-blue-800 font-semibold mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a4.5 4.5 0 0 0 3-4"/><path d="M6.003 5.125A3 3 0 0 1 19.5 5.625"/><path d="M12 18a4 4 0 0 0 7.5-3.5"/><path d="M12 18v5"/><path d="m9 22 3-1 3 1"/><path d="M12 18h6a2 2 0 0 1 2 2v2"/><path d="M12 2v2"/><path d="m2 22 3-1 3 1"/><path d="M22 22l-3-1-3 1"/></svg>
                      <span>Анализ стратегии</span>
                    </div>
                    <p class="text-sm text-slate-600">Цель: B2B Продажи. Аудитория: CTO. Тон: Экспертный.</p>
                  </div>
                  <div class="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div class="flex items-center gap-2 text-slate-800 font-semibold mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                      <span>Генерация поста</span>
                    </div>
                    <p class="text-sm text-slate-500 italic">"Внедрение AI не должно ломать процессы..."</p>
                    <div class="mt-2 h-2 w-2/3 bg-slate-100 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Minimal footer -->
      <footer class="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 bg-slate-700 rounded flex items-center justify-center">
              <span class="text-white font-bold text-xs">F</span>
            </div>
            <span class="font-bold text-xl text-white">Facont</span>
          </div>
          <div class="text-sm text-center md:text-right">
            <p>&copy; 2025 Facont Inc. All rights reserved.</p>
            <p class="mt-2">Системное решение для маркетинга.</p>
          </div>
        </div>
      </footer>

    </div>

    <script>
      // Mobile Menu Toggle
      document.addEventListener('DOMContentLoaded', function() {
        const menuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileLinks = document.querySelectorAll('.mobile-link');

        if (menuBtn && mobileMenu) {
          menuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
          });

          mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
              mobileMenu.classList.add('hidden');
            });
          });
        }
      });
    </script>
  </body>
</html>

