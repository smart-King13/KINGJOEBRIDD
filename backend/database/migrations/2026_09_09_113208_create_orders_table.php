<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('quote_id')->nullable()->constrained('quotes')->restrictOnDelete();
            $table->foreignUuid('style_id')->nullable()->constrained('styles')->restrictOnDelete();
            $table->foreignUuid('style_request_id')->nullable()->constrained('style_requests')->restrictOnDelete();
            $table->foreignUuid('measurement_set_id')->nullable()->constrained('measurement_sets')->restrictOnDelete();
            $table->foreignUuid('material_id')->nullable()->constrained('materials')->restrictOnDelete();
            $table->string('status');
            $table->json('snapshot')->nullable();
            $table->timestamps();

            // Enforce one order per quote maximum
            $table->unique('quote_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
