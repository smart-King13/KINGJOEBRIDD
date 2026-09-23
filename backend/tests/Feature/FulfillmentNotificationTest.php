<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Orders\Order;
use App\Models\Quotes\Quote;
use App\Models\Fulfillment\Fulfillment;
use App\Notifications\FulfillmentUpdatedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;
use Illuminate\Support\Str;

class FulfillmentNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_receives_notification_after_fulfillment_status_changes()
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
            'production_status' => 'ready',
            'snapshot' => []
        ]);

        // Create fulfillment
        $response = $this->actingAs($admin)->postJson("/api/v1/orders/{$order->id}/fulfillment", [
            'type' => 'delivery',
            'status' => 'pending'
        ]);

        $response->assertStatus(200);

        Notification::assertSentTo(
            [$customer], FulfillmentUpdatedNotification::class
        );

        Notification::fake();

        // Update fulfillment status
        $response = $this->actingAs($admin)->postJson("/api/v1/orders/{$order->id}/fulfillment", [
            'type' => 'delivery',
            'status' => 'shipped'
        ]);

        $response->assertStatus(200);

        Notification::assertSentTo(
            [$customer], FulfillmentUpdatedNotification::class
        );
    }

    public function test_unchanged_fulfillment_status_does_not_create_notification()
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
            'production_status' => 'ready',
            'snapshot' => []
        ]);

        Fulfillment::create([
            'id' => Str::uuid(),
            'order_id' => $order->id,
            'type' => 'delivery',
            'status' => 'shipped'
        ]);

        $response = $this->actingAs($admin)->postJson("/api/v1/orders/{$order->id}/fulfillment", [
            'type' => 'delivery',
            'status' => 'shipped'
        ]);

        $response->assertStatus(200);

        Notification::assertNothingSent();
    }
}
