# Описание Функций

## Core Modules

### `api.js`
*   `facontCallAPI(cmd, data, options)`: Основная функция для отправки запросов к n8n.
    *   `cmd`: Строка команды (например, 'auth_login', 'content-list').
    *   `data`: Объект с данными запроса.
    *   Автоматически добавляет заголовок `X-Session-ID` если есть сессия.
    *   Обрабатывает 401 (redirect to login) и другие ошибки.
*   `facontLoadPartial(relativePath)`: Загружает HTML-фрагмент (partial) по пути и вставляет его в `#facont-main`.
*   `facontLoadPartialStr(relativePath)`: Загружает HTML-фрагмент и возвращает его как строку (без вставки в DOM).

### `router.js`
*   `facontShowView(view, options)`: Главная функция навигации.
    *   `view`: Идентификатор экрана (например, 'home', 'settings', 'idea_post').
    *   Загружает соответствующий partial.
    *   Вызывает соответствующую функцию инициализации (например, `facontInitHome`).
    *   Обновляет URL и History API.
*   `facontGetRouteFromLocation()`: Парсит текущий URL и возвращает объект `{ view, id }`.

### `bootstrap.js`
*   `facontRenderApp()`: Рендерит основную оболочку приложения (Sidebar + Main Area) из шаблона `#facont-app-template`.
*   `facontInitAuth()`: Проверяет текущую сессию (`auth_me`). Если успех — рендерит приложение, иначе — редирект на логин.
*   `facontLogout()`: Выход из системы (API call + очистка localStorage).

## Feature Modules

### `home.js`
*   `facontInitHome()`: Инициализация главного экрана. Проверяет статус онбординга пользователя и отображает соответствующие кнопки действий (продолжить настройку или генераторы).

### `auth.js`
*   `facontShowAuth(mode)`: Переключает экраны авторизации (login/register).
*   `facontInitLogin()`: Логика формы входа.

### `content.js`
*   `facontInitContentList()`: Загружает и отображает таблицу с готовым контентом.
*   `facontInitContentReview(id)`: Отображает детальный просмотр и редактирование единицы контента.
