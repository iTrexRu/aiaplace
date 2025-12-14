<?php
/*
Template Name: Facont App
*/
get_header();

$facont_dir = get_stylesheet_directory() . '/facont';
$facont_uri = get_stylesheet_directory_uri() . '/facont';
$facont_version = 0;

foreach ( array( 'facont.css', 'facont.js', 'js/core/api.js', 'js/auth/auth.js', 'js/onboarding/onboarding.js', 'js/user/user.js', 'js/content/content.js', 'js/features/generic-generator.js', 'js/features/stories-text.js', 'js/features/titles.js', 'js/features/carousel.js', 'js/features/reels.js', 'js/core/router.js', 'js/core/bootstrap.js' ) as $facont_asset ) {
  $asset_path = $facont_dir . '/' . $facont_asset;

  if ( file_exists( $asset_path ) ) {
    $facont_version = max( $facont_version, filemtime( $asset_path ) );
  }
}

if ( ! $facont_version ) {
  $facont_version = time();
}
?>

<link rel="stylesheet" href="<?php echo esc_url( $facont_uri . '/facont.css?ver=' . $facont_version ); ?>">

<div id="facont-root">
  <!-- JS will render app here -->
  <div style="padding:40px; text-align:center; color:#666;">Загрузка...</div>
</div>

<!-- Template for App Shell (hidden by default) -->
<template id="facont-app-template">
  <div class="facont-app">
    <aside class="facont-sidebar">
      <div>
        <div class="facont-logo">ИИ-контент</div>
        <div class="facont-subtitle">однопользовательский интерфейс</div>
      </div>

<ul class="facont-menu">
        <li class="facont-menu-item active" data-view="onboarding_overview">Онбординг</li>
        <li class="facont-menu-item" data-view="voice_post">Пост из голоса</li>
        <li class="facont-menu-item" data-view="stories_text">Сторис из текста</li>
        <li class="facont-menu-item" data-view="titles">Заголовки</li>
        <li class="facont-menu-item" data-view="carousel">Карусель</li>
        <li class="facont-menu-item" data-view="reels">Reels</li>
        <li class="facont-menu-item" data-view="nlp">НЛП</li>
        <li class="facont-menu-item" data-view="content_list">Готовый контент</li>
        <li class="facont-menu-item" data-view="settings">Настройки</li>
		<li class="facont-menu-item" data-view="profile">Профиль</li>
        <li class="facont-menu-item" data-action="logout" style="margin-top:auto; border-top:1px solid #374151;">Выход</li>
      </ul>

      <div class="facont-tg-box">
        <div style="margin-bottom:4px;">Нужны кастомные промпты или консультация?</div>
        <a href="https://t.me/venibak" target="_blank" rel="noopener noreferrer">
          Написать в Telegram
        </a>
      </div>
    </aside>

    <main class="facont-main">
      <div id="facont-main"></div>
    </main>
  </div>
</template>

<script>
  window.FACONT_BASE_URL = '<?php echo esc_js( $facont_uri ); ?>';
</script>
<script src="<?php echo esc_url( $facont_uri . '/js/core/api.js?ver=' . $facont_version ); ?>"></script>
<script src="<?php echo esc_url( $facont_uri . '/js/auth/auth.js?ver=' . $facont_version ); ?>"></script>
<script src="<?php echo esc_url( $facont_uri . '/js/onboarding/onboarding.js?ver=' . $facont_version ); ?>"></script>
<script src="<?php echo esc_url( $facont_uri . '/js/user/user.js?ver=' . $facont_version ); ?>"></script>
<script src="<?php echo esc_url( $facont_uri . '/js/content/content.js?ver=' . $facont_version ); ?>"></script>
<script src="<?php echo esc_url( $facont_uri . '/js/features/generic-generator.js?ver=' . $facont_version ); ?>"></script>
<script src="<?php echo esc_url( $facont_uri . '/js/features/stories-text.js?ver=' . $facont_version ); ?>"></script>
<script src="<?php echo esc_url( $facont_uri . '/js/features/titles.js?ver=' . $facont_version ); ?>"></script>
<script src="<?php echo esc_url( $facont_uri . '/js/features/carousel.js?ver=' . $facont_version ); ?>"></script>
<script src="<?php echo esc_url( $facont_uri . '/js/features/reels.js?ver=' . $facont_version ); ?>"></script>
<script src="<?php echo esc_url( $facont_uri . '/js/core/router.js?ver=' . $facont_version ); ?>"></script>
<script src="<?php echo esc_url( $facont_uri . '/js/core/bootstrap.js?ver=' . $facont_version ); ?>"></script>
<script src="<?php echo esc_url( $facont_uri . '/facont.js?ver=' . $facont_version ); ?>"></script>

<?php
get_footer();
