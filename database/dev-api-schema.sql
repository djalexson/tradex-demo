create table if not exists users (
    id bigserial primary key,
    name varchar(120) not null,
    email varchar(190) not null unique,
    password varchar(255) not null,
    role varchar(24) not null default 'trader',
    kyc_status varchar(24) not null default 'pending',
    is_blocked boolean not null default false,
    last_login_at timestamp null,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

create table if not exists assets (
    id bigserial primary key,
    symbol varchar(32) not null unique,
    base_symbol varchar(24) not null,
    quote_symbol varchar(24) not null,
    name varchar(120) not null,
    asset_type varchar(32) not null,
    provider varchar(32) not null default 'demo',
    tradingview_symbol varchar(80) not null,
    is_active boolean not null default true,
    sort_order integer not null default 0,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

create table if not exists quotes (
    id bigserial primary key,
    asset_id bigint not null references assets(id) on delete cascade,
    price numeric(30, 12) not null,
    change_percent numeric(12, 4) not null default 0,
    high_24h numeric(30, 12),
    low_24h numeric(30, 12),
    volume_24h numeric(30, 12),
    captured_at timestamp not null default now()
);

create table if not exists wallets (
    id bigserial primary key,
    user_id bigint not null references users(id) on delete cascade,
    currency varchar(24) not null,
    available_balance numeric(30, 12) not null default 0,
    locked_balance numeric(30, 12) not null default 0,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    unique(user_id, currency)
);

create table if not exists orders (
    id bigserial primary key,
    user_id bigint not null references users(id) on delete cascade,
    asset_id bigint not null references assets(id) on delete cascade,
    side varchar(8) not null,
    type varchar(16) not null,
    status varchar(16) not null,
    price numeric(30, 12) not null,
    quantity numeric(30, 12) not null,
    total numeric(30, 12) not null,
    fee numeric(30, 12) not null default 0,
    filled_at timestamp null,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

create table if not exists trades (
    id bigserial primary key,
    user_id bigint not null references users(id) on delete cascade,
    order_id bigint not null references orders(id) on delete cascade,
    asset_id bigint not null references assets(id) on delete cascade,
    side varchar(8) not null,
    price numeric(30, 12) not null,
    quantity numeric(30, 12) not null,
    total numeric(30, 12) not null,
    fee numeric(30, 12) not null default 0,
    executed_at timestamp not null default now()
);

create table if not exists positions (
    id bigserial primary key,
    user_id bigint not null references users(id) on delete cascade,
    asset_id bigint not null references assets(id) on delete cascade,
    quantity numeric(30, 12) not null default 0,
    average_entry_price numeric(30, 12) not null default 0,
    realized_pnl numeric(30, 12) not null default 0,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now(),
    unique(user_id, asset_id)
);

create table if not exists transactions (
    id bigserial primary key,
    user_id bigint not null references users(id) on delete cascade,
    wallet_id bigint not null references wallets(id) on delete cascade,
    type varchar(32) not null,
    amount numeric(30, 12) not null,
    currency varchar(24) not null,
    status varchar(24) not null,
    meta jsonb,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

insert into users (name, email, password, role, kyc_status, is_blocked)
values
    ('TradeX Admin', 'admin@tradex.local', '$2y$10$devpassword', 'admin', 'approved', false),
    ('Demo Trader', 'trader@tradex.local', '$2y$10$devpassword', 'trader', 'approved', false)
on conflict (email) do update set name = excluded.name, role = excluded.role, kyc_status = excluded.kyc_status;

insert into assets (symbol, base_symbol, quote_symbol, name, asset_type, provider, tradingview_symbol, is_active, sort_order)
values
    ('BTCUSDT', 'BTC', 'USDT', 'Bitcoin', 'crypto', 'demo', 'BINANCE:BTCUSDT', true, 1),
    ('ETHUSDT', 'ETH', 'USDT', 'Ethereum', 'crypto', 'demo', 'BINANCE:ETHUSDT', true, 2),
    ('EURUSD', 'EUR', 'USD', 'Euro / US Dollar', 'forex', 'demo', 'FX:EURUSD', true, 3),
    ('AAPL', 'AAPL', 'USD', 'Apple Inc.', 'stock', 'demo', 'NASDAQ:AAPL', true, 4),
    ('TSLA', 'TSLA', 'USD', 'Tesla Inc.', 'stock', 'demo', 'NASDAQ:TSLA', true, 5),
    ('SPX500', 'SPX', 'USD', 'S&P 500', 'index', 'demo', 'SP:SPX', true, 6),
    ('GOLD', 'XAU', 'USD', 'Gold Spot', 'commodity', 'demo', 'OANDA:XAUUSD', true, 7)
on conflict (symbol) do update set name = excluded.name, tradingview_symbol = excluded.tradingview_symbol;

insert into quotes (asset_id, price, change_percent, high_24h, low_24h, volume_24h, captured_at)
select id, price, change_percent, price * 1.025, price * 0.975, volume, now()
from (
    values
        ('BTCUSDT', 106420.00::numeric, 2.84::numeric, 48000000000::numeric),
        ('ETHUSDT', 3840.00::numeric, 1.47::numeric, 22700000000::numeric),
        ('EURUSD', 1.0872::numeric, -0.18::numeric, 112000000000::numeric),
        ('AAPL', 214.15::numeric, 0.74::numeric, 9400000000::numeric),
        ('TSLA', 187.62::numeric, -1.22::numeric, 14100000000::numeric),
        ('SPX500', 5432.18::numeric, 0.31::numeric, 214000000000::numeric),
        ('GOLD', 2337.80::numeric, 0.52::numeric, 63000000000::numeric)
) as seed(symbol, price, change_percent, volume)
join assets on assets.symbol = seed.symbol
where not exists (select 1 from quotes where quotes.asset_id = assets.id);

insert into wallets (user_id, currency, available_balance, locked_balance)
select id, 'USDT', case when email = 'trader@tradex.local' then 25000 else 0 end, 0
from users
where email in ('admin@tradex.local', 'trader@tradex.local')
on conflict (user_id, currency) do update set available_balance = excluded.available_balance;
