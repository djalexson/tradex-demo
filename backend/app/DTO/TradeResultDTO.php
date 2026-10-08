<?php

namespace App\DTO;

use App\Models\Order;
use App\Models\Trade;

final readonly class TradeResultDTO
{
    public function __construct(public Order $order, public Trade $trade)
    {
    }
}
