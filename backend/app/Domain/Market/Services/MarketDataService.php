<?php

namespace App\Domain\Market\Services;

use App\DTO\QuoteDTO;
use App\Models\Asset;
use App\Models\Quote;
use Illuminate\Support\Collection;

class MarketDataService
{
    public function getAssets(): Collection
    {
        return Asset::query()
            ->with('latestQuote')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();
    }

    public function getLatestQuote(Asset $asset): QuoteDTO
    {
        $quote = $asset->latestQuote ?: $asset->quotes()->latest('captured_at')->firstOrFail();

        return new QuoteDTO(
            symbol: $asset->symbol,
            price: $quote->price,
            changePercent: $quote->change_percent,
            capturedAt: $quote->captured_at->toISOString(),
        );
    }

    public function syncDemoQuotes(): void
    {
        Asset::query()->where('is_active', true)->each(function (Asset $asset): void {
            $previous = $asset->latestQuote?->price ?? '100';
            $drift = fake()->randomFloat(4, -1.2, 1.2);
            $price = bcmul($previous, bcadd('1', bcdiv((string) $drift, '100', 12), 12), 12);

            Quote::query()->create([
                'asset_id' => $asset->id,
                'price' => $price,
                'change_percent' => (string) $drift,
                'high_24h' => bcmul($price, '1.025', 12),
                'low_24h' => bcmul($price, '0.975', 12),
                'volume_24h' => (string) fake()->numberBetween(1000000, 900000000),
                'captured_at' => now(),
            ]);
        });
    }
}
