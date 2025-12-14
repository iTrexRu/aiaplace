<?php
/*
Template Name: Facont Landing
*/

get_header(); 
?>

<!-- Подключение Tailwind CSS (для быстрой стилизации без сборки) -->
<script src="https://cdn.tailwindcss.com"></script>
<!-- Шрифт Inter для соответствия дизайну -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

<style>
    body { font-family: 'Inter', sans-serif; }
    /* Плавная прокрутка */
    html { scroll-behavior: smooth; }
    /* Стили для активной вкладки */
    .tab-btn.active {
        background-color: #eff6ff; /* blue-50 */
        color: #2563eb; /* blue-600 */
        border-bottom: 2px solid #2563eb;
    }
</style>

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
                    <a href="https://aiaplace.com/facont/" class="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 inline-block">
                        Получить доступ
                    </a>
                </div>

                <div class="md:hidden">
                    <button id="mobile-menu-btn" class="text-slate-600 p-2">
                        <!-- Menu Icon -->
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
                <a href="https://aiaplace.com/facont/" class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium w-full text-center block">
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
                        <!-- Zap Icon -->
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
                        <a href="https://aiaplace.com/facont/" class="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20">
                            Попробовать Facont 
                            <!-- ArrowRight Icon -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </a>
                        <button class="px-8 py-4 rounded-xl font-bold text-lg text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition flex items-center justify-center">
                            Узнать больше
                        </button>
                    </div>
                    <div class="mt-8 flex items-center gap-4 text-sm text-slate-500">
                        <div class="flex -space-x-2">
                            <?php for($i=1; $i<=4; $i++): ?>
                            <div class="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">
                                U<?php echo $i; ?>
                            </div>
                            <?php endfor; ?>
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
                                    <!-- BrainCircuit Icon -->
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a4.5 4.5 0 0 0 3-4"/><path d="M6.003 5.125A3 3 0 0 1 19.5 5.625"/><path d="M12 18a4 4 0 0 0 7.5-3.5"/><path d="M12 18v5"/><path d="m9 22 3-1 3 1"/><path d="M12 18h6a2 2 0 0 1 2 2v2"/><path d="M12 2v2"/><path d="m2 22 3-1 3 1"/><path d="M22 22l-3-1-3 1"/></svg>
                                    <span>Анализ стратегии</span>
                                </div>
                                <p class="text-sm text-slate-600">Цель: B2B Продажи. Аудитория: CTO. Тон: Экспертный.</p>
                            </div>
                            <div class="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <div class="flex items-center gap-2 text-slate-800 font-semibold mb-2">
                                    <!-- CheckCircle2 Icon -->
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

    <!-- The Problem Section -->
    <section id="problem" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-3xl mx-auto mb-16">
                <h2 class="text-3xl font-bold text-slate-900 mb-4">Проблема не в нейросети.</h2>
                <p class="text-xl text-slate-600">
                    Фаундеры уже пробовали ChatGPT и Claude. Результат один: generic тексты.
                </p>
            </div>

            <div class="grid md:grid-cols-3 gap-8 mb-16">
                <div class="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                    <div class="text-4xl font-bold text-blue-600 mb-2">67%</div>
                    <p class="text-slate-600 font-medium">Маркетологов используют AI для контента</p>
                </div>
                <div class="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                    <div class="text-4xl font-bold text-red-500 mb-2">60%</div>
                    <p class="text-slate-600 font-medium">Беспокоятся за репутацию бренда из-за качества</p>
                </div>
                <div class="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                    <div class="text-4xl font-bold text-slate-400 mb-2">generic</div>
                    <p class="text-slate-600 font-medium">Тексты не учитывают стратегию и психологию</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Comparison Section -->
    <section id="system" class="py-20 bg-slate-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4 text-white">Промпт vs Система</h2>
                <p class="text-slate-400 text-lg">Принципиальная разница подходов</p>
            </div>

            <div class="grid md:grid-cols-2 gap-8 lg:gap-12">
                <!-- Left: Generic -->
                <div class="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                    <h3 class="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
                        <!-- XCircle Icon -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                        Промпт из интернета
                    </h3>
                    
                    <ul class="space-y-6">
                        <li class="flex gap-4">
                            <span class="text-red-400 font-bold shrink-0">Статичный</span>
                            <p class="text-slate-300">Создан один раз, устаревает через 3-6 месяцев.</p>
                        </li>
                        <li class="flex gap-4">
                            <span class="text-red-400 font-bold shrink-0">Без стратегии</span>
                            <p class="text-slate-300">"Напиши пост про X". Контент ради контента.</p>
                        </li>
                        <li class="flex gap-4">
                            <span class="text-red-400 font-bold shrink-0">Один результат</span>
                            <p class="text-slate-300">Получили текст → всё. Нет связи с продажами.</p>
                        </li>
                    </ul>
                </div>

                <!-- Right: Facont -->
                <div class="bg-blue-900/20 p-8 rounded-3xl border border-blue-500/30 relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                    <div class="absolute top-0 right-0 bg-blue-600 text-xs font-bold px-3 py-1 rounded-bl-lg">РЕКОМЕНДОВАНО</div>
                    <h3 class="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
                        <!-- CheckCircle2 Icon -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                        Facont: Живая система
                    </h3>
                    
                    <ul class="space-y-6">
                        <li class="flex gap-4">
                            <span class="text-blue-400 font-bold shrink-0">Обновляемая</span>
                            <p class="text-slate-300">Адаптируется под алгоритмы, тренды и ваши цели.</p>
                        </li>
                        <li class="flex gap-4">
                            <span class="text-blue-400 font-bold shrink-0">Маркетинговая логика</span>
                            <p class="text-slate-300">Понимает воронку продаж и психологию клиента.</p>
                        </li>
                        <li class="flex gap-4">
                            <span class="text-blue-400 font-bold shrink-0">Экосистема</span>
                            <p class="text-slate-300">От идеи до публикации + аналитика и лиды.</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- Expertise Section -->
    <section id="expertise" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                    <div class="inline-block bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                        Почему это работает
                    </div>
                    <h2 class="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                        Маркетинговая экспертиза,<br/> а не энтузиазм
                    </h2>
                    <p class="text-lg text-slate-600 mb-6">
                        13 лет в рекламе. Агентство Digital Bands. Спикер TEDx. Каждый промпт — дистилляция реального опыта с клиентами уровня PWC и Conde Nast.
                    </p>
                    
                    <div class="space-y-4">
                        <div class="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                            <div class="bg-white p-2 rounded-lg shadow-sm text-blue-600">
                                <!-- TrendingUp Icon -->
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                            </div>
                            <div>
                                <h4 class="font-bold text-slate-900">Персонализация продаж</h4>
                                <p class="text-sm text-slate-600">94% маркетологов говорят, что это увеличивает продажи.</p>
                            </div>
                        </div>
                        <div class="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                            <div class="bg-white p-2 rounded-lg shadow-sm text-blue-600">
                                <!-- Users Icon -->
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                            </div>
                            <div>
                                <h4 class="font-bold text-slate-900">B2B Рост</h4>
                                <p class="text-sm text-slate-600">58% B2B-маркетологов отмечают рост продаж благодаря контент-маркетингу.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="relative">
                   <!-- "Content from Life" Visual -->
                   <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-2xl">
                     <h3 class="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                       <!-- BrainCircuit Icon -->
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-400"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a4.5 4.5 0 0 0 3-4"/><path d="M6.003 5.125A3 3 0 0 1 19.5 5.625"/><path d="M12 18a4 4 0 0 0 7.5-3.5"/><path d="M12 18v5"/><path d="m9 22 3-1 3 1"/><path d="M12 18h6a2 2 0 0 1 2 2v2"/><path d="M12 2v2"/><path d="m2 22 3-1 3 1"/><path d="M22 22l-3-1-3 1"/></svg>
                       Философия баланса
                     </h3>
                     <p class="text-slate-300 mb-6 text-sm leading-relaxed">
                       Исследование Stanford: креативность увеличивается на 60% во время ходьбы. Идеи приходят не за столом.
                     </p>
                     
                     <div class="grid grid-cols-2 gap-4">
                        <div class="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                            <!-- Mic Icon -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2 text-blue-400"><path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/><circle cx="17" cy="7" r="5"/></svg>
                            <div class="text-xs text-slate-400 uppercase font-bold">Источник</div>
                            <div class="text-sm font-semibold">Наговариваете заметки</div>
                        </div>
                        <div class="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                            <!-- Briefcase Icon -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2 text-blue-400"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                            <div class="text-xs text-slate-400 uppercase font-bold">Источник</div>
                            <div class="text-sm font-semibold">Встреча с клиентом</div>
                        </div>
                        <div class="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                            <!-- Smartphone Icon -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2 text-blue-400"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                            <div class="text-xs text-slate-400 uppercase font-bold">Источник</div>
                            <div class="text-sm font-semibold">Фото момента</div>
                        </div>
                        <div class="bg-blue-600 p-4 rounded-xl flex items-center justify-center text-center">
                          <span class="font-bold text-sm">Facont превращает это в контент</span>
                        </div>
                     </div>
                   </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Adaptation Demo (JS Powered) -->
    <section class="py-20 bg-slate-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center max-w-3xl mx-auto mb-12">
                <h2 class="text-3xl font-bold text-slate-900 mb-4">Адаптация под специфику бизнеса</h2>
                <p class="text-lg text-slate-600">
                    Один промпт не работает для всех. Система анализирует вашу индустрию.
                </p>
            </div>

            <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
                <!-- Tab Buttons -->
                <div class="flex border-b border-slate-200 overflow-x-auto" id="industry-tabs">
                    <button onclick="switchIndustry('tech')" id="tab-tech" class="tab-btn active flex-1 px-6 py-4 text-sm md:text-base font-bold whitespace-nowrap transition-colors text-slate-500 hover:bg-slate-50">
                        Tech-стартап
                    </button>
                    <button onclick="switchIndustry('consulting')" id="tab-consulting" class="tab-btn flex-1 px-6 py-4 text-sm md:text-base font-bold whitespace-nowrap transition-colors text-slate-500 hover:bg-slate-50">
                        B2B-консалтинг
                    </button>
                    <button onclick="switchIndustry('ecommerce')" id="tab-ecommerce" class="tab-btn flex-1 px-6 py-4 text-sm md:text-base font-bold whitespace-nowrap transition-colors text-slate-500 hover:bg-slate-50">
                        E-commerce
                    </button>
                </div>
                
                <!-- Content Area -->
                <div class="p-8 md:p-12">
                    <div class="grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 id="ind-title" class="text-2xl font-bold text-slate-900 mb-6">Tech-стартап</h3>
                            <div class="space-y-6">
                                <div>
                                    <div class="text-sm font-bold text-slate-400 uppercase mb-1">Цель</div>
                                    <div id="ind-goal" class="text-lg text-slate-800 font-medium">Инвесторы и media visibility</div>
                                </div>
                                <div>
                                    <div class="text-sm font-bold text-slate-400 uppercase mb-1">Фокус</div>
                                    <div id="ind-focus" class="text-lg text-slate-800 font-medium">Инновации, технологии, масштаб</div>
                                </div>
                                <div>
                                    <div class="text-sm font-bold text-slate-400 uppercase mb-1">Ключевые слова / Язык</div>
                                    <div id="ind-lang" class="text-blue-600 font-medium font-mono bg-blue-50 inline-block px-3 py-1 rounded">
                                        Vision, disruption, future of industry
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-slate-50 rounded-xl p-6 border border-slate-200">
                            <div class="flex items-center gap-3 mb-4">
                                <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">AI</div>
                                <span class="text-sm font-bold text-slate-500">Пример генерации заголовка</span>
                            </div>
                            <p id="ind-example" class="text-lg text-slate-800 italic leading-relaxed">
                                "Как наш алгоритм меняет правила игры в обработке данных..."
                            </p>
                            <div class="mt-4 flex gap-2">
                                <span class="h-2 w-16 bg-slate-200 rounded"></span>
                                <span class="h-2 w-10 bg-slate-200 rounded"></span>
                            </div>
                            <div class="mt-2 h-2 w-3/4 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Process Steps -->
    <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div class="text-center mb-16">
            <h2 class="text-3xl font-bold mb-4">Процесс создания</h2>
            <p class="text-slate-600">За каждым промптом — десятки тестов</p>
          </div>

          <div class="grid md:grid-cols-4 gap-8">
            <div class="relative p-6 border-l-2 border-blue-100 hover:border-blue-600 transition duration-300">
                <span class="text-5xl font-black text-slate-100 absolute top-0 right-4 -z-10">01</span>
                <h3 class="text-xl font-bold text-slate-900 mb-2">Исследование</h3>
                <p class="text-slate-600 text-sm">Анализ кейсов, паттернов и метрик в разных нишах.</p>
            </div>
            <div class="relative p-6 border-l-2 border-blue-100 hover:border-blue-600 transition duration-300">
                <span class="text-5xl font-black text-slate-100 absolute top-0 right-4 -z-10">02</span>
                <h3 class="text-xl font-bold text-slate-900 mb-2">Логика</h3>
                <p class="text-slate-600 text-sm">Создание структуры, механик вовлечения и стратегии.</p>
            </div>
            <div class="relative p-6 border-l-2 border-blue-100 hover:border-blue-600 transition duration-300">
                <span class="text-5xl font-black text-slate-100 absolute top-0 right-4 -z-10">03</span>
                <h3 class="text-xl font-bold text-slate-900 mb-2">Тестирование</h3>
                <p class="text-slate-600 text-sm">Проверка на 10+ бизнесах, 5-15 итераций.</p>
            </div>
            <div class="relative p-6 border-l-2 border-blue-100 hover:border-blue-600 transition duration-300">
                <span class="text-5xl font-black text-slate-100 absolute top-0 right-4 -z-10">04</span>
                <h3 class="text-xl font-bold text-slate-900 mb-2">Интеграция</h3>
                <p class="text-slate-600 text-sm">Релиз только при 100% уверенности в результате.</p>
            </div>
          </div>
        </div>
    </section>

    <!-- Target Audience -->
    <section class="py-20 bg-slate-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 class="text-3xl md:text-4xl font-bold mb-6 text-white">Для кого это?</h2>
                    <p class="text-slate-400 mb-8 text-lg">
                        82% клиентов доверяют компании, когда видят активность в соцсетях. Facont адаптируется под вашу роль.
                    </p>
                    <div class="space-y-6">
                        <div class="flex items-center gap-4">
                            <!-- CheckCircle2 Icon -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500 shrink-0"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                            <span class="text-lg font-medium">Фаундеры с личным брендом (стартапы, поиск инвестиций)</span>
                        </div>
                        <div class="flex items-center gap-4">
                            <!-- CheckCircle2 Icon -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500 shrink-0"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                            <span class="text-lg font-medium">Бизнес без публичного CEO (корпоративный контент)</span>
                        </div>
                        <div class="flex items-center gap-4">
                            <!-- CheckCircle2 Icon -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500 shrink-0"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                            <span class="text-lg font-medium">Эксперты и консультанты (продажа через экспертность)</span>
                        </div>
                        <div class="flex items-center gap-4">
                            <!-- CheckCircle2 Icon -->
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500 shrink-0"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                            <span class="text-lg font-medium">Агентства (ускорение процессов)</span>
                        </div>
                    </div>
                </div>
                <div class="bg-slate-800 p-8 rounded-3xl border border-slate-700">
                   <div class="mb-6">
                     <h3 class="text-xl font-bold mb-2 text-red-400 flex items-center gap-2">
                       <!-- XCircle Icon -->
                       <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                       Не подойдет
                     </h3>
                     <p class="text-slate-300">E-commerce с фокусом только на продукт (нужна другая механика, не контент-маркетинг).</p>
                   </div>
                   <div class="p-6 bg-slate-700/50 rounded-xl">
                     <p class="text-slate-300 italic">
                       "Контент руководителя получает в 8 раз больше вовлечения, чем корпоративный — но даже корпоративный контент нужно создавать системно."
                     </p>
                   </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Why Now / CTA -->
    <section class="py-24 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <!-- Background Pattern REMOVED -->
        
        <div class="max-w-5xl mx-auto px-4 text-center relative z-10">
            <div class="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-bold mb-6">
                2025: Год системного AI
            </div>
            <h2 class="text-4xl md:text-6xl font-extrabold mb-8 leading-tight">
                Перестаньте экспериментировать.<br/>Начните внедрять.
            </h2>
            <p class="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Пока одни используют generic промпты, другие строят системы. Через год разрыв станет недосягаемым.
            </p>
            
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <a href="https://aiaplace.com/facont/" class="bg-white text-blue-600 px-10 py-5 rounded-xl font-bold text-xl hover:bg-blue-50 transition shadow-2xl inline-block text-center">
                    Получить доступ к Facont
                </a>
                <button class="px-10 py-5 rounded-xl font-bold text-xl text-white border border-white/30 hover:bg-white/10 transition">
                    Смотреть демо
                </button>
            </div>
            
            <div class="mt-12 grid grid-cols-2 md:grid-cols-3 gap-8 text-center border-t border-white/20 pt-8 max-w-3xl mx-auto">
                <div>
                    <div class="text-3xl font-bold">4x</div>
                    <div class="text-blue-200 text-sm">Больше контента</div>
                </div>
                <div>
                    <div class="text-3xl font-bold">5x</div>
                    <div class="text-blue-200 text-sm">Меньше времени</div>
                </div>
                <div class="col-span-2 md:col-span-1">
                    <div class="text-3xl font-bold">0%</div>
                    <div class="text-blue-200 text-sm">Generic текстов</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
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

