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
    <?php
      // Cache busting for static hosting / CDN.
      // Ensures clients fetch updated CSS and assets after deploy.
      $facont_ver = @filemtime(__DIR__ . '/facont.css');
      if (!$facont_ver) { $facont_ver = time(); }

      // Commit info (optional): can be provided via ENV or commit.txt
      $facont_commit = getenv('FACONT_COMMIT');
      if (!$facont_commit) {
        $commit_path = __DIR__ . '/commit.txt';
        if (@file_exists($commit_path)) {
          $facont_commit = trim((string) @file_get_contents($commit_path));
        }
      }
      if (!$facont_commit) { $facont_commit = 'unknown'; }
    ?>
    <link rel="stylesheet" href="./facont.css?v=<?php echo $facont_ver; ?>" />
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
            <img class="facont-logo-img" src="./assets/Facont_logo_white.svg?v=<?php echo $facont_ver; ?>" alt="Facont" />
          </a>

          <ul class="facont-menu">
            <li class="facont-menu-item active" data-view="home">Home</li>
            <li class="facont-menu-item" data-view="onboarding_overview">Онбординг</li>
            <li class="facont-menu-item" data-view="idea_post">Идея в пост</li>
            <li class="facont-menu-item" data-view="stories_text">Сторис из текста</li>
            <li class="facont-menu-item" data-view="titles">Заголовки</li>
            <li class="facont-menu-item" data-view="carousel">Карусель</li>
            <li class="facont-menu-item" data-view="reels">Reels</li>
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
          <div id="facont-theme-bar" class="facont-theme-bar facont-hidden">
            <div class="facont-theme-title">Активная тема</div>
            <div id="facont-theme-preview" class="facont-theme-preview">Пока нет темы</div>
            <button id="facont-theme-new" class="btn secondary">Новая тема</button>
          </div>
          <div id="facont-main"></div>
        </main>
      </div>
    </template>

    <script>
      // Base URL for partials/relative assets.
      // IMPORTANT: keep it relative so deployments to different folders/domains work.
      window.FACONT_BASE_URL = '.';
      console.info('Facont commit:', '<?php echo htmlspecialchars($facont_commit, ENT_QUOTES); ?>');
    </script>

    <!-- Theme modal -->
    <div class="facont-modal" id="facont-theme-modal" style="display:none;">
      <div class="facont-modal-backdrop" data-theme-close></div>
      <div class="facont-modal-dialog" style="max-width: 420px;">
        <div class="facont-modal-header" style="border:none; padding-bottom:0;">
          <h2 style="font-size:18px; margin:0;">Новая тема</h2>
        </div>
        <div class="facont-modal-body" style="padding-top:10px;">
          <div id="facont-theme-confirm">
            <p style="margin-bottom:20px; color:var(--facont-text-muted);">Хочешь начать работать с новой темой?</p>
            <div style="display:flex; justify-content:flex-end; gap:10px;">
              <button class="btn secondary" id="facont-theme-cancel">Продолжить с текущей</button>
              <button class="btn" id="facont-theme-confirm-btn">Да</button>
            </div>
          </div>
          <div id="facont-theme-actions" style="display:none;">
            <p style="margin-bottom:16px; color:var(--facont-text-muted);">Выберите раздел для новой темы:</p>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">
              <button class="btn secondary" data-theme-target="idea_post">Идея в пост</button>
              <button class="btn secondary" data-theme-target="stories_text">Сторис из текста</button>
              <button class="btn secondary" data-theme-target="titles">Заголовки</button>
              <button class="btn secondary" data-theme-target="carousel">Карусель</button>
              <button class="btn secondary" data-theme-target="reels">Reels</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modules -->
    <script src="./js/core/api.js?v=<?php echo $facont_ver; ?>"></script>
    <script src="./js/auth/auth.js?v=<?php echo $facont_ver; ?>"></script>
    <script src="./js/home/home.js?v=<?php echo $facont_ver; ?>"></script>
    <script src="./js/onboarding/onboarding-config.js?v=<?php echo $facont_ver; ?>"></script>
    <script src="./js/onboarding/onboarding-engine.js?v=<?php echo $facont_ver; ?>"></script>
    <script src="./js/onboarding/onboarding.js?v=<?php echo $facont_ver; ?>"></script>
    <script src="./js/user/user.js?v=<?php echo $facont_ver; ?>"></script>
    <script src="./js/content/content.js?v=<?php echo $facont_ver; ?>"></script>
    <script src="./js/features/generic-generator.js?v=<?php echo $facont_ver; ?>"></script>
    <script src="./js/features/idea-post.js?v=<?php echo $facont_ver; ?>"></script>
    <script src="./js/features/stories-text.js?v=<?php echo $facont_ver; ?>"></script>
    <script src="./js/features/titles.js?v=<?php echo $facont_ver; ?>"></script>
    <script src="./js/features/carousel.js?v=<?php echo $facont_ver; ?>"></script>
    <script src="./js/features/reels.js?v=<?php echo $facont_ver; ?>"></script>
    <script src="./js/core/router.js?v=<?php echo $facont_ver; ?>"></script>
    <script src="./js/core/bootstrap.js?v=<?php echo $facont_ver; ?>"></script>
    <script src="./facont.js?v=<?php echo $facont_ver; ?>"></script>
  </body>
</html>
