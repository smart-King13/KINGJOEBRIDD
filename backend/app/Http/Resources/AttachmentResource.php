<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class AttachmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'file_name' => $this->original_filename,
            'file_type' => $this->mime_type,
            'file_size' => $this->size,
            'url' => Storage::disk('public')->url($this->storage_path),
            'created_at' => $this->created_at,
        ];
    }
}