<!-- Interactivity Script -->
<script>
// Data for Industries
const industriesData = {
    tech: {
        title: "Tech-стартап",
        goal: "Инвесторы и media visibility",
        focus: "Инновации, технологии, масштаб",
        lang: "Vision, disruption, future of industry",
        example: "Как наш алгоритм меняет правила игры в обработке данных..."
    },
    consulting: {
        title: "B2B-консалтинг",
        goal: "Корпоративные клиенты и кейсы",
        focus: "Процессы, экспертиза, результаты",
        lang: "Strategy, ROI, transformation",
        example: "Пошаговая стратегия трансформации отдела продаж..."
    },
    ecommerce: {
        title: "E-commerce",
        goal: "Трафик и конверсия",
        focus: "Продукт, выгоды, social proof",
        lang: "Преимущества, отзывы, CTA",
        example: "Топ-5 причин, почему клиенты выбирают нашу новую коллекцию..."
    }
};

// Switch Industry Function
function switchIndustry(type) {
    const data = industriesData[type];
    
    // Update Content
    document.getElementById('ind-title').innerText = data.title;
    document.getElementById('ind-goal').innerText = data.goal;
    document.getElementById('ind-focus').innerText = data.focus;
    document.getElementById('ind-lang').innerText = data.lang;
    document.getElementById('ind-example').innerText = '"' + data.example + '"';

    // Update Tab Classes
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.classList.remove('active', 'bg-blue-50', 'text-blue-600', 'border-b-2', 'border-blue-600');
        tab.classList.add('text-slate-500');
    });

    const activeTab = document.getElementById('tab-' + type);
    activeTab.classList.remove('text-slate-500');
    activeTab.classList.add('active', 'bg-blue-50', 'text-blue-600', 'border-b-2', 'border-blue-600');
}

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if(menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });

        // Close menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }
});
</script>

<?php get_footer(); ?>