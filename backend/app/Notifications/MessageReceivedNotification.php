<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class MessageReceivedNotification extends Notification
{
    use Queueable;

    protected $conversationId;

    public function __construct(string $conversationId)
    {
        $this->conversationId = $conversationId;
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'title' => 'New Message',
            'message' => 'You have received a new message.',
            'action' => 'view_conversation',
            'action_id' => $this->conversationId,
        ];
    }
}
