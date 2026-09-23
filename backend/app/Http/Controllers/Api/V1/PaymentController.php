<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Http\Responses\ApiResponse;
use App\Models\Orders\Order;
use App\Models\Payments\Payment;
use App\Services\Payments\MockPaymentProvider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    use ApiResponse;

    protected $provider;

    public function __construct(MockPaymentProvider $provider)
    {
        // In reality, this would be injected via interface binding
        $this->provider = $provider;
    }

    public function initialize(Request $request, string $orderId): JsonResponse
    {
        $order = Order::with('quote')->findOrFail($orderId);

        if ($request->user()->role !== 'admin' && $order->user_id !== $request->user()->id) {
            return $this->error('Unauthorized.', 403);
        }

        $validated = $request->validate([
            'amount' => ['required', 'integer', 'min:1'],
            'type' => ['required', 'string', 'in:deposit,full,balance'],
        ]);

        $amount = $validated['amount'];

        // Validation: minimum deposit constraint (e.g. at least 50% for bespoke)
        $quoteTotal = $order->quote->total;
        $totalPaid = Payment::where('order_id', $order->id)->where('status', 'successful')->sum('amount');
        
        $balanceRemaining = $quoteTotal - $totalPaid;

        if ($amount > $balanceRemaining) {
            return $this->error('Amount exceeds the remaining balance.', 422);
        }

        if ($validated['type'] === 'deposit' && $totalPaid === 0) {
            if ($amount < ($quoteTotal * 0.5)) {
                return $this->error('Minimum deposit is 50% of the total.', 422);
            }
        }

        // Initialize with provider
        $providerResponse = $this->provider->initializePayment($order, $amount, $request->user()->email);

        $payment = Payment::create([
            'id' => Str::uuid(),
            'user_id' => $request->user()->id,
            'order_id' => $order->id,
            'quote_id' => $order->quote_id,
            'amount' => $amount,
            'type' => $validated['type'],
            'provider' => 'mock_provider',
            'provider_reference' => $providerResponse['reference'],
            'status' => 'pending',
        ]);

        return $this->success([
            'payment' => new PaymentResource($payment),
            'authorization_url' => $providerResponse['authorization_url'],
        ], 'Payment initialized.', 201);
    }

    public function verify(Request $request, string $id): JsonResponse
    {
        $payment = Payment::findOrFail($id);

        if ($request->user()->role !== 'admin' && $payment->user_id !== $request->user()->id) {
            return $this->error('Unauthorized.', 403);
        }

        if ($payment->status === 'successful') {
            return $this->success(new PaymentResource($payment), 'Payment already verified.');
        }

        $verification = $this->provider->verifyPayment($payment->provider_reference);

        if ($verification['status'] === 'successful') {
            DB::transaction(function () use ($payment) {
                // Lock payment row to prevent race conditions
                $lockedPayment = Payment::where('id', $payment->id)->lockForUpdate()->first();
                
                if ($lockedPayment->status !== 'successful') {
                    $lockedPayment->update([
                        'status' => 'successful',
                        'paid_at' => now(),
                    ]);

                    $order = Order::with('quote')->findOrFail($lockedPayment->order_id);
                    $totalPaid = Payment::where('order_id', $order->id)->where('status', 'successful')->sum('amount');

                    if ($totalPaid >= $order->quote->total) {
                        $order->update(['payment_status' => 'paid_in_full']);
                    } else {
                        $order->update(['payment_status' => 'partially_paid']);
                    }

                    $order->user->notify(new \App\Notifications\PaymentSuccessfulNotification($order->id, $lockedPayment->id, $lockedPayment->amount));
                }
            });
        }

        return $this->success(new PaymentResource($payment->fresh()), 'Payment synchronized.');
    }

    public function webhook(Request $request, string $provider): JsonResponse
    {
        // 1. Validate signature
        if (!$this->provider->validateWebhookSignature($request)) {
            return response()->json(['message' => 'Invalid signature'], 400);
        }

        $payload = $request->all();
        $reference = $payload['data']['reference'] ?? null;

        if (!$reference) {
            return response()->json(['message' => 'No reference provided'], 400);
        }

        // 2. Process idempotently
        DB::transaction(function () use ($reference) {
            $payment = Payment::where('provider_reference', $reference)->lockForUpdate()->first();

            if ($payment && $payment->status !== 'successful') {
                $payment->update([
                    'status' => 'successful',
                    'paid_at' => now(),
                ]);

                $order = Order::with('quote')->findOrFail($payment->order_id);
                $totalPaid = Payment::where('order_id', $order->id)->where('status', 'successful')->sum('amount');

                if ($totalPaid >= $order->quote->total) {
                    $order->update(['payment_status' => 'paid_in_full']);
                } else {
                    $order->update(['payment_status' => 'partially_paid']);
                }

                $order->user->notify(new \App\Notifications\PaymentSuccessfulNotification($order->id, $payment->id, $payment->amount));
            }
        });

        return response()->json(['status' => 'success']);
    }

    public function index(Request $request, string $orderId): JsonResponse
    {
        $order = Order::findOrFail($orderId);

        if ($request->user()->role !== 'admin' && $order->user_id !== $request->user()->id) {
            return $this->error('Unauthorized.', 403);
        }

        $payments = Payment::where('order_id', $order->id)->orderBy('created_at', 'desc')->get();

        return $this->success(PaymentResource::collection($payments));
    }
}
