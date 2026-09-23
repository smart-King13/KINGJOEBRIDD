<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class QuoteAcceptedNotification extends Notification
{
    use Queueable;

    protected $quoteId;
    protected $orderId;

    public function __construct(string $quoteId, string $orderId)
    {
        $this->quoteId = $quoteId;
        $this->orderId = $orderId;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'title' => 'Quote Accepted',
            'message' => 'A customer has accepted a quote. An order has been generated.',
            'action' => 'view_order',
            'action_id' => $this->orderId,
            'quote_id' => $this->quoteId,
        ];
    }
}
