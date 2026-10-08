<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'symbol' => $this->symbol,
            'base_symbol' => $this->base_symbol,
            'quote_symbol' => $this->quote_symbol,
            'name' => $this->name,
            'asset_type' => $this->asset_type,
            'tradingview_symbol' => $this->tradingview_symbol,
            'quote' => $this->whenLoaded('latestQuote', fn () => [
                'price' => $this->latestQuote?->price,
                'change_percent' => $this->latestQuote?->change_percent,
                'captured_at' => $this->latestQuote?->captured_at?->toISOString(),
            ]),
        ];
    }
}
