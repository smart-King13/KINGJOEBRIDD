<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ConversationResource;
use App\Http\Responses\ApiResponse;
use App\Models\Conversations\Conversation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ConversationController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $isAdmin = $request->user()->role === 'admin';

        $query = Conversation::with(['latestMessage.attachments', 'user'])
            ->withCount(['messages as unread_count' => function ($query) use ($isAdmin, $userId) {
                // If admin, unread messages are those sent by customers (sender_id != admin id, or just role=customer)
                // If customer, unread messages are those sent by admin (sender_id != customer id)
                $query->whereNull('read_at')
                      ->where('sender_id', '!=', $userId);
            }]);

        if (!$isAdmin) {
            $query->where('user_id', $userId);
        }

        $conversations = $query->orderBy('updated_at', 'desc')->paginate(15);
        return $this->success(ConversationResource::collection($conversations)->response()->getData(true));
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $conversation = Conversation::with(['messages.attachments', 'user'])->findOrFail($id);

        if ($request->user()->role !== 'admin' && $conversation->user_id !== $request->user()->id) {
            return $this->error('Unauthorized.', 403);
        }

        return $this->success(new ConversationResource($conversation));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'context_type' => ['nullable', 'string', 'in:style,style_request,order'],
            'context_id' => ['nullable', 'uuid'],
        ]);

        $userId = $request->user()->id;

        // Try to reuse an existing conversation for the same exact context (I WANT THIS reuse)
        if (!empty($validated['context_type']) && !empty($validated['context_id'])) {
            $existing = Conversation::where('user_id', $userId)
                ->where('contextable_type', $validated['context_type'])
                ->where('contextable_id', $validated['context_id'])
                ->first();

            if ($existing) {
                return $this->success(new ConversationResource($existing), 'Conversation reused.', 200);
            }
        }

        $conversation = Conversation::create([
            'id' => Str::uuid(),
            'user_id' => $userId,
            'contextable_type' => $validated['context_type'] ?? null,
            'contextable_id' => $validated['context_id'] ?? null,
        ]);

        return $this->success(new ConversationResource($conversation), 'Conversation created successfully.', 201);
    }

    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $conversation = Conversation::findOrFail($id);

        if ($request->user()->role !== 'admin' && $conversation->user_id !== $request->user()->id) {
            return $this->error('Unauthorized.', 403);
        }

        // Mark messages as read that were sent by someone else
        $conversation->messages()
            ->whereNull('read_at')
            ->where('sender_id', '!=', $request->user()->id)
            ->update(['read_at' => now()]);

        return $this->success(null, 'Messages marked as read.');
    }
}
