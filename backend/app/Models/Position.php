<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    protected $fillable = [
        'user_id',
        'asset_id',
        'quantity',
        'average_entry_price',
        'realized_pnl',
    ];

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }
}
