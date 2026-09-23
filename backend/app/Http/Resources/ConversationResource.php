<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\CustomerResource;

class ConversationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'context_type' => $this->contextable_type,
            'context_id' => $this->contextable_id,
            'status' => 'active', // Schema doesn't have status, defaulting to active
            'unread_count' => $this->unread_count ?? 0,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'messages' => MessageResource::collection($this->whenLoaded('messages')),
            'latest_message' => $this->relationLoaded('latestMessage') && $this->latestMessage 
                ? new MessageResource($this->latestMessage) 
                : null,
            'user' => $this->whenLoaded('user', fn($user) => new CustomerResource($user)),
        ];
    }
}
