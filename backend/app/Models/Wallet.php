<?php

namespace App\Models;

use App\ValueObjects\Money;
use Illuminate\Database\Eloquent\Model;
use RuntimeException;

class Wallet extends Model
{
    protected $fillable = [
        'user_id',
        'currency',
        'available_balance',
        'locked_balance',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function deposit(Money $amount): void
    {
        $this->available_balance = bcadd($this->available_balance, $amount->amount, 12);
    }

    public function withdraw(Money $amount): void
    {
        if (bccomp($this->available_balance, $amount->amount, 12) < 0) {
            throw new RuntimeException('Insufficient wallet balance.');
        }

        $this->available_balance = bcsub($this->available_balance, $amount->amount, 12);
    }
}
