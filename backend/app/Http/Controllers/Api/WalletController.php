<?php

namespace App\Http\Controllers\Api;

use App\Actions\Wallet\AdjustUserBalanceAction;
use App\Http\Controllers\Controller;
use App\ValueObjects\Money;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WalletController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['success' => true, 'data' => request()->user()->wallets]);
    }

    public function show(string $currency): JsonResponse
    {
        $wallet = request()->user()->wallets()->where('currency', strtoupper($currency))->firstOrFail();

        return response()->json(['success' => true, 'data' => $wallet]);
    }

    public function demoDeposit(Request $request, AdjustUserBalanceAction $action): JsonResponse
    {
        $validated = $request->validate([
            'amount' => ['required', 'numeric', 'gt:0', 'max:100000'],
            'currency' => ['nullable', 'string', 'max:8'],
        ]);

        $wallet = $action->execute(request()->user(), Money::of($validated['amount'], $validated['currency'] ?? 'USDT'));

        return response()->json(['success' => true, 'data' => $wallet]);
    }
}
