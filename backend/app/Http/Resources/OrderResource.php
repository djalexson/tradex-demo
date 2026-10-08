<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'asset' => new AssetResource($this->whenLoaded('asset')),
            'side' => $this->side,
            'type' => $this->type,
            'status' => $this->status,
            'price' => $this->price,
            'quantity' => $this->quantity,
            'total' => $this->total,
            'fee' => $this->fee,
            'filled_at' => $this->filled_at?->toISOString(),
        ];
    }
}
