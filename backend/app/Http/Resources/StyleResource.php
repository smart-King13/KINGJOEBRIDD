<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StyleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'is_featured' => $this->is_featured,
            'is_published' => $this->is_published,
            'is_saved' => (bool) ($this->is_saved ?? false),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'collection' => new CollectionResource($this->whenLoaded('collection')),
            'images' => $this->whenLoaded('images'),
            'metadata' => $this->metadata,
            'created_at' => $this->created_at,
        ];
    }
}
