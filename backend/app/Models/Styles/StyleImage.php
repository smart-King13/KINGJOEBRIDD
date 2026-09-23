<?php

namespace App\Models\Styles;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StyleImage extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
            'size' => 'integer',
        ];
    }

    public function style()
    {
        return $this->belongsTo(Style::class);
    }
}
