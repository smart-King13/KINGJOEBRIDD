<?php

namespace Tests\Feature\Api\V1\Orders;

use App\Models\Orders\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Str;

class ProductionUpdateValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_valid_production_statuses_are_accepted()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('test')->plainTextToken;

        $order = Order::create([
            'id' => Str::uuid(),
            'user_id' => User::factory()->create()->id,
            'payment_status' => 'paid_in_full',
            'production_status' => 'not_started',
        ]);

        $validStatuses = ['not_started', 'cutting', 'sewing', 'finishing', 'quality_check', 'ready'];

        foreach ($validStatuses as $status) {
            $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
                             ->postJson("/api/v1/orders/{$order->id}/production-updates", [
                                 'status' => $status,
                                 'note' => 'Update to ' . $status,
                             ]);

            $response->assertStatus(201)
                     ->assertJsonPath('data.status', $status);
        }
    }

    public function test_invalid_production_statuses_are_rejected()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('test')->plainTextToken;

        $order = Order::create([
            'id' => Str::uuid(),
            'user_id' => User::factory()->create()->id,
            'payment_status' => 'paid_in_full',
            'production_status' => 'not_started',
        ]);

        $invalidStatuses = ['completed', 'delivered', 'picked_up', 'arbitrary_invalid'];

        foreach ($invalidStatuses as $status) {
            $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
                             ->postJson("/api/v1/orders/{$order->id}/production-updates", [
                                 'status' => $status,
                             ]);

            $response->assertStatus(422)
                     ->assertJsonValidationErrors(['status']);
        }
    }
}
