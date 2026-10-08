# TradeX MVP — план разработки для Codex

Цель: быстро собрать демонстрационную торговую платформу для клиента: лендинг, личный кабинет, котировки, графики, демо-торговля, портфель, история сделок и админка.

Важно: это MVP/демо-платформа. Реальная торговля акциями, валютами и криптой требует брокерских API, KYC/AML, юридической модели, лицензий, платежной инфраструктуры и отдельного security-аудита.

## Стек

- Frontend: Next.js, TypeScript, Tailwind CSS, shadcn/ui, Zustand, React Query
- Backend: Laravel 11/12, PHP 8.3, Laravel Sanctum, Laravel Queues
- Admin: Filament Admin Panel
- Database: PostgreSQL
- Cache/queue/realtime: Redis
- Realtime: Laravel Reverb или Soketi/Pusher compatible
- Charts: TradingView Widget для MVP
- Containers: Docker Compose для dev и prod
- Web server: Nginx

## Основные модули

1. Landing page
2. Auth
3. User cabinet
4. Markets / quotes
5. Asset page with TradingView chart
6. Demo trading engine
7. Portfolio
8. Wallets / demo balance
9. Orders / trades history
10. Admin panel
11. Notifications
12. Security / audit logs

## Что должно быть готово для показа клиенту

- Современный dark fintech дизайн
- Главная страница с CTA
- Личный кабинет трейдера
- Реестр активов: BTC/USDT, ETH/USDT, EUR/USD, AAPL, TSLA, SPX500
- График TradingView
- Демо Buy/Sell
- Демо баланс USDT/USD
- История сделок
- Портфель с прибылью/убытком
- Админка: пользователи, балансы, активы, ордера, сделки, настройки

## Запуск текущего frontend MVP

```bash
cd frontend
npm install
npm run dev
```

Если npm на Windows падает с `UNABLE_TO_VERIFY_LEAF_SIGNATURE`, запустите команды с системными сертификатами:

```powershell
$env:NODE_OPTIONS='--use-system-ca'
npm install
npm run dev
```

Локальный адрес: http://127.0.0.1:3000

Готовые демо-экраны:

- `/` — landing page
- `/login` и `/register` — auth mock screens
- `/dashboard` — торговый терминал
- `/markets` — список активов
- `/markets/btc-usdt` — страница актива с TradingView widget
- `/portfolio` — портфель и P/L
- `/history` — история сделок
- `/settings` — настройки профиля и security states

## Следующий backend/Docker запуск

Docker Desktop должен быть запущен.

```bash
cp backend/.env.example backend/.env
docker compose -f docker-compose.dev.yml up -d --build
docker compose -f docker-compose.dev.yml exec backend composer install
docker compose -f docker-compose.dev.yml exec backend php artisan key:generate
docker compose -f docker-compose.dev.yml exec backend php artisan migrate --seed
```

API будет доступен на `http://127.0.0.1:8080/api/v1`, frontend — на `http://127.0.0.1:3000`.

Важно: backend-код уже разложен по Laravel-структуре, но базовый Laravel bootstrap (`artisan`, `bootstrap/`, `config/`, `public/index.php`) появится после установки/инициализации Laravel skeleton через Composer внутри контейнера.

## Рабочий dev API без Composer

Из-за локальной SSL-проблемы Packagist backend дополнительно имеет временный PHP-FPM API в `backend/public/index.php`. Он уже работает в Docker через nginx:

- `GET /api/v1/health`
- `GET /api/v1/markets`
- `GET /api/v1/markets/BTCUSDT`
- `GET /api/v1/wallets` с `Authorization: Bearer demo-token`
- `POST /api/v1/orders` с `Authorization: Bearer demo-token`
- `GET /api/v1/portfolio/summary` с `Authorization: Bearer demo-token`

Схема и демо-данные для него лежат в `database/dev-api-schema.sql`.

Frontend уже подключен к этому API для:

- market ticker и markets page;
- wallet balance в topbar;
- dashboard order form;
- portfolio summary и positions;
- orders/history.
- temporary admin panel на `/admin`.
- login/register flow с сохранением demo token в браузере.

Демо-доступы:

- trader: `trader@tradex.local` / `password`
- admin: `admin@tradex.local` / `password`

Admin API endpoints:

- `GET /api/v1/admin/overview` с `Authorization: Bearer admin-token`
- `GET /api/v1/admin/users` с `Authorization: Bearer admin-token`
- `GET /api/v1/admin/assets` с `Authorization: Bearer admin-token`
- `GET /api/v1/admin/orders` с `Authorization: Bearer admin-token`
- `GET /api/v1/admin/settings` с `Authorization: Bearer admin-token`

## Публикация демо на GitHub Pages

GitHub Pages публикует статическую клиентскую версию без PHP, PostgreSQL и Redis. Для показа клиенту frontend автоматически переключается в demo mode: вход, торговые операции, портфель и админ-панель работают на локальных данных в браузере.

1. Создайте пустой GitHub-репозиторий и отправьте ветку `main`.
2. В настройках репозитория откройте `Settings -> Pages` и выберите источник `GitHub Actions`.
3. Workflow `.github/workflows/deploy-pages.yml` соберет и опубликует сайт автоматически.

Для ручного запуска откройте вкладку `Actions`, выберите `Deploy TradeX demo to GitHub Pages` и нажмите `Run workflow`.
