<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \Illuminate\Database\Eloquent\Relations\Relation::enforceMorphMap([
            'user' => \App\Models\User::class,
            'style' => \App\Models\Styles\Style::class,
            'style_request' => \App\Models\StyleRequests\StyleRequest::class,
            'message' => \App\Models\Conversations\Message::class,
            'quote' => \App\Models\Quotes\Quote::class,
            'order' => \App\Models\Orders\Order::class,
            'production_update' => \App\Models\Production\ProductionUpdate::class,
        ]);
    }
}
