<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\FulfillmentResource;
use App\Http\Responses\ApiResponse;
use App\Models\Fulfillment\Fulfillment;
use App\Models\Orders\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FulfillmentController extends Controller
{
    use ApiResponse;

    public function show(Request $request, string $orderId): JsonResponse
    {
        $order = Order::findOrFail($orderId);

        if ($request->user()->role !== 'admin' && $order->user_id !== $request->user()->id) {
            return $this->error('Unauthorized.', 403);
        }

        $fulfillment = Fulfillment::where('order_id', $order->id)->first();

        if (!$fulfillment) {
            return $this->error('Fulfillment not found.', 404);
        }

        return $this->success(new FulfillmentResource($fulfillment));
    }

    public function store(Request $request, string $orderId): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return $this->error('Unauthorized.', 403);
        }

        $order = Order::findOrFail($orderId);

        $validated = $request->validate([
            'type' => 'required|string|in:pickup,delivery',
            'recipient_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'delivery_fee' => 'nullable|integer|min:0',
            'tracking_reference' => 'nullable|string|max:255',
            'status' => 'required|string|in:pending,shipped,ready_for_pickup,delivered,picked_up',
        ]);

        $fulfillment = Fulfillment::updateOrCreate(
            ['order_id' => $order->id],
            array_merge(['id' => Str::uuid()], $validated)
        );

        $wasChanged = $fulfillment->wasRecentlyCreated || $fulfillment->wasChanged('status');
        
        if ($wasChanged) {
            $order->user->notify(new \App\Notifications\FulfillmentUpdatedNotification($order->id, $fulfillment->status));
        }

        return $this->success(new FulfillmentResource($fulfillment), 'Fulfillment updated.');
    }
}
