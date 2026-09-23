<?php

namespace Tests\Feature\Api\V1\Payments;

use App\Models\Orders\Order;
use App\Models\Payments\Payment;
use App\Models\Quotes\Quote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Str;

class PaymentControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_initialize_payment()
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $token = $customer->createToken('test')->plainTextToken;

        $quote = Quote::create([
            'id' => Str::uuid(),
            'user_id' => $customer->id,
            'subtotal' => 500000,
            'discount' => 0,
            'total' => 500000,
            'status' => 'accepted',
        ]);

        $order = Order::create([
            'id' => Str::uuid(),
            'user_id' => $customer->id,
            'quote_id' => $quote->id,
            'payment_status' => 'pending_payment',
        ]);

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
                         ->postJson("/api/v1/orders/{$order->id}/payments", [
                             'amount' => 500000,
                             'type' => 'full',
                         ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.payment.amount', 500000)
                 ->assertJsonPath('data.payment.status', 'pending')
                 ->assertJsonStructure(['data' => ['authorization_url']]);

        $this->assertDatabaseHas('payments', [
            'order_id' => $order->id,
            'status' => 'pending',
            'amount' => 500000,
        ]);
    }

    public function test_payment_webhook_processes_idempotently()
    {
        $customer = User::factory()->create(['role' => 'customer']);

        $quote = Quote::create([
            'id' => Str::uuid(),
            'user_id' => $customer->id,
            'subtotal' => 500000,
            'discount' => 0,
            'total' => 500000,
            'status' => 'accepted',
        ]);

        $order = Order::create([
            'id' => Str::uuid(),
            'user_id' => $customer->id,
            'quote_id' => $quote->id,
            'payment_status' => 'pending_payment',
        ]);

        $payment = Payment::create([
            'id' => Str::uuid(),
            'user_id' => $customer->id,
            'order_id' => $order->id,
            'quote_id' => $quote->id,
            'amount' => 500000,
            'type' => 'full',
            'provider' => 'mock_provider',
            'provider_reference' => 'mock_ref_123',
            'status' => 'pending',
        ]);

        // Trigger webhook
        $response = $this->withHeaders(['x-mock-signature' => 'valid-signature'])
                         ->postJson("/api/v1/payments/webhook/mock_provider", [
                             'data' => [
                                 'reference' => 'mock_ref_123'
                             ]
                         ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'successful',
        ]);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'payment_status' => 'paid_in_full',
        ]);
    }
}
