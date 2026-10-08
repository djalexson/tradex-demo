<?php

namespace App\Domain\Trading\Services;

use App\DTO\TradeResultDTO;
use App\Models\Asset;
use App\Models\Order;
use App\Models\Position;
use App\Models\Trade;
use App\Models\Transaction;
use App\Models\User;
use App\ValueObjects\Money;
use Illuminate\Support\Facades\DB;

class DemoTradingService
{
    public function executeMarketOrder(User $user, Asset $asset, string $side, string $quantity): TradeResultDTO
    {
        return DB::transaction(function () use ($user, $asset, $side, $quantity): TradeResultDTO {
            $quote = $asset->latestQuote()->lockForUpdate()->firstOrFail();
            $price = $quote->price;
            $gross = bcmul($quantity, $price, 12);
            $fee = $this->calculateFee(Money::of($gross, $asset->quote_symbol))->amount;
            $wallet = $user->wallets()->where('currency', $asset->quote_symbol)->lockForUpdate()->firstOrFail();

            if ($side === 'buy') {
                $wallet->withdraw(Money::of(bcadd($gross, $fee, 12), $asset->quote_symbol));
            } else {
                $position = $user->positions()->where('asset_id', $asset->id)->lockForUpdate()->first();
                abort_if(! $position || bccomp($position->quantity, $quantity, 12) < 0, 422, 'Insufficient position quantity.');
                $wallet->deposit(Money::of(bcsub($gross, $fee, 12), $asset->quote_symbol));
            }

            $wallet->save();

            $order = Order::query()->create([
                'user_id' => $user->id,
                'asset_id' => $asset->id,
                'side' => $side,
                'type' => 'market',
                'status' => 'filled',
                'price' => $price,
                'quantity' => $quantity,
                'total' => $gross,
                'fee' => $fee,
                'filled_at' => now(),
            ]);

            $trade = Trade::query()->create([
                'user_id' => $user->id,
                'order_id' => $order->id,
                'asset_id' => $asset->id,
                'side' => $side,
                'price' => $price,
                'quantity' => $quantity,
                'total' => $gross,
                'fee' => $fee,
                'executed_at' => now(),
            ]);

            $this->updatePosition($user, $asset, $trade);

            Transaction::query()->create([
                'user_id' => $user->id,
                'wallet_id' => $wallet->id,
                'type' => $side === 'buy' ? 'trade_buy' : 'trade_sell',
                'amount' => $side === 'buy' ? bcmul(bcadd($gross, $fee, 12), '-1', 12) : bcsub($gross, $fee, 12),
                'currency' => $asset->quote_symbol,
                'status' => 'completed',
                'meta' => ['order_id' => $order->id, 'asset' => $asset->symbol],
            ]);

            return new TradeResultDTO($order, $trade);
        });
    }

    public function calculateFee(Money $total): Money
    {
        return $total->multiply((string) config('tradex.demo_fee_rate', '0.001'));
    }

    public function updatePosition(User $user, Asset $asset, Trade $trade): Position
    {
        $position = Position::query()->firstOrNew([
            'user_id' => $user->id,
            'asset_id' => $asset->id,
        ], [
            'quantity' => '0',
            'average_entry_price' => '0',
            'realized_pnl' => '0',
        ]);

        if ($trade->side === 'buy') {
            $newQuantity = bcadd($position->quantity, $trade->quantity, 12);
            $oldCost = bcmul($position->quantity, $position->average_entry_price, 12);
            $newCost = bcmul($trade->quantity, $trade->price, 12);
            $position->average_entry_price = bcdiv(bcadd($oldCost, $newCost, 12), $newQuantity, 12);
            $position->quantity = $newQuantity;
        } else {
            $position->quantity = bcsub($position->quantity, $trade->quantity, 12);
        }

        $position->save();

        return $position;
    }
}
