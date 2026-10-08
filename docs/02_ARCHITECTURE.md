# Architecture

## Общая схема

Frontend Next.js общается с Laravel API через HTTPS/API. Laravel отвечает за auth, пользователей, кошельки, демо-ордера, портфель, сделки и админку. PostgreSQL хранит данные. Redis используется для кэша, очередей и realtime событий.

```
Browser
  -> Next.js Frontend
  -> Laravel API
  -> PostgreSQL
  -> Redis
  -> Filament Admin
```

## Backend layers

```
app/
  Domain/
    Trading/
    Wallet/
    Market/
    User/
  Actions/
  Services/
  DTO/
  ValueObjects/
  Http/
    Controllers/
    Requests/
    Resources/
  Models/
  Filament/
```

## Frontend layers

```
src/
  app/
  components/
  features/
    landing/
    auth/
    dashboard/
    markets/
    trading/
    portfolio/
    wallet/
  lib/
  services/
  stores/
  types/
```

## Основной принцип

Контроллеры тонкие. Вся бизнес-логика находится в Actions/Services.

Пример:

- OrderController принимает запрос.
- StoreOrderRequest валидирует данные.
- PlaceDemoOrderAction выполняет бизнес-операцию.
- TradingService создает сделку, меняет кошелек, обновляет позицию.
- OrderResource возвращает ответ.
