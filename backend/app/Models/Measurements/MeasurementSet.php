<?php

namespace App\Models\Measurements;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeasurementSet extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'is_approved' => 'boolean',
            'version' => 'integer',
        ];
    }

    public function profile()
    {
        return $this->belongsTo(MeasurementProfile::class, 'profile_id');
    }

    public function values()
    {
        return $this->hasMany(MeasurementValue::class, 'measurement_set_id');
    }
}
