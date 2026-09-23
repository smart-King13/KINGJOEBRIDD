<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\QuoteResource;
use App\Http\Responses\ApiResponse;
use App\Models\Quotes\Quote;
use App\Models\Orders\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class QuoteController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Quote::with(['items', 'user']);

        if ($request->user()->role !== 'admin') {
            $query->where('user_id', $request->user()->id);
        }

        $quotes = $query->latest()->paginate(15);
        return $this->success(QuoteResource::collection($quotes)->response()->getData(true));
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $quote = Quote::with(['items', 'user'])->findOrFail($id);

        if ($request->user()->role !== 'admin' && $quote->user_id !== $request->user()->id) {
            return $this->error('Unauthorized.', 403);
        }

        return $this->success(new QuoteResource($quote));
    }

    public function store(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return $this->error('Unauthorized. Only admins can create quotes.', 403);
        }

        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'conversation_id' => ['nullable', 'uuid', 'exists:conversations,id'],
            'discount' => ['nullable', 'integer', 'min:0'],
            'notes' => ['nullable', 'string'],
            'expires_at' => ['nullable', 'date'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.type' => ['required', 'string'],
            'items.*.description' => ['required', 'string'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'integer', 'min:0'],
        ]);

        $quote = DB::transaction(function () use ($validated) {
            $subtotal = 0;
            foreach ($validated['items'] as $item) {
                $subtotal += $item['quantity'] * $item['unit_price'];
            }

            $discount = $validated['discount'] ?? 0;
            $total = max(0, $subtotal - $discount);

            $quote = Quote::create([
                'id' => Str::uuid(),
                'user_id' => $validated['user_id'],
                'conversation_id' => $validated['conversation_id'] ?? null,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'total' => $total,
                'status' => 'draft',
                'notes' => $validated['notes'] ?? null,
                'expires_at' => $validated['expires_at'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                $quote->items()->create([
                    'id' => Str::uuid(),
                    'type' => $item['type'],
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['quantity'] * $item['unit_price'],
                ]);
            }

            return $quote;
        });

        return $this->success(new QuoteResource($quote->load('items')), 'Quote created.', 201);
    }

    public function send(Request $request, string $id): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return $this->error('Unauthorized.', 403);
        }

        $quote = Quote::findOrFail($id);

        if ($quote->status !== 'draft') {
            return $this->error('Only draft quotes can be sent.', 422);
        }

        $quote->update(['status' => 'sent']);

        $quote->user->notify(new \App\Notifications\QuoteSentNotification($quote->id));

        return $this->success(new QuoteResource($quote), 'Quote sent.');
    }

    public function accept(Request $request, string $id): JsonResponse
    {
        $quote = Quote::with('items')->findOrFail($id);

        if ($request->user()->role !== 'admin' && $quote->user_id !== $request->user()->id) {
            return $this->error('Unauthorized.', 403);
        }

        if ($quote->status !== 'sent') {
            return $this->error('Only sent quotes can be accepted.', 422);
        }

        if ($quote->expires_at && $quote->expires_at->isPast()) {
            $quote->update(['status' => 'expired']);
            return $this->error('Quote has expired.', 422);
        }

        $order = DB::transaction(function () use ($quote) {
            $quote->update([
                'status' => 'accepted',
                'accepted_at' => now(),
            ]);

            return Order::create([
                'id' => Str::uuid(),
                'user_id' => $quote->user_id,
                'quote_id' => $quote->id,
                'payment_status' => 'pending_payment',
                'production_status' => 'not_started',
                'snapshot' => [
                    'quote' => $quote->toArray(),
                    'customer_id' => $quote->user_id,
                    'accepted_at' => now()->toIso8601String(),
                ]
            ]);
        });

        $admins = \App\Models\User::where('role', 'admin')->get();
        \Illuminate\Support\Facades\Notification::send($admins, new \App\Notifications\QuoteAcceptedNotification($quote->id, $order->id));

        return $this->success(['order_id' => $order->id], 'Quote accepted and order generated.');
    }

    public function update(Request $request, string $id): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return $this->error('Unauthorized. Only admins can edit quotes.', 403);
        }

        $quote = Quote::findOrFail($id);

        if ($quote->status !== 'draft') {
            return $this->error('Only draft quotes can be edited.', 422);
        }

        $validated = $request->validate([
            'discount' => ['nullable', 'integer', 'min:0'],
            'notes' => ['nullable', 'string'],
            'expires_at' => ['nullable', 'date'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.type' => ['required', 'string'],
            'items.*.description' => ['required', 'string'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'integer', 'min:0'],
        ]);

        DB::transaction(function () use ($validated, $quote) {
            $quote->items()->delete();

            $subtotal = 0;
            foreach ($validated['items'] as $item) {
                $subtotal += $item['quantity'] * $item['unit_price'];
                
                $quote->items()->create([
                    'id' => Str::uuid(),
                    'type' => $item['type'],
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['quantity'] * $item['unit_price'],
                ]);
            }

            $discount = $validated['discount'] ?? 0;
            $total = max(0, $subtotal - $discount);

            $quote->update([
                'subtotal' => $subtotal,
                'discount' => $discount,
                'total' => $total,
                'notes' => $validated['notes'] ?? null,
                'expires_at' => $validated['expires_at'] ?? null,
            ]);
        });

        return $this->success(new QuoteResource($quote->fresh('items')), 'Quote updated.');
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return $this->error('Unauthorized.', 403);
        }

        $quote = Quote::findOrFail($id);

        if ($quote->status !== 'draft') {
            return $this->error('Only draft quotes can be deleted.', 422);
        }

        $quote->delete();

        return response()->json(null, 204);
    }
}
