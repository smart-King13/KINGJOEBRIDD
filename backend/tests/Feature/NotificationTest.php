<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\MessageReceivedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_customer_can_retrieve_notifications()
    {
        $user = User::factory()->create();
        $user->notify(new MessageReceivedNotification(Str::uuid()->toString()));

        $response = $this->actingAs($user)->getJson('/api/v1/notifications');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => [
                    '*' => ['id', 'type', 'data', 'read_at', 'created_at']
                ],
                'meta' => [
                    'pagination',
                    'unread_count'
                ]
            ]);

        $this->assertCount(1, $response->json('data'));
        $this->assertEquals(1, $response->json('meta.unread_count'));
    }

    public function test_guest_cannot_retrieve_notifications()
    {
        $response = $this->getJson('/api/v1/notifications');
        $response->assertStatus(401);
    }

    public function test_customer_cannot_access_another_users_notification()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $user1->notify(new MessageReceivedNotification(Str::uuid()->toString()));
        $notification = $user1->notifications()->first();

        $response = $this->actingAs($user2)->patchJson("/api/v1/notifications/{$notification->id}/read");
        
        $response->assertStatus(404);
    }

    public function test_customer_can_mark_their_notification_as_read()
    {
        $user = User::factory()->create();
        $user->notify(new MessageReceivedNotification(Str::uuid()->toString()));
        $notification = $user->notifications()->first();

        $this->assertNull($notification->read_at);

        $response = $this->actingAs($user)->patchJson("/api/v1/notifications/{$notification->id}/read");

        $response->assertStatus(200);
        $this->assertNotNull($response->json('data.read_at'));
        
        $this->assertEquals(0, $user->unreadNotifications()->count());
    }

    public function test_marking_an_already_read_notification_is_safe()
    {
        $user = User::factory()->create();
        $user->notify(new MessageReceivedNotification(Str::uuid()->toString()));
        $notification = $user->notifications()->first();
        $notification->markAsRead();

        $response = $this->actingAs($user)->patchJson("/api/v1/notifications/{$notification->id}/read");

        $response->assertStatus(200);
    }

    public function test_customer_can_mark_all_notifications_as_read()
    {
        $user = User::factory()->create();
        $user->notify(new MessageReceivedNotification(Str::uuid()->toString()));
        $user->notify(new MessageReceivedNotification(Str::uuid()->toString()));

        $this->assertEquals(2, $user->unreadNotifications()->count());

        $response = $this->actingAs($user)->postJson('/api/v1/notifications/read-all');

        $response->assertStatus(200);
        $this->assertEquals(0, $response->json('data.unread_count'));
        $this->assertEquals(0, $user->unreadNotifications()->count());
    }

    public function test_pagination_works()
    {
        $user = User::factory()->create();
        
        // Create 20 notifications
        for ($i = 0; $i < 20; $i++) {
            $user->notify(new MessageReceivedNotification(Str::uuid()->toString()));
        }

        $response = $this->actingAs($user)->getJson('/api/v1/notifications?per_page=15');

        $response->assertStatus(200);
        $this->assertCount(15, $response->json('data'));
        $this->assertEquals(20, $response->json('meta.pagination.total'));
    }

    public function test_notification_data_is_returned_in_expected_structure()
    {
        $user = User::factory()->create();
        $conversationId = Str::uuid()->toString();
        $user->notify(new MessageReceivedNotification($conversationId));

        $response = $this->actingAs($user)->getJson('/api/v1/notifications');

        $notificationData = $response->json('data.0');
        
        $this->assertEquals('MessageReceivedNotification', $notificationData['type']);
        $this->assertEquals('New Message', $notificationData['data']['title']);
        $this->assertEquals('view_conversation', $notificationData['data']['action']);
        $this->assertEquals($conversationId, $notificationData['data']['action_id']);
    }
}
