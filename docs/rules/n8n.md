# n8n Workflow Standards

## General
*   **Router Pattern**: Используйте единый Router (Switch node) для маршрутизации команд (`cmd`).
*   **Unified Response**: Все ветки должны сходиться в одну финальную ноду `Respond to Webhook`.
*   **Response Preparation**: Перед финальным ответом используйте ноду `Code` для форматирования JSON, который ожидает фронтенд.

## Database (Postgres)
*   **Direct SQL**: Не используйте параметры `$1, $2`. Вставляйте значения переменных n8n напрямую в SQL запрос (например, `WHERE id = {{$node["Auth"].json.id}}`).
*   **JSON Handling**: При вставке JSON используйте одинарные кавычки: `'{{JSON.stringify($json)}}'`.

## AI / LLM
*   **AI Agent**: Всегда используйте ноду `AI Agent` (Basic или Chain), подключая к ней модель как Tool. Не используйте прямые ноды провайдеров (OpenAI, Anthropic) для генерации.
*   **Output Parsing**: Используйте ноду `Code` после AI для очистки от markdown (```json ... ```), если агент не парсит ответ автоматически.
