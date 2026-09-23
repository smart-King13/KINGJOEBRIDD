<?php

namespace Tests\Feature\Api\V1\Quotes;

use App\Models\Quotes\Quote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Str;

class QuoteControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_quote()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $customer = User::factory()->create(['role' => 'customer']);
        $token = $admin->createToken('test')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
                         ->postJson('/api/v1/quotes', [
                             'user_id' => $customer->id,
                             'discount' => 100000,
                             'items' => [
                                 [
                                     'type' => 'style',
                                     'description' => 'Classic Suit',
                                     'quantity' => 1,
                                     'unit_price' => 500000,
                                 ]
                             ]
                         ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.subtotal', 500000)
                 ->assertJsonPath('data.discount', 100000)
                 ->assertJsonPath('data.total', 400000)
                 ->assertJsonPath('data.status', 'draft');
    }

    public function test_customer_can_accept_quote_and_generate_order()
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $token = $customer->createToken('test')->plainTextToken;

        $quote = Quote::create([
            'id' => Str::uuid(),
            'user_id' => $customer->id,
            'subtotal' => 500000,
            'discount' => 0,
            'total' => 500000,
            'status' => 'sent',
        ]);

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
                         ->postJson("/api/v1/quotes/{$quote->id}/accept");

        $response->assertStatus(200)
                 ->assertJsonStructure(['data' => ['order_id']]);

        $this->assertDatabaseHas('quotes', [
            'id' => $quote->id,
            'status' => 'accepted',
        ]);

        $this->assertDatabaseHas('orders', [
            'quote_id' => $quote->id,
            'payment_status' => 'pending_payment',
        ]);
    }
}
