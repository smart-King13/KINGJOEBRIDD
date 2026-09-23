<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MaterialResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'type' => $this->type,
            'is_available' => $this->is_available,
            'base_price' => $this->base_price,
            'images' => $this->whenLoaded('images'),
            'created_at' => $this->created_at,
        ];
    }
}
