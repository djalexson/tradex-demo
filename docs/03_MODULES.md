# Modules

## Landing

Файлы:

- frontend/src/app/page.tsx
- frontend/src/features/landing/components/HeroSection.tsx
- frontend/src/features/landing/components/MarketTicker.tsx
- frontend/src/features/landing/components/FeatureCards.tsx
- frontend/src/features/landing/components/PlatformPreview.tsx
- frontend/src/features/landing/components/SecuritySection.tsx
- frontend/src/features/landing/components/CTASection.tsx

## Auth

Файлы:

- frontend/src/app/login/page.tsx
- frontend/src/app/register/page.tsx
- backend/app/Http/Controllers/Api/AuthController.php
- backend/app/Http/Requests/Auth/LoginRequest.php
- backend/app/Http/Requests/Auth/RegisterRequest.php

## Dashboard

Файлы:

- frontend/src/app/dashboard/page.tsx
- frontend/src/features/dashboard/components/DashboardHeader.tsx
- frontend/src/features/dashboard/components/BalanceCard.tsx
- frontend/src/features/dashboard/components/PortfolioChart.tsx
- frontend/src/features/dashboard/components/RecentTradesTable.tsx
- frontend/src/features/dashboard/components/WatchlistCard.tsx

## Markets

Файлы:

- frontend/src/app/markets/page.tsx
- frontend/src/app/markets/[symbol]/page.tsx
- backend/app/Http/Controllers/Api/MarketController.php
- backend/app/Domain/Market/Services/MarketDataService.php
- backend/app/Domain/Market/Contracts/MarketDataProviderInterface.php

## Trading

Файлы:

- frontend/src/features/trading/components/TradingPanel.tsx
- frontend/src/features/trading/components/OrderForm.tsx
- frontend/src/features/trading/components/OrderTypeSelect.tsx
- frontend/src/features/trading/components/TradingViewChart.tsx
- backend/app/Http/Controllers/Api/OrderController.php
- backend/app/Actions/Trading/PlaceDemoOrderAction.php
- backend/app/Domain/Trading/Services/DemoTradingService.php

## Portfolio

Файлы:

- frontend/src/app/portfolio/page.tsx
- frontend/src/features/portfolio/components/PortfolioSummary.tsx
- frontend/src/features/portfolio/components/PositionsTable.tsx
- backend/app/Http/Controllers/Api/PortfolioController.php
- backend/app/Domain/Trading/Services/PortfolioService.php

## Admin

Файлы:

- backend/app/Filament/Resources/UserResource.php
- backend/app/Filament/Resources/AssetResource.php
- backend/app/Filament/Resources/WalletResource.php
- backend/app/Filament/Resources/OrderResource.php
- backend/app/Filament/Resources/TradeResource.php
- backend/app/Filament/Resources/TransactionResource.php
