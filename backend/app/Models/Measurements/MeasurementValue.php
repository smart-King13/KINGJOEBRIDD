<?php

namespace App\Models\Measurements;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeasurementValue extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [];

    public function measurementSet()
    {
        return $this->belongsTo(MeasurementSet::class, 'measurement_set_id');
    }
}
