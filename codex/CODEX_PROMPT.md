# Prompt для Codex

Ты senior fullstack developer. Нужно реализовать демо-платформу TradeX по архитектуре из этого архива.

Пиши код аккуратно, как production-ready MVP:

- TypeScript strict mode на фронте
- PHP typed properties, DTO, Actions, Services на backend
- Чистая структура директорий
- SOLID, простые интерфейсы, понятные имена классов
- Никакой бизнес-логики в контроллерах
- Вся торговая логика через сервисы и actions
- Все модели с fillable/casts/relations/scopes
- Миграции, factories, seeders обязательны
- API ответы через Resources
- Валидация через FormRequest
- Ошибки через единый формат JSON
- Tailwind components должны быть переиспользуемыми
- Для финансовых значений не использовать float, только decimal/string/value objects
- MVP должен работать в Docker
- Для демо-торговли использовать paper trading, не подключать реальные деньги

Главная задача: быстро получить красивый и понятный демо-продукт для презентации клиенту.

Порядок работы:

1. Поднять Docker окружение
2. Создать Laravel API + Filament admin
3. Создать Next.js frontend
4. Настроить auth через Sanctum
5. Реализовать сущности: User, Wallet, Asset, Quote, Order, Trade, Position, Transaction
6. Сделать seed демо-активов и демо-пользователя
7. Сделать API для markets, order create, portfolio, trades
8. Сделать UI: landing, dashboard, market page, portfolio, history
9. Сделать Filament resources
10. Проверить todo checklist

Не усложняй. Реальные брокерские API оставить как интерфейс-заглушку MarketDataProviderInterface.
