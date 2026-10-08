<?php

namespace App\DTO;

final readonly class PortfolioSummaryDTO
{
    public function __construct(
        public string $cashBalance,
        public string $positionsValue,
        public string $equity,
        public string $unrealizedPnl,
    ) {
    }
}
