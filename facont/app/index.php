<?php
// Static PHP entrypoint for Facont App.
// Must work when deployed to any folder (site root or subfolder), therefore ALL URLs are relative.
?>
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Facont App</title>
    <link rel="stylesheet" href="./facont.css" />
  </head>
  <body>

    <div id="facont-root">
      <div class="facont-loading">Загрузка...</div>
    </div>

    <!-- Template for App Shell (hidden by default) -->
    <template id="facont-app-template">
      <div class="facont-app">
        <aside class="facont-sidebar">
          <a class="facont-brand" href="./" aria-label="Facont — главная">
            <img class="facont-logo-img" src="./assets/Facont_logo_white.svg" alt="Facont" />
          </a>

          <ul class="facont-menu">
            <li class="facont-menu-item active" data-view="home">Home</li>
            <li class="facont-menu-item" data-view="onboarding_overview">Онбординг</li>
            <li class="facont-menu-item" data-view="idea_post">Идея в пост</li>
            <li class="facont-menu-item" data-view="stories_text">Сторис из текста</li>
            <li class="facont-menu-item" data-view="titles">Заголовки</li>
            <li class="facont-menu-item" data-view="carousel">Карусель</li>
            <li class="facont-menu-item" data-view="reels">Reels</li>
            <li class="facont-menu-item" data-view="nlp">НЛП</li>
            <li class="facont-menu-item" data-view="content_list">Готовый контент</li>
            <li class="facont-menu-item" data-view="settings">Настройки</li>
            <li class="facont-menu-item" data-view="profile">Профиль</li>
            <li class="facont-menu-item" data-action="logout" style="margin-top:auto; border-top:1px solid var(--facont-border);">Выход</li>
          </ul>

          <div class="facont-tg-box">
            <div style="margin-bottom:4px;">Нужны кастомные промпты или консультация?</div>
            <a href="https://t.me/venibak" target="_blank" rel="noopener noreferrer">Написать в Telegram</a>
          </div>
        </aside>

        <main class="facont-main">
          <div id="facont-main"></div>
        </main>
      </div>
    </template>

    <script>
      // Base URL for partials/relative assets.
      // IMPORTANT: keep it relative so deployments to different folders/domains work.
      window.FACONT_BASE_URL = '.';
    </script>

    <!-- Modules -->
    <script src="./js/core/api.js"></script>
    <script src="./js/auth/auth.js"></script>
    <script src="./js/home/home.js"></script>
    <script src="./js/onboarding/onboarding-config.js"></script>
    <script src="./js/onboarding/onboarding-engine.js"></script>
    <script src="./js/onboarding/onboarding.js"></script>
    <script src="./js/user/user.js"></script>
    <script src="./js/content/content.js"></script>
    <script src="./js/features/generic-generator.js"></script>
    <script src="./js/features/idea-post.js"></script>
    <script src="./js/features/stories-text.js"></script>
    <script src="./js/features/titles.js"></script>
    <script src="./js/features/carousel.js"></script>
    <script src="./js/features/reels.js"></script>
    <script src="./js/core/router.js"></script>
    <script src="./js/core/bootstrap.js"></script>
    <script src="./facont.js"></script>
  </body>
</html>
