# Code Conventions

## Naming
*   **Files**: Kebab-case (`idea-post.js`, `content-list.html`).
*   **Variables/Functions**: CamelCase (`facontInitHome`, `currentUser`).
*   **Global Functions**: Prefix `facont` (`facontCallAPI`, `facontShowView`) to avoid global scope pollution.
*   **HTML IDs**: Kebab-case with prefix (`facont-home-title`).

## JavaScript
*   **Modules**: Each functionality in its own file in `app/js/`.
*   **Initialization**: Each module should export an init function (e.g., `window.facontInitMyFeature = function() {...}`).
*   **Async/Await**: Use `async/await` for API calls instead of `.then()`.
*   **Error Handling**: Wrap async calls in `try/catch`. Display user-friendly errors in the UI.

## Comments
*   Use JSDoc-style comments for complex functions.
*   Comment sections of code (e.g., `// === Auth Logic ===`).
