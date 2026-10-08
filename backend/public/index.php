<?php

declare(strict_types=1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function db(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $host = getenv('DB_HOST') ?: 'postgres';
        $database = getenv('DB_DATABASE') ?: 'tradex';
        $username = getenv('DB_USERNAME') ?: 'tradex';
        $password = getenv('DB_PASSWORD') ?: 'secret';
        $pdo = new PDO("pgsql:host={$host};port=5432;dbname={$database}", $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }

    return $pdo;
}

function json_response(array $data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data, JSON_UNESCAPED_SLASHES);
    exit;
}

function body(): array
{
    $payload = file_get_contents('php://input') ?: '{}';
    $data = json_decode($payload, true);

    return is_array($data) ? $data : [];
}

function user(): array
{
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    $token = str_starts_with($auth, 'Bearer ') ? substr($auth, 7) : 'demo-token';
    $email = $token === 'admin-token' ? 'admin@tradex.local' : 'trader@tradex.local';

    $stmt = db()->prepare('select * from users where email = :email limit 1');
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if (! $user) {
        json_response(['success' => false, 'message' => 'Unauthenticated'], 401);
    }

    return $user;
}

function ok(mixed $data, array $meta = [], int $status = 200): void
{
    json_response(['success' => true, 'data' => $data, 'meta' => (object) $meta], $status);
}

function latest_quote(int $assetId): array
{
    $stmt = db()->prepare('select * from quotes where asset_id = :asset_id order by captured_at desc limit 1');
    $stmt->execute(['asset_id' => $assetId]);
    $quote = $stmt->fetch();

    if (! $quote) {
        json_response(['success' => false, 'message' => 'Quote not found'], 404);
    }

    return $quote;
}

function asset_payload(array $asset): array
{
    $quote = latest_quote((int) $asset['id']);

    return [
        'id' => (int) $asset['id'],
        'symbol' => $asset['symbol'],
        'name' => $asset['name'],
        'asset_type' => $asset['asset_type'],
        'base_symbol' => $asset['base_symbol'],
        'quote_symbol' => $asset['quote_symbol'],
        'tradingview_symbol' => $asset['tradingview_symbol'],
        'quote' => [
            'price' => $quote['price'],
            'change_percent' => $quote['change_percent'],
            'captured_at' => $quote['captured_at'],
        ],
    ];
}

function route_path(): string
{
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';

    return rtrim($path, '/') ?: '/';
}

