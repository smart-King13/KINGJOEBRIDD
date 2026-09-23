<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class FulfillmentUpdatedNotification extends Notification
{
    use Queueable;

    protected $orderId;
    protected $fulfillmentStatus;

    public function __construct(string $orderId, string $fulfillmentStatus)
    {
        $this->orderId = $orderId;
        $this->fulfillmentStatus = $fulfillmentStatus;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'title' => 'Fulfillment Update',
            'message' => 'Your order fulfillment status has been updated.',
            'action' => 'view_order',
            'action_id' => $this->orderId,
            'fulfillment_status' => $this->fulfillmentStatus,
        ];
    }
}
