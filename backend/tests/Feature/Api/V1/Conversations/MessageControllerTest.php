<?php

namespace Tests\Feature\Api\V1\Conversations;

use App\Models\Conversations\Conversation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Str;

class MessageControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_send_message()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $convo = Conversation::create([
            'id' => Str::uuid(),
            'user_id' => $user->id,
        ]);

        $response = $this->withHeaders(['Authorization' => 'Bearer ' . $token])
                         ->postJson("/api/v1/conversations/{$convo->id}/messages", [
                             'content' => 'Hello World!',
                         ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.content', 'Hello World!');

        $this->assertDatabaseHas('messages', [
            'conversation_id' => $convo->id,
            'body' => 'Hello World!',
        ]);
    }
}
