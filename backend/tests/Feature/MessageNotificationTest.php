<?php

namespace Tests\Feature;

use App\Models\Conversations\Conversation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use App\Notifications\MessageReceivedNotification;
use Tests\TestCase;
use Illuminate\Support\Str;

class MessageNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_recipient_receives_notification_and_sender_does_not()
    {
        Notification::fake();

        $customer = User::factory()->create(['role' => 'customer']);
        $admin = User::factory()->create(['role' => 'admin']);

        $conversation = Conversation::create([
            'id' => Str::uuid(),
            'user_id' => $customer->id,
            'contextable_type' => 'some_type',
            'contextable_id' => Str::uuid()
        ]);

        // Customer sends a message
        $response = $this->actingAs($customer)->postJson("/api/v1/conversations/{$conversation->id}/messages", [
            'content' => 'Hello from customer'
        ]);

        $response->assertStatus(201);

        // Admin should receive it, customer should not
        Notification::assertSentTo(
            [$admin], MessageReceivedNotification::class
        );
        
        Notification::assertNotSentTo(
            [$customer], MessageReceivedNotification::class
        );

        // Reset fake
        Notification::fake();

        // Admin sends a message
        $response = $this->actingAs($admin)->postJson("/api/v1/conversations/{$conversation->id}/messages", [
            'content' => 'Hello from admin'
        ]);

        $response->assertStatus(201);

        // Customer should receive it, admin should not
        Notification::assertSentTo(
            [$customer], MessageReceivedNotification::class
        );

        Notification::assertNotSentTo(
            [$admin], MessageReceivedNotification::class
        );
    }
}
