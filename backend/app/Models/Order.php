<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'asset_id',
        'side',
        'type',
        'status',
        'price',
        'quantity',
        'total',
        'fee',
        'filled_at',
    ];

    protected function casts(): array
    {
        return [
            'filled_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }

    public function trade()
    {
        return $this->hasOne(Trade::class);
    }
}
