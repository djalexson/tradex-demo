<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoUserSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@tradex.local'],
            [
                'name' => 'TradeX Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'kyc_status' => 'approved',
                'is_blocked' => false,
            ],
        );

        $trader = User::query()->updateOrCreate(
            ['email' => 'trader@tradex.local'],
            [
                'name' => 'Demo Trader',
                'password' => Hash::make('password'),
                'role' => 'trader',
                'kyc_status' => 'approved',
                'is_blocked' => false,
            ],
        );

        foreach ([$admin, $trader] as $user) {
            $user->wallets()->updateOrCreate(
                ['currency' => 'USDT'],
                ['available_balance' => $user->is($trader) ? '25000' : '0', 'locked_balance' => '0'],
            );
        }
    }
}
