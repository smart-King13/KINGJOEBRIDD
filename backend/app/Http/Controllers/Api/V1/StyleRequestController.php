<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AttachmentResource;
use App\Http\Responses\ApiResponse;
use App\Http\Resources\StyleRequestResource;
use App\Models\StyleRequests\StyleRequest;
use App\Models\StyleRequests\Attachment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class StyleRequestController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = StyleRequest::with(['attachments', 'user', 'style.images']);

        if ($request->user()->role !== 'admin') {
            $query->where('user_id', $request->user()->id);
        }

        $requests = $query->latest()->paginate(15);
        return $this->success(
            StyleRequestResource::collection($requests)->response()->getData(true)
        );
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $styleRequest = StyleRequest::with(['attachments', 'user', 'style.images'])->findOrFail($id);

        if ($request->user()->role !== 'admin' && $styleRequest->user_id !== $request->user()->id) {
            return $this->error('Unauthorized.', 403);
        }

        return $this->success(new StyleRequestResource($styleRequest));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'style_id' => ['nullable', 'uuid', 'exists:styles,id'],
            'description' => ['required', 'string'],
            'preferred_color' => ['nullable', 'string', 'max:255'],
            'preferred_material' => ['nullable', 'string', 'max:255'],
            'sourcing_preference' => ['nullable', 'string', 'in:customer_provided,kingjoebridd_sourced'],
            'notes' => ['nullable', 'string'],
            'attachment_ids' => ['nullable', 'array'],
            'attachment_ids.*' => ['uuid', 'exists:attachments,id'],
        ]);

        if (!empty($validated['attachment_ids'])) {
            $invalidAttachments = Attachment::whereIn('id', $validated['attachment_ids'])
                ->where('uploader_id', '!=', $request->user()->id)
                ->exists();

            if ($invalidAttachments) {
                return $this->error('Unauthorized attachment.', 403);
            }
        }

        $styleRequest = DB::transaction(function () use ($validated, $request) {
            $sr = StyleRequest::create([
                'id' => Str::uuid(),
                'user_id' => $request->user()->id,
                'status' => 'pending',
                'style_id' => $validated['style_id'] ?? null,
                'description' => $validated['description'],
                'preferred_color' => $validated['preferred_color'] ?? null,
                'preferred_material' => $validated['preferred_material'] ?? null,
                'sourcing_preference' => $validated['sourcing_preference'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);

            if (!empty($validated['attachment_ids'])) {
                Attachment::whereIn('id', $validated['attachment_ids'])
                    ->update([
                        'attachable_type' => 'style_request', // morph alias
                        'attachable_id' => $sr->id,
                    ]);
            }

            return $sr;
        });

        return $this->success(new StyleRequestResource($styleRequest->load('attachments')), 'Style request created successfully.', 201);
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return $this->error('Unauthorized.', 403);
        }

        $styleRequest = StyleRequest::findOrFail($id);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,in_discussion,quote_sent,rejected,completed'],
        ]);

        $styleRequest->update(['status' => $validated['status']]);

        return $this->success(new StyleRequestResource($styleRequest), 'Status updated successfully.');
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        $styleRequest = StyleRequest::findOrFail($id);

        if ($request->user()->role !== 'admin' && $styleRequest->user_id !== $request->user()->id) {
            return $this->error('Unauthorized.', 403);
        }

        $styleRequest->delete();

        return $this->success(null, 'Style request deleted successfully.');
    }
}
