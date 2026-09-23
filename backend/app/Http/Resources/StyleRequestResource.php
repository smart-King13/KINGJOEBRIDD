<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\CustomerResource;
use App\Http\Resources\StyleResource;

class StyleRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'style_id' => $this->style_id,
            'status' => $this->status,
            'description' => $this->description,
            'preferred_color' => $this->preferred_color,
            'preferred_material' => $this->preferred_material,
            'sourcing_preference' => $this->sourcing_preference,
            'notes' => $this->notes,
            'attachments' => AttachmentResource::collection($this->whenLoaded('attachments')),
            'user' => $this->whenLoaded('user', fn($user) => new CustomerResource($user)),
            'style' => $this->whenLoaded('style', fn($style) => new StyleResource($style)),
            'created_at' => $this->created_at,
        ];
    }
}
