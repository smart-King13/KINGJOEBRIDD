<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductionUpdateResource;
use App\Http\Responses\ApiResponse;
use App\Models\Orders\Order;
use App\Models\Production\ProductionUpdate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductionUpdateController extends Controller
{
    use ApiResponse;

    public function index(Request $request, string $orderId): JsonResponse
    {
        $order = Order::findOrFail($orderId);

        if ($request->user()->role !== 'admin' && $order->user_id !== $request->user()->id) {
            return $this->error('Unauthorized.', 403);
        }

        $updates = ProductionUpdate::where('order_id', $order->id)->orderBy('created_at', 'asc')->get();

        return $this->success(ProductionUpdateResource::collection($updates));
    }

    public function store(Request $request, string $orderId): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return $this->error('Unauthorized.', 403);
        }

        $order = Order::findOrFail($orderId);

        $validated = $request->validate([
            'status' => [
                'required',
                'string',
                \Illuminate\Validation\Rule::in([
                    'not_started',
                    'cutting',
                    'sewing',
                    'finishing',
                    'quality_check',
                    'ready',
                ]),
            ],
            'note' => ['nullable', 'string'],
        ]);

        $update = ProductionUpdate::create([
            'id' => Str::uuid(),
            'order_id' => $order->id,
            'status' => $validated['status'],
            'note' => $validated['note'] ?? null,
        ]);

        if ($order->production_status !== $validated['status']) {
            $order->update(['production_status' => $validated['status']]);
            $order->user->notify(new \App\Notifications\ProductionUpdatedNotification($order->id, $validated['status']));
        }

        return $this->success(new ProductionUpdateResource($update), 'Production update added.', 201);
    }
}
