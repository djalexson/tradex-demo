<?php

namespace Database\Seeders;

use App\Models\Asset;
use App\Models\Quote;
use Illuminate\Database\Seeder;

class AssetSeeder extends Seeder
{
    public function run(): void
    {
        $assets = [
            ['BTCUSDT', 'BTC', 'USDT', 'Bitcoin', 'crypto', 'BINANCE:BTCUSDT', '106420', '2.84'],
            ['ETHUSDT', 'ETH', 'USDT', 'Ethereum', 'crypto', 'BINANCE:ETHUSDT', '3840', '1.47'],
            ['EURUSD', 'EUR', 'USD', 'Euro / US Dollar', 'forex', 'FX:EURUSD', '1.0872', '-0.18'],
            ['AAPL', 'AAPL', 'USD', 'Apple Inc.', 'stock', 'NASDAQ:AAPL', '214.15', '0.74'],
            ['TSLA', 'TSLA', 'USD', 'Tesla Inc.', 'stock', 'NASDAQ:TSLA', '187.62', '-1.22'],
            ['SPX500', 'SPX', 'USD', 'S&P 500', 'index', 'SP:SPX', '5432.18', '0.31'],
            ['GOLD', 'XAU', 'USD', 'Gold Spot', 'commodity', 'OANDA:XAUUSD', '2337.80', '0.52'],
        ];

        foreach ($assets as $index => [$symbol, $base, $quote, $name, $type, $tv, $price, $change]) {
            $asset = Asset::query()->updateOrCreate(
                ['symbol' => $symbol],
                [
                    'base_symbol' => $base,
                    'quote_symbol' => $quote,
                    'name' => $name,
                    'asset_type' => $type,
                    'provider' => 'demo',
                    'tradingview_symbol' => $tv,
                    'is_active' => true,
                    'sort_order' => $index + 1,
                ],
            );

            Quote::query()->create([
                'asset_id' => $asset->id,
                'price' => $price,
                'change_percent' => $change,
                'high_24h' => bcmul($price, '1.025', 12),
                'low_24h' => bcmul($price, '0.975', 12),
                'volume_24h' => (string) (1000000 * ($index + 8)),
                'captured_at' => now(),
            ]);
        }
    }
}
