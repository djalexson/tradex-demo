# Docker plan

## Dev containers

- nginx
- backend php-fpm
- frontend node
- postgres
- redis
- mailpit

## Prod containers

- nginx
- backend php-fpm optimized
- frontend next standalone
- postgres
- redis
- queue worker
- scheduler

## Dev commands

```bash
cp .env.example .env
docker compose -f docker-compose.dev.yml up -d --build
```

Backend:

```bash
docker compose exec backend composer install
docker compose exec backend php artisan key:generate
docker compose exec backend php artisan migrate --seed
docker compose exec backend php artisan storage:link
```

Frontend:

```bash
docker compose exec frontend npm install
docker compose exec frontend npm run dev
```

## Prod commands

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

## Required env

Backend:

- APP_ENV
- APP_KEY
- APP_URL
- DB_CONNECTION
- DB_HOST
- DB_DATABASE
- DB_USERNAME
- DB_PASSWORD
- REDIS_HOST
- SANCTUM_STATEFUL_DOMAINS
- FRONTEND_URL

Frontend:

- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_APP_URL
- NEXT_PUBLIC_TRADINGVIEW_ENABLED=true
