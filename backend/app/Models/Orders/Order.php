<?php

namespace App\Models\Orders;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'snapshot' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function quote()
    {
        return $this->belongsTo(\App\Models\Quotes\Quote::class);
    }

    public function style()
    {
        return $this->belongsTo(\App\Models\Styles\Style::class);
    }

    public function styleRequest()
    {
        return $this->belongsTo(\App\Models\StyleRequests\StyleRequest::class);
    }

    public function measurementSet()
    {
        return $this->belongsTo(\App\Models\Measurements\MeasurementSet::class);
    }

    public function material()
    {
        return $this->belongsTo(\App\Models\Materials\Material::class);
    }

    public function payments()
    {
        return $this->hasMany(\App\Models\Payments\Payment::class);
    }

    public function productionUpdates()
    {
        return $this->hasMany(\App\Models\Production\ProductionUpdate::class);
    }

    public function fulfillment()
    {
        return $this->hasOne(\App\Models\Fulfillment\Fulfillment::class);
    }

    public function conversation()
    {
        return $this->morphOne(\App\Models\Conversations\Conversation::class, 'contextable');
    }
}
