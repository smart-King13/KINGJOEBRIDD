<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('measurement_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('measurement_sets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('profile_id')->constrained('measurement_profiles')->cascadeOnDelete();
            $table->integer('version');
            $table->boolean('is_approved')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['profile_id', 'version']);
        });

        Schema::create('measurement_values', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('measurement_set_id')->constrained('measurement_sets')->cascadeOnDelete();
            $table->string('key');
            $table->string('value');
            $table->string('unit')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('measurement_values');
        Schema::dropIfExists('measurement_sets');
        Schema::dropIfExists('measurement_profiles');
    }
};
