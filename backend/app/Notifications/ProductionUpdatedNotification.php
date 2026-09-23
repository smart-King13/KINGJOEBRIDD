<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ProductionUpdatedNotification extends Notification
{
    use Queueable;

    protected $orderId;
    protected $productionStatus;

    public function __construct(string $orderId, string $productionStatus)
    {
        $this->orderId = $orderId;
        $this->productionStatus = $productionStatus;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'title' => 'Production Update',
            'message' => 'Your garment production status has been updated.',
            'action' => 'view_order',
            'action_id' => $this->orderId,
            'production_status' => $this->productionStatus,
        ];
    }
}
