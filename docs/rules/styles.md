# Frontend Styles Guidelines

## CSS Variables
Используйте CSS-переменные для темизации. Основные переменные определены в `:root` в файле `facont.css`.

### Цветовая Схема
*   **Фон**:
    *   `--facont-bg-app`: `#f5f5f5` (основной фон приложения).
    *   `--facont-bg-card`: `#ffffff` (фон карточек и модалок).
    *   `--facont-bg-sidebar`: `#140194` (темно-синий, сайдбар).
    *   `--facont-bg-sidebar-hover`: `#2a2a2a` (темный, наведение в меню).
*   **Текст**:
    *   `--facont-text`: `#1a1a1a` (основной текст).
    *   `--facont-text-muted`: `#666666` (вторичный текст, подписи).
    *   `--facont-text-on-dark`: `#ffffff` (текст на темном фоне).
*   **Акцент (Primary)**:
    *   `--facont-primary`: `#e6f50a` (ярко-желтый/лайм).
    *   `--facont-primary-hover`: `#d4e309`.
    *   `--facont-btn-bg`: `#dceb00` (фон кнопок).
*   **Статус**:
    *   `--facont-danger`: `#e11d48` (ошибки, уведомления).
    *   `--facont-success`: `#e6f50a` (используется как цвет успеха в некоторых контекстах).

## Style Guide: UI Элементы

### Кнопки
*   **Классы**: `.facont-btn` или `.btn`.
*   **Primary**: `.facont-btn` (желтый фон, черный текст).
*   **Secondary**: `.facont-btn.secondary` (прозрачный фон, рамка, темный текст).
*   **Состояния**: `:hover` (затемнение), `:active` (смещение вниз), `:disabled` (прозрачность).

### Поля Ввода (Inputs)
*   Применяется глобально к `input`, `textarea`, `select` внутри `.facont-card` или `.facont-modal-body`.
*   **Стиль**: Скругление 6px, рамка 1px solid `--facont-border`, отступы 8px 10px.
*   **Фокус**: Синяя рамка (`--facont-focus`) и тень (`--facont-shadow-focus`).

### Карточки (Cards)
*   **Класс**: `.facont-card` (или `.card`).
*   **Стиль**: Белый фон, тень (`--facont-shadow-card`), скругление 10px, паддинг 20px 18px.
*   **Типографика внутри**:
    *   `h1`: 22px, margin-bottom 8px.
    *   `h2`: 18px, margin-bottom 8px.
    *   `p`, `.facont-subtitle`: 14px, цвет `--facont-text-muted`.

### Модальные Окна (Modals)
*   **Структура**:
    ```html
    <div class="facont-modal">
      <div class="facont-modal-backdrop"></div>
      <div class="facont-modal-dialog">
        <div class="facont-modal-header">...</div>
        <div class="facont-modal-body">...</div>
      </div>
    </div>
    ```
*   **Z-Index**: 9999.

## BEM-like Naming
Используйте подход "Блок-Элемент" с префиксом `facont-` для предотвращения конфликтов.

*   Блок: `.facont-card`
*   Элемент: `.facont-card-title`, `.facont-card-body`
*   Модификатор: `.facont-btn-primary`, `.facont-hidden`

## Utility Classes
*   `.facont-mt-10`, `.facont-mt-16` (margin-top)
*   `.facont-text-center`
*   `.facont-flex`, `.facont-gap-10`
*   `.facont-hidden` (display: none !important)
