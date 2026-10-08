<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trade extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'order_id',
        'asset_id',
        'side',
        'price',
        'quantity',
        'total',
        'fee',
        'executed_at',
    ];

    protected function casts(): array
    {
        return [
            'executed_at' => 'datetime',
        ];
    }

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
