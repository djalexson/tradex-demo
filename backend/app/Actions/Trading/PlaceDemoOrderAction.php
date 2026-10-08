<?php

namespace App\Actions\Trading;

use App\DTO\OrderData;
use App\DTO\TradeResultDTO;
use App\Domain\Trading\Services\DemoTradingService;
use App\Models\Asset;
use App\Models\User;

class PlaceDemoOrderAction
{
    public function __construct(private readonly DemoTradingService $tradingService)
    {
    }

    public function execute(User $user, OrderData $data): TradeResultDTO
    {
        $asset = Asset::query()->whereKey($data->assetId)->where('is_active', true)->firstOrFail();

        return $this->tradingService->executeMarketOrder($user, $asset, $data->side, $data->quantity);
    }
}
