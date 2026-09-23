<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('styles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->foreignUuid('collection_id')->nullable()->constrained('collections')->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(false)->index();
            $table->integer('sort_order')->default(0);
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('style_images', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('style_id')->constrained('styles')->cascadeOnDelete();
            $table->string('storage_path');
            $table->string('original_filename');
            $table->string('mime_type');
            $table->integer('size');
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
        });

        Schema::create('saved_styles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUuid('style_id')->constrained('styles')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'style_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('saved_styles');
        Schema::dropIfExists('style_images');
        Schema::dropIfExists('styles');
    }
};
