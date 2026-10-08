# Frontend structure

```
frontend/
  src/
    app/
      page.tsx
      login/page.tsx
      register/page.tsx
      dashboard/page.tsx
      markets/page.tsx
      markets/[symbol]/page.tsx
      portfolio/page.tsx
      history/page.tsx
      settings/page.tsx
    components/
      ui/
      layout/
        AppShell.tsx
        Sidebar.tsx
        Topbar.tsx
        MobileNav.tsx
      charts/
        TradingViewWidget.tsx
        MiniSparkline.tsx
      data/
        DataTable.tsx
        StatCard.tsx
    features/
      landing/
      auth/
      dashboard/
      markets/
      trading/
      portfolio/
      wallet/
      history/
    lib/
      api.ts
      cn.ts
      formatters.ts
      constants.ts
    services/
      auth.service.ts
      market.service.ts
      order.service.ts
      portfolio.service.ts
      wallet.service.ts
    stores/
      auth.store.ts
      ui.store.ts
    types/
      asset.ts
      order.ts
      trade.ts
      wallet.ts
      portfolio.ts
```

## UI components

### AppShell
Общая обертка кабинета: sidebar, topbar, content.

### Sidebar
Пункты:
- Главная
- Торговля
- Рынки
- Портфель
- Кошельки
- История
- Избранное
- Настройки

### TradingViewWidget
Компонент подключает TradingView widget через script. Принимает props:
- symbol
- theme
- interval
- height

### OrderForm
Props:
- asset
- quote
- wallet
- onSubmit

State:
- side
- type
- price
- quantity
- percent

### MarketCard
Отображает актив, цену, изменение, иконку и mini chart.

## Tailwind design tokens

Цвета:
- bg: #050816
- surface: #0B1020
- surface-2: #111827
- border: rgba(148, 163, 184, 0.16)
- text: #F8FAFC
- muted: #94A3B8
- primary: #4F46E5
- accent: #8B5CF6
- success: #10B981
- danger: #F43F5E

Эффекты:
- rounded-2xl
- shadow-xl
- border border-white/10
- bg-white/5
- backdrop-blur
