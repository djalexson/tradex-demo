<?php

namespace App\DTO;

final readonly class OrderData
{
    public function __construct(
        public int $assetId,
        public string $side,
        public string $type,
        public string $quantity,
    ) {
    }
}
