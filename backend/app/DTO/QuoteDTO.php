<?php

namespace App\DTO;

final readonly class QuoteDTO
{
    public function __construct(
        public string $symbol,
        public string $price,
        public string $changePercent,
        public string $capturedAt,
    ) {
    }
}