try {
    $path = route_path();
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET' && $path === '/api/v1/health') {
        ok(['status' => 'ok', 'service' => 'tradex-api']);
    }

    if ($method === 'POST' && $path === '/api/v1/auth/login') {
        $data = body();
        $email = $data['email'] ?? 'trader@tradex.local';
        $stmt = db()->prepare('select * from users where email = :email limit 1');
        $stmt->execute(['email' => $email]);
        $found = $stmt->fetch();

        if (! $found) {
            json_response(['success' => false, 'message' => 'Invalid credentials'], 422);
        }

        ok(['user' => $found, 'token' => $found['role'] === 'admin' ? 'admin-token' : 'demo-token']);
    }

    if ($method === 'POST' && $path === '/api/v1/auth/register') {
        $data = body();
        $email = $data['email'] ?? ('demo+' . time() . '@tradex.local');
        $stmt = db()->prepare('insert into users (name, email, password, role, kyc_status, is_blocked, created_at, updated_at) values (:name, :email, :password, :role, :kyc, false, now(), now()) returning *');
        $stmt->execute([
            'name' => $data['name'] ?? 'Demo Trader',
            'email' => $email,
            'password' => password_hash($data['password'] ?? 'password', PASSWORD_BCRYPT),
            'role' => 'trader',
            'kyc' => 'approved',
        ]);
        $created = $stmt->fetch();
        db()->prepare('insert into wallets (user_id, currency, available_balance, locked_balance, created_at, updated_at) values (:user_id, :currency, 25000, 0, now(), now())')
            ->execute(['user_id' => $created['id'], 'currency' => 'USDT']);
        ok(['user' => $created, 'token' => 'demo-token'], [], 201);
    }

    if ($method === 'GET' && $path === '/api/v1/auth/me') {
        ok(user());
    }

    if ($method === 'GET' && $path === '/api/v1/admin/overview') {
        $current = user();
        if ($current['role'] !== 'admin') {
            json_response(['success' => false, 'message' => 'Forbidden'], 403);
        }

        $counts = [];
        foreach (['users', 'assets', 'orders', 'trades', 'transactions'] as $table) {
            $counts[$table] = (int) db()->query("select count(*) from {$table}")->fetchColumn();
        }

        $volume = db()->query('select coalesce(sum(total), 0) from trades')->fetchColumn();
        $fees = db()->query('select coalesce(sum(fee), 0) from trades')->fetchColumn();

        ok([
            'counts' => $counts,
            'volume' => $volume,
            'fees' => $fees,
        ]);
    }

    if ($method === 'GET' && $path === '/api/v1/admin/users') {
        if (user()['role'] !== 'admin') {
            json_response(['success' => false, 'message' => 'Forbidden'], 403);
        }

        ok(db()->query("select users.id, users.name, users.email, users.role, users.kyc_status, users.is_blocked, coalesce(sum(wallets.available_balance), 0) as balance from users left join wallets on wallets.user_id = users.id group by users.id order by users.id")->fetchAll());
    }

    if ($method === 'GET' && $path === '/api/v1/admin/assets') {
        if (user()['role'] !== 'admin') {
            json_response(['success' => false, 'message' => 'Forbidden'], 403);
        }

        ok(db()->query('select assets.*, latest.price, latest.change_percent from assets left join lateral (select price, change_percent from quotes where quotes.asset_id = assets.id order by captured_at desc limit 1) latest on true order by sort_order')->fetchAll());
    }

    if ($method === 'GET' && $path === '/api/v1/admin/orders') {
        if (user()['role'] !== 'admin') {
            json_response(['success' => false, 'message' => 'Forbidden'], 403);
        }

        ok(db()->query('select orders.*, users.email, assets.symbol from orders join users on users.id = orders.user_id join assets on assets.id = orders.asset_id order by orders.created_at desc limit 100')->fetchAll());
    }

    if ($method === 'GET' && $path === '/api/v1/admin/settings') {
        if (user()['role'] !== 'admin') {
            json_response(['success' => false, 'message' => 'Forbidden'], 403);
        }

        ok([
            'demo_fee_rate' => '0.001',
            'trading_enabled' => true,
            'deposits_enabled' => false,
            'withdrawals_enabled' => false,
            'risk_mode' => 'conservative',
        ]);
    }

    if ($method === 'GET' && $path === '/api/v1/markets') {
        $assets = db()->query('select * from assets where is_active = true order by sort_order asc')->fetchAll();
        ok(array_map('asset_payload', $assets));
    }

    if ($method === 'GET' && preg_match('#^/api/v1/markets/([^/]+)$#', $path, $matches)) {
        $stmt = db()->prepare('select * from assets where symbol = :symbol limit 1');
        $stmt->execute(['symbol' => strtoupper($matches[1])]);
        $asset = $stmt->fetch();

        if (! $asset) {
            json_response(['success' => false, 'message' => 'Asset not found'], 404);
        }

        ok(asset_payload($asset));
    }

    if ($method === 'GET' && preg_match('#^/api/v1/markets/([^/]+)/quote$#', $path, $matches)) {
        $stmt = db()->prepare('select * from assets where symbol = :symbol limit 1');
        $stmt->execute(['symbol' => strtoupper($matches[1])]);
        $asset = $stmt->fetch();

        if (! $asset) {
            json_response(['success' => false, 'message' => 'Asset not found'], 404);
        }

        ok(latest_quote((int) $asset['id']));
    }

    if ($method === 'GET' && $path === '/api/v1/wallets') {
        $current = user();
        $stmt = db()->prepare('select * from wallets where user_id = :user_id order by currency');
        $stmt->execute(['user_id' => $current['id']]);
        ok($stmt->fetchAll());
    }

    if ($method === 'POST' && $path === '/api/v1/wallets/demo-deposit') {
        $current = user();
        $data = body();
        $amount = (string) max(0, (float) ($data['amount'] ?? 1000));
        $currency = strtoupper($data['currency'] ?? 'USDT');
        $stmt = db()->prepare('update wallets set available_balance = available_balance + :amount, updated_at = now() where user_id = :user_id and currency = :currency returning *');
        $stmt->execute(['amount' => $amount, 'user_id' => $current['id'], 'currency' => $currency]);
        ok($stmt->fetch());
    }

    if ($method === 'GET' && $path === '/api/v1/orders') {
        $current = user();
        $stmt = db()->prepare('select orders.*, assets.symbol from orders join assets on assets.id = orders.asset_id where orders.user_id = :user_id order by orders.created_at desc');
        $stmt->execute(['user_id' => $current['id']]);
        ok($stmt->fetchAll());
    }

    if ($method === 'GET' && $path === '/api/v1/trades') {
        $current = user();
        $stmt = db()->prepare('select trades.*, assets.symbol from trades join assets on assets.id = trades.asset_id where trades.user_id = :user_id order by trades.executed_at desc');
        $stmt->execute(['user_id' => $current['id']]);
        ok($stmt->fetchAll());
    }

    if ($method === 'POST' && $path === '/api/v1/orders') {
        $current = user();
        $data = body();
        $assetId = (int) ($data['asset_id'] ?? 0);
        $side = $data['side'] ?? 'buy';
        $quantity = (string) max(0, (float) ($data['quantity'] ?? 0));

        if (! in_array($side, ['buy', 'sell'], true) || (float) $quantity <= 0) {
            json_response(['success' => false, 'message' => 'Invalid order payload'], 422);
        }

        db()->beginTransaction();

        $stmt = db()->prepare('select * from assets where id = :id for update');
        $stmt->execute(['id' => $assetId]);
        $asset = $stmt->fetch();

        if (! $asset) {
            db()->rollBack();
            json_response(['success' => false, 'message' => 'Asset not found'], 404);
        }

        $quote = latest_quote((int) $asset['id']);
        $price = $quote['price'];
        $gross = bcmul($quantity, $price, 12);
        $fee = bcmul($gross, '0.001', 12);
        $walletDelta = $side === 'buy' ? bcmul(bcadd($gross, $fee, 12), '-1', 12) : bcsub($gross, $fee, 12);

        $walletStmt = db()->prepare('select * from wallets where user_id = :user_id and currency = :currency for update');
        $walletStmt->execute(['user_id' => $current['id'], 'currency' => $asset['quote_symbol']]);
        $wallet = $walletStmt->fetch();

        if (! $wallet || ($side === 'buy' && bccomp($wallet['available_balance'], ltrim($walletDelta, '-'), 12) < 0)) {
            db()->rollBack();
            json_response(['success' => false, 'message' => 'Insufficient wallet balance'], 422);
        }

        $positionStmt = db()->prepare('select * from positions where user_id = :user_id and asset_id = :asset_id for update');
        $positionStmt->execute(['user_id' => $current['id'], 'asset_id' => $asset['id']]);
        $position = $positionStmt->fetch();

        if ($side === 'sell' && (! $position || bccomp($position['quantity'], $quantity, 12) < 0)) {
            db()->rollBack();
            json_response(['success' => false, 'message' => 'Insufficient position quantity'], 422);
        }

        db()->prepare('update wallets set available_balance = available_balance + :delta, updated_at = now() where id = :id')
            ->execute(['delta' => $walletDelta, 'id' => $wallet['id']]);

        $orderStmt = db()->prepare('insert into orders (user_id, asset_id, side, type, status, price, quantity, total, fee, filled_at, created_at, updated_at) values (:user_id, :asset_id, :side, :type, :status, :price, :quantity, :total, :fee, now(), now(), now()) returning *');
        $orderStmt->execute([
            'user_id' => $current['id'],
            'asset_id' => $asset['id'],
            'side' => $side,
            'type' => 'market',
            'status' => 'filled',
            'price' => $price,
            'quantity' => $quantity,
            'total' => $gross,
            'fee' => $fee,
        ]);
        $order = $orderStmt->fetch();

        db()->prepare('insert into trades (user_id, order_id, asset_id, side, price, quantity, total, fee, executed_at) values (:user_id, :order_id, :asset_id, :side, :price, :quantity, :total, :fee, now())')
            ->execute([
                'user_id' => $current['id'],
                'order_id' => $order['id'],
                'asset_id' => $asset['id'],
                'side' => $side,
                'price' => $price,
                'quantity' => $quantity,
                'total' => $gross,
                'fee' => $fee,
            ]);

        if ($side === 'buy') {
            if ($position) {
                $newQuantity = bcadd($position['quantity'], $quantity, 12);
                $oldCost = bcmul($position['quantity'], $position['average_entry_price'], 12);
                $newCost = bcmul($quantity, $price, 12);
                $avg = bcdiv(bcadd($oldCost, $newCost, 12), $newQuantity, 12);
                db()->prepare('update positions set quantity = :quantity, average_entry_price = :avg, updated_at = now() where id = :id')
                    ->execute(['quantity' => $newQuantity, 'avg' => $avg, 'id' => $position['id']]);
            } else {
                db()->prepare('insert into positions (user_id, asset_id, quantity, average_entry_price, realized_pnl, created_at, updated_at) values (:user_id, :asset_id, :quantity, :price, 0, now(), now())')
                    ->execute(['user_id' => $current['id'], 'asset_id' => $asset['id'], 'quantity' => $quantity, 'price' => $price]);
            }
        } else {
            db()->prepare('update positions set quantity = quantity - :quantity, updated_at = now() where id = :id')
                ->execute(['quantity' => $quantity, 'id' => $position['id']]);
        }

        db()->prepare('insert into transactions (user_id, wallet_id, type, amount, currency, status, meta, created_at, updated_at) values (:user_id, :wallet_id, :type, :amount, :currency, :status, :meta, now(), now())')
            ->execute([
                'user_id' => $current['id'],
                'wallet_id' => $wallet['id'],
                'type' => $side === 'buy' ? 'trade_buy' : 'trade_sell',
                'amount' => $walletDelta,
                'currency' => $asset['quote_symbol'],
                'status' => 'completed',
                'meta' => json_encode(['order_id' => $order['id'], 'asset' => $asset['symbol']]),
            ]);

        db()->commit();
        ok($order, [], 201);
    }

    if ($method === 'GET' && in_array($path, ['/api/v1/portfolio', '/api/v1/portfolio/summary'], true)) {
        $current = user();
        $cashStmt = db()->prepare("select coalesce(sum(available_balance), 0) as cash from wallets where user_id = :user_id and currency in ('USDT', 'USD')");
        $cashStmt->execute(['user_id' => $current['id']]);
        $cash = $cashStmt->fetch()['cash'] ?? '0';

        $stmt = db()->prepare('select positions.*, assets.symbol, quotes.price from positions join assets on assets.id = positions.asset_id join lateral (select price from quotes where quotes.asset_id = assets.id order by captured_at desc limit 1) quotes on true where positions.user_id = :user_id');
        $stmt->execute(['user_id' => $current['id']]);
        $positions = $stmt->fetchAll();
        $positionsValue = '0';
        $pnl = '0';

        foreach ($positions as $position) {
            $value = bcmul($position['quantity'], $position['price'], 12);
            $cost = bcmul($position['quantity'], $position['average_entry_price'], 12);
            $positionsValue = bcadd($positionsValue, $value, 12);
            $pnl = bcadd($pnl, bcsub($value, $cost, 12), 12);
        }

        ok([
            'cash_balance' => $cash,
            'positions_value' => $positionsValue,
            'equity' => bcadd($cash, $positionsValue, 12),
            'unrealized_pnl' => $pnl,
        ]);
    }

    if ($method === 'GET' && $path === '/api/v1/portfolio/positions') {
        $current = user();
        $stmt = db()->prepare('select positions.*, assets.symbol from positions join assets on assets.id = positions.asset_id where positions.user_id = :user_id order by assets.sort_order');
        $stmt->execute(['user_id' => $current['id']]);
        ok($stmt->fetchAll());
    }

    json_response(['success' => false, 'message' => 'Not found'], 404);
} catch (Throwable $exception) {
    if (db()->inTransaction()) {
        db()->rollBack();
    }

    json_response(['success' => false, 'message' => $exception->getMessage()], 500);
}
