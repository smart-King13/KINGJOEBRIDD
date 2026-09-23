<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('order_id')->constrained('orders')->restrictOnDelete();
            $table->foreignUuid('quote_id')->nullable()->constrained('quotes')->restrictOnDelete();
            $table->bigInteger('amount');
            $table->string('type');
            $table->string('provider')->nullable();
            $table->string('provider_reference')->nullable();
            $table->string('status');
            $table->timestamp('paid_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            
            $table->index('provider_reference');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
