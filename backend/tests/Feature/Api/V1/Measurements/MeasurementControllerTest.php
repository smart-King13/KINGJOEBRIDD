<?php

namespace Tests\Feature\Api\V1\Measurements;

use App\Models\Measurements\MeasurementProfile;
use App\Models\Measurements\MeasurementSet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Str;

class MeasurementControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_profile()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
                         ->postJson('/api/v1/measurement-profiles', [
                             'name' => 'My Main Profile',
                         ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.name', 'My Main Profile');
    }

    public function test_can_record_measurement_set()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $profile = MeasurementProfile::create([
            'id' => Str::uuid(),
            'user_id' => $user->id,
            'name' => 'Main',
        ]);

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
                         ->postJson("/api/v1/measurement-profiles/{$profile->id}/sets", [
                             'measurements' => ['chest' => 40, 'waist' => 32],
                         ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.version', 1)
                 ->assertJsonPath('data.is_approved', false);

        $response2 = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
                          ->postJson("/api/v1/measurement-profiles/{$profile->id}/sets", [
                              'measurements' => ['chest' => 41, 'waist' => 32],
                          ]);

        $response2->assertStatus(201)
                  ->assertJsonPath('data.version', 2);
    }
}
