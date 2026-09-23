<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Orders\Order;
use App\Models\Payments\Payment;
use App\Models\Quotes\Quote;
use App\Notifications\PaymentSuccessfulNotification;
use App\Services\Payments\MockPaymentProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;
use Illuminate\Support\Str;
use Mockery;

class PaymentNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_successful_verification_creates_notification()
    {
        Notification::fake();

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

        $payment = Payment::create([
            'id' => Str::uuid(),
            'user_id' => $customer->id,
            'order_id' => $order->id,
            'quote_id' => $quote->id,
            'amount' => 500,
            'type' => 'deposit',
            'provider' => 'mock_provider',
            'provider_reference' => 'mock_ref_123',
            'status' => 'pending'
        ]);

        // Mock the provider to return successful verification
        $mockProvider = Mockery::mock(MockPaymentProvider::class)->makePartial();
        $mockProvider->shouldReceive('verifyPayment')->andReturn([
            'status' => 'successful',
            'reference' => 'mock_ref_123'
        ]);
        $this->app->instance(MockPaymentProvider::class, $mockProvider);

        $response = $this->actingAs($customer)->postJson("/api/v1/payments/{$payment->id}/verify");

        $response->assertStatus(200);
        $this->assertEquals('successful', $response->json('data.status'));

        Notification::assertSentTo(
            [$customer], PaymentSuccessfulNotification::class
        );
    }

    public function test_repeated_verification_does_not_create_duplicate_notification()
    {
        Notification::fake();

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
            'payment_status' => 'partially_paid',
            'production_status' => 'not_started',
            'snapshot' => []
        ]);

        $payment = Payment::create([
            'id' => Str::uuid(),
            'user_id' => $customer->id,
            'order_id' => $order->id,
            'quote_id' => $quote->id,
            'amount' => 500,
            'type' => 'deposit',
            'provider' => 'mock_provider',
            'provider_reference' => 'mock_ref_123',
            'status' => 'successful' // Already successful
        ]);

        $response = $this->actingAs($customer)->postJson("/api/v1/payments/{$payment->id}/verify");

        $response->assertStatus(200);

        Notification::assertNothingSent();
    }
}
