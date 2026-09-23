<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PaymentSuccessfulNotification extends Notification
{
    use Queueable;

    protected $orderId;
    protected $paymentId;
    protected $amount;

    public function __construct(string $orderId, string $paymentId, int $amount)
    {
        $this->orderId = $orderId;
        $this->paymentId = $paymentId;
        $this->amount = $amount;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'title' => 'Payment Successful',
            'message' => 'A payment has been successfully processed.',
            'action' => 'view_order',
            'action_id' => $this->orderId,
            'payment_id' => $this->paymentId,
            'amount' => $this->amount,
        ];
    }
}
