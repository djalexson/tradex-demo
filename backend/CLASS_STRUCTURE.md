# Backend class structure

## Models

### User
Поля:
- id
- name
- email
- password
- role: trader/admin
- kyc_status: pending/approved/rejected
- is_blocked
- last_login_at

Связи:
- hasMany Wallet
- hasMany Order
- hasMany Trade
- hasMany Position

### Asset
Поля:
- id
- symbol: BTCUSDT
- base_symbol: BTC
- quote_symbol: USDT
- name: Bitcoin
- asset_type: crypto/stock/forex/index/commodity
- provider: tradingview/demo/alpaca/binance
- tradingview_symbol
- is_active
- sort_order

### Wallet
Поля:
- id
- user_id
- currency
- available_balance decimal(30, 12)
- locked_balance decimal(30, 12)

Методы:
- deposit(Money $amount)
- withdraw(Money $amount)
- lock(Money $amount)
- unlock(Money $amount)

### Quote
Поля:
- id
- asset_id
- price decimal(30, 12)
- change_percent decimal(12, 4)
- high_24h
- low_24h
- volume_24h
- captured_at

### Order
Поля:
- id
- user_id
- asset_id
- side: buy/sell
- type: market/limit
- status: pending/filled/cancelled/rejected
- price decimal(30, 12)
- quantity decimal(30, 12)
- total decimal(30, 12)
- fee decimal(30, 12)
- filled_at

### Trade
Поля:
- id
- user_id
- order_id
- asset_id
- side
- price
- quantity
- total
- fee
- executed_at

### Position
Поля:
- id
- user_id
- asset_id
- quantity decimal(30, 12)
- average_entry_price decimal(30, 12)
- realized_pnl decimal(30, 12)

### Transaction
Поля:
- id
- user_id
- wallet_id
- type: deposit/withdraw/trade_buy/trade_sell/fee/adjustment
- amount decimal(30, 12)
- currency
- status
- meta json

## Services

### DemoTradingService
Методы:
- executeMarketBuy(User $user, Asset $asset, Money $amount): TradeResultDTO
- executeMarketSell(User $user, Asset $asset, Decimal $quantity): TradeResultDTO
- calculateFee(Money $total): Money
- updatePosition(User $user, Asset $asset, Trade $trade): Position

### PortfolioService
Методы:
- getSummary(User $user): PortfolioSummaryDTO
- getPositions(User $user): Collection
- calculateUnrealizedPnl(Position $position, Quote $quote): Money

### MarketDataService
Методы:
- getAssets(): Collection
- getLatestQuote(Asset $asset): QuoteDTO
- syncDemoQuotes(): void

## Actions

- PlaceDemoOrderAction
- CancelOrderAction
- AdjustUserBalanceAction
- CreateDemoUserAction
- SyncQuotesAction

## DTO

- OrderData
- TradeResultDTO
- QuoteDTO
- PortfolioSummaryDTO
- PositionDTO
- WalletBalanceDTO

## Value Objects

### Money
- amount string
- currency string
- plus()
- minus()
- multiply()
- isGreaterThan()
- isLessThan()

### DecimalValue
Использовать для quantity и price, чтобы не работать с float.
