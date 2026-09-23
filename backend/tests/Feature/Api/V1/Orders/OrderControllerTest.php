<?php

namespace Tests\Feature\Api\V1\Orders;

use App\Models\Orders\Order;
use App\Models\Orders\ProductionStep;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Str;

class OrderControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_view_own_order()
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $token = $customer->createToken('test')->plainTextToken;

        $order = Order::create([
            'id' => Str::uuid(),
            'user_id' => $customer->id,
            'payment_status' => 'paid_in_full',
            'production_status' => 'not_started',
        ]);

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
                         ->getJson("/api/v1/orders/{$order->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('data.id', (string) $order->id);
    }

    public function test_admin_can_post_production_update()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('test')->plainTextToken;

        $order = Order::create([
            'id' => Str::uuid(),
            'user_id' => User::factory()->create()->id,
            'payment_status' => 'paid_in_full',
            'production_status' => 'not_started',
        ]);

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
                         ->postJson("/api/v1/orders/{$order->id}/production-updates", [
                             'status' => 'cutting',
                             'note' => 'Fabric cutting started.',
                         ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.status', 'cutting');

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'production_status' => 'cutting',
        ]);
    }
}
