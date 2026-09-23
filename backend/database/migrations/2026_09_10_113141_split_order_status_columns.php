<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->renameColumn('status', 'payment_status');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->string('production_status')->default('not_started')->after('payment_status');
        });

        // Safely map existing mixed states back to payment status if they got overridden
        DB::table('orders')->where('payment_status', 'in_production')->update([
            'payment_status' => 'pending_payment',
            'production_status' => 'cutting', // Assuming if it was in_production, cutting had started
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('production_status');
            $table->renameColumn('payment_status', 'status');
        });
    }
};
