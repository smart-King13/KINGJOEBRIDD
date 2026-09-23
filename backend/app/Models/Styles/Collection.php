<?php

namespace App\Models\Styles;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Collection extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [];

    public function styles()
    {
        return $this->hasMany(Style::class);
    }
}
