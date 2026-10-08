<?php

namespace App\Domain\Trading\Services;

use App\DTO\PortfolioSummaryDTO;
use App\Models\User;
use Illuminate\Support\Collection;

class PortfolioService
{
    public function getPositions(User $user): Collection
    {
        return $user->positions()->with('asset.latestQuote')->get();
    }

    public function getSummary(User $user): PortfolioSummaryDTO
    {
        $cash = $user->wallets()->where('currency', 'USDT')->value('available_balance') ?? '0';
        $positions = $this->getPositions($user);
        $positionsValue = '0';
        $unrealizedPnl = '0';

        foreach ($positions as $position) {
            $price = $position->asset->latestQuote?->price ?? $position->average_entry_price;
            $value = bcmul($position->quantity, $price, 12);
            $cost = bcmul($position->quantity, $position->average_entry_price, 12);
            $positionsValue = bcadd($positionsValue, $value, 12);
            $unrealizedPnl = bcadd($unrealizedPnl, bcsub($value, $cost, 12), 12);
        }

        return new PortfolioSummaryDTO(
            cashBalance: $cash,
            positionsValue: $positionsValue,
            equity: bcadd($cash, $positionsValue, 12),
            unrealizedPnl: $unrealizedPnl,
        );
    }
}
