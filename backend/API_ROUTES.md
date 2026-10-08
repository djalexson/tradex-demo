# API routes

Base prefix: /api/v1

## Auth

POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me

## Markets

GET /markets
GET /markets/{symbol}
GET /markets/{symbol}/quote
GET /markets/watchlist
POST /markets/watchlist/{asset}
DELETE /markets/watchlist/{asset}

## Trading

POST /orders
GET /orders
GET /orders/{order}
POST /orders/{order}/cancel
GET /trades

## Portfolio

GET /portfolio
GET /portfolio/positions
GET /portfolio/summary

## Wallets

GET /wallets
GET /wallets/{currency}
POST /wallets/demo-deposit

## Notifications

GET /notifications
POST /notifications/{id}/read

## Response format

Success:

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation error",
  "errors": {}
}
```
