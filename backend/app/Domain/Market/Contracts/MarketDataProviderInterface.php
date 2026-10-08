<?php

namespace App\Domain\Market\Contracts;

use App\Models\Asset;

interface MarketDataProviderInterface
{
    public function latestPrice(Asset $asset): string;
}
