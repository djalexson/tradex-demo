<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    protected $fillable = [
        'symbol',
        'base_symbol',
        'quote_symbol',
        'name',
        'asset_type',
        'provider',
        'tradingview_symbol',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function quotes()
    {
        return $this->hasMany(Quote::class);
    }

    public function latestQuote()
    {
        return $this->hasOne(Quote::class)->latestOfMany('captured_at');
    }
}
