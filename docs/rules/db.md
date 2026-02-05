# Database Schema (PostgreSQL)

## Tables

### `email_verification_tokens`
*   `id` (uuid): PK, default `gen_random_uuid()`.
*   `user_id` (integer): NOT NULL.
*   `token` (text): NOT NULL.
*   `expires_at` (timestamp without time zone): NOT NULL.
*   `used_at` (timestamp without time zone): NULLABLE.

### `generations`
*   `id` (integer): PK, auto-increment.
*   `user_id` (integer): NOT NULL.
*   `user_prompt` (text): NOT NULL.
*   `system_prompt` (text): NOT NULL.
*   `ai_response` (text): NOT NULL.
*   `created_at` (timestamp with time zone): default `now()`.
*   `type` (text): NULLABLE.

### `onboarding_entries`
*   `id` (integer): PK, auto-increment.
*   `user_id` (integer): NOT NULL.
*   `step_code` (text): NOT NULL.
*   `input_text` (text): NULLABLE.
*   `ai_output` (text): NULLABLE.
*   `meta` (jsonb): NULLABLE.
*   `created_at` (timestamp with time zone): default `now()`.
*   `updated_at` (timestamp with time zone): default `now()`.

### `password_reset_tokens`
*   `id` (uuid): PK, default `gen_random_uuid()`.
*   `user_id` (integer): NOT NULL.
*   `token` (text): NOT NULL.
*   `expires_at` (timestamp without time zone): NOT NULL.
*   `used_at` (timestamp without time zone): NULLABLE.

### `prompts`
*   `slug` (varchar(255)): PK.
*   `content` (text): NOT NULL.
*   `updated_at` (timestamp without time zone): default `now()`.

### `sessions`
*   `id` (text): PK, default random hex.
*   `user_id` (integer): NOT NULL.
*   `created_at` (timestamp without time zone): default `now()`.
*   `expires_at` (timestamp without time zone): NOT NULL.
*   `user_agent` (text): NULLABLE.
*   `ip_address` (text): NULLABLE.

### `user_links`
*   `id` (integer): PK, auto-increment.
*   `user_id` (integer): NOT NULL.
*   `link` (text): NOT NULL.
*   `type` (text): default `''`.
*   `created_at` (timestamp with time zone): default `now()`.

### `user_prompts`
*   `id` (bigint): PK, auto-increment.
*   `user_id` (bigint): NOT NULL.
*   `title` (text): NOT NULL.
*   `prompt_text` (text): NOT NULL.
*   `created_at` (timestamp with time zone): default `now()`.
*   `updated_at` (timestamp with time zone): default `now()`.

### `daily_ideas`
*   `id` (serial): PK.
*   `user_id` (integer): NOT NULL.
*   `date` (date): NOT NULL.
*   `content` (jsonb): NOT NULL.
*   `created_at` (timestamp with time zone): default `now()`.
*   `UNIQUE (user_id, date)`.

### `users`
*   `id` (integer): PK, auto-increment.
*   `first_name` (text): NULLABLE.
*   `last_name` (text): NULLABLE.
*   `website_url` (text): NULLABLE.
*   `company_info` (text): NULLABLE.
*   `profession` (text): NULLABLE.
*   `location` (text): NULLABLE.
*   `favorite_movie` (text): NULLABLE.
*   `language` (text): NULLABLE.
*   `style_example` (text): NULLABLE.
*   `style_prompt` (text): NULLABLE.
*   `created_at` (timestamp with time zone): default `now()`.
*   `updated_at` (timestamp with time zone): default `now()`.
*   `onboarding` (jsonb): NOT NULL, default `'{}'`.
*   `email` (text): NULLABLE.
*   `password` (text): NULLABLE.
*   `telegram_id` (bigint): NULLABLE.
*   `telegram_account` (text): NULLABLE.
*   `openai_key` (text): NULLABLE.
*   `gemini_key` (text): NULLABLE.
*   `claude_key` (text): NULLABLE.
*   `preferred_ai` (text): NULLABLE.
*   `password_hash` (text): NULLABLE.
*   `is_email_verified` (boolean): default `false`.
*   `tariff` (text): default `'free'`.
*   `tariff_expires_at` (timestamp with time zone): NULLABLE.
