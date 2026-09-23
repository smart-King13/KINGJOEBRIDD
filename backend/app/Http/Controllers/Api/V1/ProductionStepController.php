<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductionStepResource;
use App\Http\Responses\ApiResponse;
use App\Models\Orders\Order;
use App\Models\Orders\ProductionStep;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProductionStepController extends Controller
{
    use ApiResponse;

    public function index(Request $request, string $orderId): JsonResponse
    {
        $order = Order::findOrFail($orderId);

        if ($request->user()->role !== 'admin' && $order->user_id !== $request->user()->id) {
            return $this->error('Unauthorized.', 403);
        }

        $steps = ProductionStep::where('order_id', $order->id)->orderBy('created_at', 'asc')->get();

        return $this->success(ProductionStepResource::collection($steps));
    }

    public function update(Request $request, string $orderId, string $stepId): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return $this->error('Unauthorized.', 403);
        }

        $order = Order::findOrFail($orderId);
        $step = ProductionStep::where('order_id', $order->id)->findOrFail($stepId);

        $validated = $request->validate([
            'status' => ['required', 'string', Rule::in(['pending', 'in_progress', 'completed', 'halted'])],
            'notes' => ['nullable', 'string'],
        ]);

        $updates = ['status' => $validated['status']];
        
        if (isset($validated['notes'])) {
            $updates['notes'] = $validated['notes'];
        }

        if ($validated['status'] === 'in_progress' && !$step->started_at) {
            $updates['started_at'] = now();
        }

        if ($validated['status'] === 'completed' && !$step->completed_at) {
            $updates['completed_at'] = now();
        }

        $step->update($updates);

        // Check if overall order status should change based on steps
        if ($validated['status'] === 'in_progress' && $order->production_status === 'not_started') {
            $order->update(['production_status' => 'cutting']);
        }

        return $this->success(new ProductionStepResource($step->fresh()), 'Production step updated.');
    }
}
