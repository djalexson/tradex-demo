# Database schema

## tables

- users
- assets
- quotes
- wallets
- orders
- trades
- positions
- transactions
- watchlists
- notifications
- audit_logs
- platform_settings

## indexes

assets:
- unique(symbol)
- index(asset_type)
- index(is_active)

quotes:
- index(asset_id, captured_at)

wallets:
- unique(user_id, currency)

orders:
- index(user_id, status)
- index(asset_id, status)
- index(created_at)

trades:
- index(user_id, executed_at)
- index(asset_id, executed_at)

positions:
- unique(user_id, asset_id)

transactions:
- index(user_id, type)
- index(status)
- index(created_at)

## seed demo data

Assets:
- BTC/USDT
- ETH/USDT
- EUR/USD
- AAPL
- TSLA
- SPX500
- GOLD

Demo admin:
- admin@tradex.local / password

Demo trader:
- trader@tradex.local / password
- balance: 25,000 USDT
