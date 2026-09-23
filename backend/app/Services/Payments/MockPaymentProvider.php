<?php

namespace App\Services\Payments;

use App\Models\Orders\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MockPaymentProvider implements PaymentProviderContract
{
    public function initializePayment(Order $order, int $amount, string $email): array
    {
        return [
            'authorization_url' => 'https://checkout.sandbox.payment/pay/' . Str::uuid(),
            'reference' => 'mock_txn_' . Str::random(10),
        ];
    }

    public function verifyPayment(string $reference): array
    {
        // For testing purposes, we assume verification succeeds
        return [
            'status' => 'successful',
            'amount' => 500000, // mock amount
            'currency' => 'NGN',
            'provider_reference' => $reference,
        ];
    }

    public function validateWebhookSignature(Request $request): bool
    {
        // For testing purposes, accept valid secret
        return $request->header('x-mock-signature') === 'valid-signature';
    }
}
