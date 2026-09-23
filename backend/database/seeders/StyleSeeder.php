<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class StyleSeeder extends Seeder
{
    public function run(): void
    {
        $categoryId = Str::uuid()->toString();
        $collectionId = Str::uuid()->toString();

        DB::table('categories')->insert([
            'id' => $categoryId,
            'name' => 'Bespoke Suits',
            'slug' => 'bespoke-suits',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('collections')->insert([
            'id' => $collectionId,
            'name' => 'Summer 2026',
            'slug' => 'summer-2026',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $images = [
            'firefly-1.png' => 'Elegant two-piece navy suit.',
            'firefly-2.png' => 'Classic formal wear with modern cuts.',
            'firefly-4.png' => 'Luxury tailored tuxedo.',
            'firefly-6.png' => 'Versatile casual blazer setup.',
            'firefly-7.png' => 'Premium wool tailored suit.',
            'firefly-8.png' => 'Sharp styling for business executives.',
            'firefly-9.png' => 'Avant-garde runway design.',
            'firefly-10.png' => 'Bespoke overcoat and trousers.',
        ];

        $order = 1;
        foreach ($images as $img => $description) {
            $styleId = Str::uuid()->toString();
            
            DB::table('styles')->insert([
                'id' => $styleId,
                'category_id' => $categoryId,
                'collection_id' => $collectionId,
                'name' => 'Style ' . Str::title(str_replace(['firefly-', '.png'], '', $img)),
                'slug' => 'style-' . str_replace('.png', '', $img),
                'description' => $description,
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => $order++,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('style_images')->insert([
                'id' => Str::uuid()->toString(),
                'style_id' => $styleId,
                'storage_path' => '/images/' . $img,
                'original_filename' => $img,
                'mime_type' => 'image/png',
                'size' => 100000,
                'is_primary' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
