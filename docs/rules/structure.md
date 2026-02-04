# Project Structure Rules

## File Limits
*   Max lines per file: 1000.
*   If a file grows larger, refactor into smaller sub-modules (e.g., `features/my-feature/ui.js` and `features/my-feature/logic.js`).

## Directory Organization
*   `facont/app/js/core/`: Essential system logic (API, Router, Bootstrap).
*   `facont/app/js/features/`: Specific functional modules (Reels, Post, etc.).
*   `facont/app/js/auth/`: Auth-related logic.
*   `facont/app/js/home/`: Home screen specific logic.
*   `facont/app/js/user/`: User profile management.

## Partial Views
*   Store HTML partials directly in `facont/app/`.
*   Keep partials self-contained (structure + specific inline styles if absolutely necessary, but prefer `facont.css`).
