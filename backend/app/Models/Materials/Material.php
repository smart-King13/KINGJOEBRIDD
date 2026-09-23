<?php

namespace App\Models\Materials;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Material extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'is_available' => 'boolean',
            'is_published' => 'boolean',
            'base_price' => 'integer',
        ];
    }

    public function images()
    {
        return $this->hasMany(MaterialImage::class);
    }
}
