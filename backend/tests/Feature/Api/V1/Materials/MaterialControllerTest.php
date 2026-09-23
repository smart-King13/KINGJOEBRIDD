<?php

namespace Tests\Feature\Api\V1\Materials;

use App\Models\Materials\Material;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Str;

class MaterialControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_published_materials()
    {
        Material::create([
            'id' => Str::uuid(),
            'name' => 'Silk',
            'type' => 'fabric',
            'is_published' => true,
        ]);

        Material::create([
            'id' => Str::uuid(),
            'name' => 'Hidden Cotton',
            'type' => 'fabric',
            'is_published' => false,
        ]);

        $response = $this->getJson('/api/v1/materials');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data')
                 ->assertJsonPath('data.0.name', 'Silk');
    }

    public function test_admin_can_see_unpublished_materials()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('test')->plainTextToken;

        Material::create([
            'id' => Str::uuid(),
            'name' => 'Hidden Cotton',
            'type' => 'fabric',
            'is_published' => false,
        ]);

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
                         ->getJson('/api/v1/materials');

        $response->assertStatus(200)
                 ->assertJsonCount(1, 'data');
    }
}
