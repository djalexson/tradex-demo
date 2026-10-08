# TODO MVP checklist

## Phase 1 — Bootstrap

- [ ] Создать monorepo structure
- [x] Создать Docker Compose dev
- [ ] Создать Laravel backend
- [x] Создать Next.js frontend
- [x] Подключить PostgreSQL
- [x] Подключить Redis
- [ ] Настроить Tailwind
- [ ] Настроить shadcn/ui
- [ ] Настроить ENV examples

## Phase 2 — Backend core

- [x] Миграции users/assets/quotes/wallets/orders/trades/positions/transactions
- [x] Models + relations
- [x] Seeders demo assets
- [x] Seeders demo admin/trader
- [x] AuthController
- [ ] Sanctum auth
- [x] Temporary demo token auth
- [x] Market API
- [x] Wallet API
- [x] Order API
- [x] Portfolio API
- [x] Temporary PHP-FPM dev API без Composer

## Phase 3 — Trading logic

- [x] Money value object
- [x] Decimal helper
- [x] DemoTradingService
- [x] PlaceDemoOrderAction
- [x] Fee calculation
- [x] Position update
- [x] Transaction records
- [x] Trade history
- [x] Balance check

## Phase 4 — Admin

- [ ] Install Filament
- [x] Temporary Admin dashboard
- [x] Admin users view
- [x] Admin assets view
- [x] Admin orders view
- [x] Admin platform settings view
- [ ] UserResource
- [ ] AssetResource
- [ ] WalletResource
- [ ] OrderResource
- [ ] TradeResource
- [ ] TransactionResource
- [ ] PlatformSettingsResource
- [x] Dark mode branding

## Phase 5 — Frontend

- [x] Landing page
- [x] Login page
- [x] Register page
- [x] Login/register connected to API
- [x] Dashboard layout
- [x] Sidebar/topbar
- [x] Market ticker
- [x] Markets page
- [x] Asset detail page
- [x] TradingView chart widget
- [x] Order form
- [x] Portfolio page
- [x] History page
- [x] Settings page
- [x] Подключить frontend к live dev API

## Phase 6 — Polish

- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [x] Toast notifications
- [x] Mobile adaptive
- [x] Demo data realistic
- [x] README launch instruction
- [ ] Screenshots for client presentation
