<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Orders\Order;
use App\Models\Quotes\Quote;
use App\Notifications\ProductionUpdatedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;
use Illuminate\Support\Str;

class ProductionNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_receives_notification_after_actual_production_status_change()
    {
        Notification::fake();

        $admin = User::factory()->create(['role' => 'admin']);
        $customer = User::factory()->create(['role' => 'customer']);

        $quote = Quote::create([
            'id' => Str::uuid(),
            'user_id' => $customer->id,
            'status' => 'accepted',
            'subtotal' => 1000,
            'total' => 1000,
            'discount' => 0
        ]);

        $order = Order::create([
            'id' => Str::uuid(),
            'user_id' => $customer->id,
            'quote_id' => $quote->id,
            'payment_status' => 'pending_payment',
            'production_status' => 'not_started',
            'snapshot' => []
        ]);

        $response = $this->actingAs($admin)->postJson("/api/v1/orders/{$order->id}/production-updates", [
            'status' => 'cutting',
            'note' => 'Starting cut.'
        ]);

        $response->assertStatus(201);
        $this->assertEquals('cutting', $order->fresh()->production_status);

        Notification::assertSentTo(
            [$customer], ProductionUpdatedNotification::class
        );
    }

    public function test_unchanged_production_status_does_not_create_notification()
    {
        Notification::fake();

        $admin = User::factory()->create(['role' => 'admin']);
        $customer = User::factory()->create(['role' => 'customer']);

        $quote = Quote::create([
            'id' => Str::uuid(),
            'user_id' => $customer->id,
            'status' => 'accepted',
            'subtotal' => 1000,
            'total' => 1000,
            'discount' => 0
        ]);

        $order = Order::create([
            'id' => Str::uuid(),
            'user_id' => $customer->id,
            'quote_id' => $quote->id,
            'payment_status' => 'pending_payment',
            'production_status' => 'cutting',
            'snapshot' => []
        ]);

        $response = $this->actingAs($admin)->postJson("/api/v1/orders/{$order->id}/production-updates", [
            'status' => 'cutting',
            'note' => 'Still cutting.'
        ]);

        $response->assertStatus(201);

        Notification::assertNothingSent();
    }
}
