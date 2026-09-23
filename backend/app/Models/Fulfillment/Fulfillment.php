<?php

namespace App\Models\Fulfillment;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fulfillment extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'delivery_fee' => 'integer',
        ];
    }

    public function order()
    {
        return $this->belongsTo(\App\Models\Orders\Order::class);
    }
}
