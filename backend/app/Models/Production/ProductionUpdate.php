<?php

namespace App\Models\Production;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductionUpdate extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [];

    public function order()
    {
        return $this->belongsTo(\App\Models\Orders\Order::class);
    }

    public function attachments()
    {
        return $this->morphMany(\App\Models\StyleRequests\Attachment::class, 'attachable');
    }
}
