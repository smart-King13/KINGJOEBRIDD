<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->query('per_page', 15), 100);

        $notifications = $request->user()
            ->notifications()
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        $unreadCount = $request->user()->unreadNotifications()->count();

        $response = NotificationResource::collection($notifications)->response()->getData(true);
        
        return response()->json([
            'status' => 'success',
            'data' => $response['data'],
            'meta' => [
                'pagination' => [
                    'total' => $response['meta']['total'],
                    'count' => $response['meta']['to'] - $response['meta']['from'] + 1,
                    'per_page' => $response['meta']['per_page'],
                    'current_page' => $response['meta']['current_page'],
                    'total_pages' => $response['meta']['last_page'],
                ],
                'unread_count' => $unreadCount,
            ]
        ]);
    }

    public function markAsRead(Request $request, string $id): JsonResponse
    {
        $notification = $request->user()->notifications()->where('id', $id)->first();

        if (!$notification) {
            return $this->error('Notification not found.', 404);
        }

        $notification->markAsRead();

        return $this->success(new NotificationResource($notification->fresh()), 'Notification marked as read.');
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $request->user()->unreadNotifications->markAsRead();

        return $this->success([
            'unread_count' => 0
        ], 'All notifications marked as read.');
    }
}
