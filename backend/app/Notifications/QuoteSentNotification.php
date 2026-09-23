<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class QuoteSentNotification extends Notification
{
    use Queueable;

    protected $quoteId;

    public function __construct(string $quoteId)
    {
        $this->quoteId = $quoteId;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'title' => 'Quote Received',
            'message' => 'You have received a new tailoring quote.',
            'action' => 'view_quote',
            'action_id' => $this->quoteId,
        ];
    }
}
