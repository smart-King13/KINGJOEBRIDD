<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\StyleRequests\Attachment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class AttachmentController extends Controller
{
    use ApiResponse;

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:jpeg,jpg,png,pdf', 'max:10240'], // 10MB limit
        ]);

        $file = $request->file('file');
        
        // Use Supabase/S3 disk if configured, fallback to local
        $path = Storage::disk('public')->putFile('attachments/' . $request->user()->id, $file);
        
        $attachment = Attachment::create([
            'id' => Str::uuid(),
            'uploader_id' => $request->user()->id,
            'original_filename' => $file->getClientOriginalName(),
            'storage_path' => $path,
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            // Assign dummy values for non-nullable morph fields until attached
            'attachable_type' => 'PendingAttachment',
            'attachable_id' => Str::uuid(),
        ]);

        return $this->success(
            new \App\Http\Resources\AttachmentResource($attachment), 
            'Attachment uploaded successfully.', 
            201
        );
    }
}
