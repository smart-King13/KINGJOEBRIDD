<?php

namespace Tests\Feature\Api\V1\Conversations;

use App\Models\Conversations\Conversation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Str;

class ConversationControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_conversation()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
                         ->postJson('/api/v1/conversations', [
                             'context_type' => 'style',
                             'context_id' => Str::uuid()->toString(),
                         ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['data' => ['id', 'context_type']]);
    }

    public function test_can_reuse_conversation_for_same_context()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;
        $contextId = Str::uuid()->toString();

        $this->withHeaders(['Authorization' => 'Bearer ' . $token])
             ->postJson('/api/v1/conversations', [
                 'context_type' => 'style',
                 'context_id' => $contextId,
             ]);

        $response2 = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
                          ->postJson('/api/v1/conversations', [
                              'context_type' => 'style',
                              'context_id' => $contextId,
                          ]);

        $response2->assertStatus(200)
                  ->assertJsonPath('message', 'Conversation reused.');

        $this->assertDatabaseCount('conversations', 1);
    }

    public function test_customer_cannot_view_others_conversations()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $token2 = $user2->createToken('test')->plainTextToken;

        $convo = Conversation::create([
            'id' => Str::uuid(),
            'user_id' => $user1->id,
        ]);

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token2])
                         ->getJson("/api/v1/conversations/{$convo->id}");

        $response->assertStatus(403);
    }

    public function test_conversation_list_returns_latest_message_and_updated_at()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $convo = Conversation::create([
            'id' => Str::uuid(),
            'user_id' => $user->id,
            'updated_at' => now()->subDay(),
        ]);

        $msg = \App\Models\Conversations\Message::create([
            'id' => Str::uuid(),
            'conversation_id' => $convo->id,
            'sender_id' => $user->id,
            'body' => 'Hello test',
        ]);

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
                         ->getJson("/api/v1/conversations");

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => [
                             'id',
                             'updated_at',
                             'latest_message' => [
                                 'id',
                                 'content'
                             ]
                         ]
                     ]
                 ])
                 ->assertJsonPath('data.0.latest_message.content', 'Hello test');
    }
}
