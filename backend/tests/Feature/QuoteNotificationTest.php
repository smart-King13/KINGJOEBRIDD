<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Quotes\Quote;
use App\Notifications\QuoteSentNotification;
use App\Notifications\QuoteAcceptedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;
use Illuminate\Support\Str;

class QuoteNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_receives_notification_when_quote_is_sent()
    {
        Notification::fake();

        $admin = User::factory()->create(['role' => 'admin']);
        $customer = User::factory()->create(['role' => 'customer']);

        $quote = Quote::create([
            'id' => Str::uuid(),
            'user_id' => $customer->id,
            'status' => 'draft',
            'subtotal' => 100,
            'total' => 100,
            'discount' => 0
        ]);

        $response = $this->actingAs($admin)->postJson("/api/v1/quotes/{$quote->id}/send");

        $response->assertStatus(200);

        Notification::assertSentTo(
            [$customer], QuoteSentNotification::class
        );
    }

    public function test_draft_quote_does_not_generate_notification()
    {
        Notification::fake();

        $admin = User::factory()->create(['role' => 'admin']);
        $customer = User::factory()->create(['role' => 'customer']);

        $response = $this->actingAs($admin)->postJson("/api/v1/quotes", [
            'user_id' => $customer->id,
            'items' => [
                ['type' => 'fabric', 'description' => 'Cotton', 'quantity' => 1, 'unit_price' => 100]
            ]
        ]);

        $response->assertStatus(201);

        Notification::assertNothingSent();
    }

    public function test_admin_receives_notification_when_quote_is_accepted()
    {
        Notification::fake();

        $admin = User::factory()->create(['role' => 'admin']);
        $customer = User::factory()->create(['role' => 'customer']);

        $quote = Quote::create([
            'id' => Str::uuid(),
            'user_id' => $customer->id,
            'status' => 'sent',
            'subtotal' => 100,
            'total' => 100,
            'discount' => 0
        ]);

        $response = $this->actingAs($customer)->postJson("/api/v1/quotes/{$quote->id}/accept");

        $response->assertStatus(200);

        Notification::assertSentTo(
            [$admin], QuoteAcceptedNotification::class
        );
    }
}
