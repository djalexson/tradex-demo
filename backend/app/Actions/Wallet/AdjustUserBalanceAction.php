<?php

namespace App\Actions\Wallet;

use App\Models\User;
use App\Models\Wallet;
use App\ValueObjects\Money;

class AdjustUserBalanceAction
{
    public function execute(User $user, Money $amount): Wallet
    {
        $wallet = $user->wallets()->firstOrCreate(
            ['currency' => $amount->currency],
            ['available_balance' => '0', 'locked_balance' => '0'],
        );

        bccomp($amount->amount, '0', 12) >= 0
            ? $wallet->deposit($amount)
            : $wallet->withdraw(new Money(ltrim($amount->amount, '-'), $amount->currency));

        $wallet->save();

        return $wallet;
    }
}
