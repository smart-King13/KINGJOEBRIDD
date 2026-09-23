<?php

namespace App\Models\Styles;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class SavedStyle extends Pivot
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $table = 'saved_styles';

    protected $guarded = [];
}
