<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MarketController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\WalletController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::get('/markets', [MarketController::class, 'index']);
    Route::get('/markets/{asset:symbol}', [MarketController::class, 'show']);
    Route::get('/markets/{asset:symbol}/quote', [MarketController::class, 'quote']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        Route::get('/wallets', [WalletController::class, 'index']);
        Route::get('/wallets/{currency}', [WalletController::class, 'show']);
        Route::post('/wallets/demo-deposit', [WalletController::class, 'demoDeposit']);

        Route::post('/orders', [OrderController::class, 'store']);
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{order}', [OrderController::class, 'show']);
        Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel']);
        Route::get('/trades', [OrderController::class, 'trades']);

        Route::get('/portfolio', [PortfolioController::class, 'summary']);
        Route::get('/portfolio/positions', [PortfolioController::class, 'positions']);
        Route::get('/portfolio/summary', [PortfolioController::class, 'summary']);
    });
});
