<?php

namespace Tests\Feature\Api\V1\Styles;

use App\Models\Styles\Style;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class SavedStyleTest extends TestCase
{
    use RefreshDatabase;

    private function createStyle(): Style
    {
        return Style::create([
            'name' => 'Test Style ' . Str::random(5),
            'slug' => 'test-style-' . Str::random(5),
            'description' => 'Test description',
            'is_published' => true,
        ]);
    }

    public function test_customer_can_toggle_save_style(): void
    {
        $user = User::factory()->create();
        $style = $this->createStyle();

        $this->actingAs($user, 'sanctum');

        // Save
        $response = $this->postJson("/api/v1/styles/{$style->id}/save");
        $response->assertStatus(200)
            ->assertJsonPath('message', 'Style saved successfully.');
            
        $this->assertDatabaseHas('saved_styles', [
            'user_id' => $user->id,
            'style_id' => $style->id,
        ]);

        // Unsave
        $response = $this->deleteJson("/api/v1/styles/{$style->id}/save");
        $response->assertStatus(200)
            ->assertJsonPath('message', 'Style unsaved successfully.');

        $this->assertDatabaseMissing('saved_styles', [
            'user_id' => $user->id,
            'style_id' => $style->id,
        ]);
    }

    public function test_unauthenticated_user_cannot_save_style(): void
    {
        $style = $this->createStyle();

        $response = $this->postJson("/api/v1/styles/{$style->id}/save");
        $response->assertStatus(401);
    }

    public function test_style_returns_is_saved_for_authenticated_customer(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $style = $this->createStyle();

        // Saved by user 1
        $style->savedByUsers()->attach($user->id, ['id' => (string) Str::uuid()]);

        // Assert for user 1
        $this->actingAs($user, 'sanctum');
        $response = $this->getJson("/api/v1/styles/{$style->slug}");
        $response->assertStatus(200)
            ->assertJsonPath('data.is_saved', true);

        // Assert for user 2 (should be false)
        $this->actingAs($otherUser, 'sanctum');
        $response = $this->getJson("/api/v1/styles/{$style->slug}");
        $response->assertStatus(200)
            ->assertJsonPath('data.is_saved', false);
    }

    public function test_style_listing_returns_is_saved_without_n_plus_one_issue(): void
    {
        $user = User::factory()->create();
        
        $savedStyle = $this->createStyle();
        $this->createStyle();
        $this->createStyle();
        
        $savedStyle->savedByUsers()->attach($user->id, ['id' => (string) Str::uuid()]);

        $this->actingAs($user, 'sanctum');
        
        $response = $this->getJson('/api/v1/styles');
        $response->assertStatus(200);

        $styles = $response->json('data');
        
        // Assert only the one is saved
        $savedCount = 0;
        foreach ($styles as $s) {
            if ($s['is_saved'] === true) {
                $savedCount++;
                $this->assertEquals($savedStyle->id, $s['id']);
            }
        }
        $this->assertEquals(1, $savedCount);
    }

    public function test_unauthenticated_user_sees_is_saved_false(): void
    {
        $style = $this->createStyle();

        $response = $this->getJson("/api/v1/styles/{$style->slug}");
        $response->assertStatus(200)
            ->assertJsonPath('data.is_saved', false);
    }

    public function test_customer_can_get_their_saved_styles(): void
    {
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        
        $style1 = $this->createStyle();
        $style2 = $this->createStyle();
        $style3 = $this->createStyle();
        
        $style1->savedByUsers()->attach($user->id, ['id' => (string) Str::uuid()]);
        $style2->savedByUsers()->attach($user->id, ['id' => (string) Str::uuid()]);
        
        $style3->savedByUsers()->attach($otherUser->id, ['id' => (string) Str::uuid()]);

        $this->actingAs($user, 'sanctum');
        $response = $this->getJson('/api/v1/saved-styles');
        
        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
        
        foreach ($response->json('data') as $s) {
            $this->assertTrue($s['is_saved']);
        }
    }
}
