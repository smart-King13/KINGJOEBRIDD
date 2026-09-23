<?php

namespace App\Services\Payments;

use App\Models\Orders\Order;
use Illuminate\Http\Request;

interface PaymentProviderContract
{
    /**
     * Initialize a payment transaction with the provider.
     * 
     * @param Order $order
     * @param int $amount (in minor units / kobo)
     * @param string $email
     * @return array Contains 'authorization_url' and 'reference'
     */
    public function initializePayment(Order $order, int $amount, string $email): array;

    /**
     * Verify the payment with the provider.
     * 
     * @param string $reference
     * @return array Contains status, amount, currency, and provider_reference
     */
    public function verifyPayment(string $reference): array;

    /**
     * Validate the incoming webhook signature.
     * 
     * @param Request $request
     * @return bool
     */
    public function validateWebhookSignature(Request $request): bool;
}
