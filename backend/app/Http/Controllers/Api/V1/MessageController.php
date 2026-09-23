<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\MessageResource;
use App\Http\Responses\ApiResponse;
use App\Models\Conversations\Conversation;
use App\Models\Conversations\Message;
use App\Models\StyleRequests\Attachment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    use ApiResponse;

    public function index(Request $request, string $conversationId): JsonResponse
    {
        $conversation = Conversation::findOrFail($conversationId);

        if ($request->user()->role !== 'admin' && $conversation->user_id !== $request->user()->id) {
            return $this->error('Unauthorized.', 403);
        }

        $messages = $conversation->messages()->with('attachments')->orderBy('created_at', 'asc')->paginate(50);

        return $this->success(MessageResource::collection($messages)->response()->getData(true));
    }

    public function store(Request $request, string $conversationId): JsonResponse
    {
        $conversation = Conversation::findOrFail($conversationId);

        if ($request->user()->role !== 'admin' && $conversation->user_id !== $request->user()->id) {
            return $this->error('Unauthorized.', 403);
        }

        $validated = $request->validate([
            'content' => ['nullable', 'string'],
            'attachment_ids' => ['nullable', 'array'],
            'attachment_ids.*' => ['uuid', 'exists:attachments,id'],
        ]);

        if (empty($validated['content']) && empty($validated['attachment_ids'])) {
            return $this->error('Message content or attachments required.', 422);
        }

        if (!empty($validated['attachment_ids'])) {
            $invalidAttachments = Attachment::whereIn('id', $validated['attachment_ids'])
                ->where('uploader_id', '!=', $request->user()->id)
                ->exists();

            if ($invalidAttachments) {
                return $this->error('Unauthorized attachment.', 403);
            }
        }

        $message = DB::transaction(function () use ($validated, $request, $conversation) {
            $msg = Message::create([
                'id' => Str::uuid(),
                'conversation_id' => $conversation->id,
                'sender_id' => $request->user()->id,
                'body' => $validated['content'] ?? null,
            ]);

            if (!empty($validated['attachment_ids'])) {
                Attachment::whereIn('id', $validated['attachment_ids'])
                    ->update([
                        'attachable_type' => 'message', // morph alias
                        'attachable_id' => $msg->id,
                    ]);
            }

            // Schema does not have last_message_at so we just touch the updated_at timestamp
            $conversation->touch();

            return $msg;
        });

        if ($request->user()->id === $conversation->user_id) {
            $admins = \App\Models\User::where('role', 'admin')->get();
            \Illuminate\Support\Facades\Notification::send($admins, new \App\Notifications\MessageReceivedNotification($conversation->id));
        } else {
            $conversation->user->notify(new \App\Notifications\MessageReceivedNotification($conversation->id));
        }

        return $this->success(new MessageResource($message->load('attachments')), 'Message sent successfully.', 201);
    }
}
