<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password', 'role', 'avatar_url'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function savedStyles()
    {
        return $this->hasMany(\App\Models\Styles\SavedStyle::class);
    }

    public function styleRequests()
    {
        return $this->hasMany(\App\Models\StyleRequests\StyleRequest::class);
    }

    public function conversations()
    {
        return $this->hasMany(\App\Models\Conversations\Conversation::class);
    }

    public function measurementProfiles()
    {
        return $this->hasMany(\App\Models\Measurements\MeasurementProfile::class);
    }

    public function orders()
    {
        return $this->hasMany(\App\Models\Orders\Order::class);
    }
}
