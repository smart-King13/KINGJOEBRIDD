<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Http\Responses\ApiResponse;
use App\Models\Orders\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Order::with('user');

        if ($request->user()->role !== 'admin') {
            $query->where('user_id', $request->user()->id);
        }

        $orders = $query->latest()->paginate(15);

        return $this->success(OrderResource::collection($orders)->response()->getData(true));
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $order = Order::with(['productionUpdates', 'user'])->findOrFail($id);

        if ($request->user()->role !== 'admin' && $order->user_id !== $request->user()->id) {
            return $this->error('Unauthorized.', 403);
        }

        return $this->success(new OrderResource($order));
    }
}
