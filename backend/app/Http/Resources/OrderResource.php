<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\CustomerResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'payment_status' => $this->payment_status,
            'production_status' => $this->production_status,
            'snapshot' => $this->snapshot,
            'created_at' => $this->created_at,
            'production_updates' => ProductionUpdateResource::collection($this->whenLoaded('productionUpdates')),
            'user' => $this->whenLoaded('user', fn($user) => new CustomerResource($user)),
        ];
    }
}
