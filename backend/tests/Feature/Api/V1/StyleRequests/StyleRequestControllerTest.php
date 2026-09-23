<?php

namespace Tests\Feature\Api\V1\StyleRequests;

use App\Models\Styles\Style;
use App\Models\Styles\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StyleRequestControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
    }

    public function test_customer_can_create_style_request()
    {
        $customer = User::factory()->create(['role' => 'customer']);
        
        $payload = [
            'description' => 'I want a bespoke suit.',
            'preferred_color' => 'Navy Blue',
            'preferred_material' => 'Wool',
            'sourcing_preference' => 'kingjoebridd_sourced',
            'notes' => 'Need it by next month.',
        ];

        $response = $this->actingAs($customer)->postJson('/api/v1/style-requests', $payload);

        $response->assertStatus(201)
                 ->assertJsonPath('data.description', 'I want a bespoke suit.')
                 ->assertJsonPath('data.preferred_color', 'Navy Blue')
                 ->assertJsonPath('data.sourcing_preference', 'kingjoebridd_sourced');

        $this->assertDatabaseHas('style_requests', [
            'user_id' => $customer->id,
            'description' => 'I want a bespoke suit.',
            'preferred_color' => 'Navy Blue',
            'preferred_material' => 'Wool',
            'sourcing_preference' => 'kingjoebridd_sourced',
            'status' => 'pending',
            'notes' => 'Need it by next month.',
        ]);
    }

    public function test_customer_can_create_style_request_with_style_id()
    {
        $customer = User::factory()->create(['role' => 'customer']);
        
        $category = Category::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'name' => 'Suits',
            'slug' => 'suits',
            'description' => 'Test',
        ]);
        
        $style = Style::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'category_id' => $category->id,
            'name' => 'Test Style',
            'slug' => 'test-style',
            'description' => 'Test',
        ]);

        $payload = [
            'style_id' => $style->id,
            'description' => 'Make this but in red.',
        ];

        $response = $this->actingAs($customer)->postJson('/api/v1/style-requests', $payload);

        $response->assertStatus(201)
                 ->assertJsonPath('data.style_id', (string) $style->id)
                 ->assertJsonPath('data.description', 'Make this but in red.');

        $this->assertDatabaseHas('style_requests', [
            'user_id' => $customer->id,
            'style_id' => (string) $style->id,
            'description' => 'Make this but in red.',
        ]);
    }

    public function test_unsupported_fields_are_ignored()
    {
        $customer = User::factory()->create(['role' => 'customer']);
        
        $payload = [
            'description' => 'I want a bespoke suit.',
            'title' => 'This should be ignored',
            'budget_range' => '$500',
        ];

        $response = $this->actingAs($customer)->postJson('/api/v1/style-requests', $payload);

        $response->assertStatus(201)
                 ->assertJsonPath('data.description', 'I want a bespoke suit.')
                 ->assertJsonMissing(['data' => ['title' => 'This should be ignored']]);
    }

    public function test_description_is_required()
    {
        $customer = User::factory()->create(['role' => 'customer']);
        
        $payload = [
            'preferred_color' => 'Navy Blue',
        ];

        $response = $this->actingAs($customer)->postJson('/api/v1/style-requests', $payload);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['description']);
    }

    public function test_invalid_style_id_is_rejected()
    {
        $customer = User::factory()->create(['role' => 'customer']);
        
        $payload = [
            'style_id' => 'not-a-uuid',
            'description' => 'Hello',
        ];

        $response = $this->actingAs($customer)->postJson('/api/v1/style-requests', $payload);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['style_id']);
    }

    public function test_unauthenticated_cannot_create_request()
    {
        $payload = [
            'description' => 'I want a bespoke suit.',
        ];

        $response = $this->postJson('/api/v1/style-requests', $payload);

        $response->assertStatus(401);
    }
}
