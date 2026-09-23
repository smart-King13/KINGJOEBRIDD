<?php

namespace Tests\Feature\Api\V1\Styles;

use App\Models\Styles\Category;
use App\Models\Styles\Style;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Str;

class StyleControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_published_styles()
    {
        $category = Category::create([
            'id' => Str::uuid(),
            'name' => 'Suits',
            'slug' => 'suits'
        ]);

        Style::create([
            'id' => Str::uuid(),
            'name' => 'Classic Suit',
            'slug' => 'classic-suit',
            'description' => 'A classic suit',
            'category_id' => $category->id,
            'is_published' => true,
        ]);

        Style::create([
            'id' => Str::uuid(),
            'name' => 'Hidden Suit',
            'slug' => 'hidden-suit',
            'description' => 'A hidden suit',
            'category_id' => $category->id,
            'is_published' => false,
        ]);

        $response = $this->getJson('/api/v1/styles');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data')
                 ->assertJsonPath('data.0.name', 'Classic Suit');
    }

    public function test_admin_can_see_unpublished_styles()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('test')->plainTextToken;

        Style::create([
            'id' => Str::uuid(),
            'name' => 'Hidden Suit',
            'slug' => 'hidden-suit',
            'description' => 'A hidden suit',
            'is_published' => false,
        ]);

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
                         ->getJson('/api/v1/styles');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data');
    }

    public function test_customer_can_save_style()
    {
        $user = User::factory()->create(['role' => 'customer']);
        $token = $user->createToken('test')->plainTextToken;

        $style = Style::create([
            'id' => Str::uuid(),
            'name' => 'Classic Suit',
            'slug' => 'classic-suit',
            'description' => 'A classic suit',
            'is_published' => true,
        ]);

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
                         ->postJson("/api/v1/styles/{$style->id}/save");

        $response->assertStatus(200);

        $this->assertDatabaseHas('saved_styles', [
            'user_id' => $user->id,
            'style_id' => $style->id,
        ]);
    }

    public function test_can_show_style_by_slug()
    {
        $style = Style::create([
            'id' => Str::uuid(),
            'name' => 'Classic Suit',
            'slug' => 'classic-suit',
            'description' => 'A classic suit',
            'is_published' => true,
        ]);

        $response = $this->getJson("/api/v1/styles/{$style->slug}");
        $response->assertStatus(200)
                 ->assertJsonPath('data.id', (string) $style->id);
    }

    public function test_can_show_style_by_id()
    {
        $style = Style::create([
            'id' => Str::uuid(),
            'name' => 'Classic Suit',
            'slug' => 'classic-suit',
            'description' => 'A classic suit',
            'is_published' => true,
        ]);

        $response = $this->getJson("/api/v1/styles/{$style->id}");
        $response->assertStatus(200)
                 ->assertJsonPath('data.id', (string) $style->id);
    }
}
