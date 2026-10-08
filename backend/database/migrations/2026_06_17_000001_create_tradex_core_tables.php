<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assets', function (Blueprint $table): void {
            $table->id();
            $table->string('symbol')->unique();
            $table->string('base_symbol', 24);
            $table->string('quote_symbol', 24);
            $table->string('name');
            $table->string('asset_type')->index();
            $table->string('provider')->default('demo');
            $table->string('tradingview_symbol');
            $table->boolean('is_active')->default(true)->index();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('quotes', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('asset_id')->constrained()->cascadeOnDelete();
            $table->decimal('price', 30, 12);
            $table->decimal('change_percent', 12, 4)->default(0);
            $table->decimal('high_24h', 30, 12)->nullable();
            $table->decimal('low_24h', 30, 12)->nullable();
            $table->decimal('volume_24h', 30, 12)->nullable();
            $table->timestamp('captured_at')->index();
            $table->index(['asset_id', 'captured_at']);
        });

        Schema::create('wallets', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('currency', 24);
            $table->decimal('available_balance', 30, 12)->default(0);
            $table->decimal('locked_balance', 30, 12)->default(0);
            $table->timestamps();
            $table->unique(['user_id', 'currency']);
        });

        Schema::create('orders', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('asset_id')->constrained()->cascadeOnDelete();
            $table->string('side', 8);
            $table->string('type', 16);
            $table->string('status', 16)->index();
            $table->decimal('price', 30, 12);
            $table->decimal('quantity', 30, 12);
            $table->decimal('total', 30, 12);
            $table->decimal('fee', 30, 12)->default(0);
            $table->timestamp('filled_at')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'status']);
            $table->index(['asset_id', 'status']);
            $table->index('created_at');
        });

        Schema::create('trades', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('asset_id')->constrained()->cascadeOnDelete();
            $table->string('side', 8);
            $table->decimal('price', 30, 12);
            $table->decimal('quantity', 30, 12);
            $table->decimal('total', 30, 12);
            $table->decimal('fee', 30, 12)->default(0);
            $table->timestamp('executed_at')->index();
            $table->index(['user_id', 'executed_at']);
            $table->index(['asset_id', 'executed_at']);
        });

        Schema::create('positions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('asset_id')->constrained()->cascadeOnDelete();
            $table->decimal('quantity', 30, 12)->default(0);
            $table->decimal('average_entry_price', 30, 12)->default(0);
            $table->decimal('realized_pnl', 30, 12)->default(0);
            $table->timestamps();
            $table->unique(['user_id', 'asset_id']);
        });

        Schema::create('transactions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('wallet_id')->constrained()->cascadeOnDelete();
            $table->string('type')->index();
            $table->decimal('amount', 30, 12);
            $table->string('currency', 24);
            $table->string('status')->index();
            $table->json('meta')->nullable();
            $table->timestamps();
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('positions');
        Schema::dropIfExists('trades');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('wallets');
        Schema::dropIfExists('quotes');
        Schema::dropIfExists('assets');
    }
};
