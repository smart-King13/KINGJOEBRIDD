<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Auth\AuthController;

Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'success' => true]);
});

Route::prefix('v1')->group(function () {
    // Auth Routes
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::put('/profile', [AuthController::class, 'updateProfile']);
            Route::put('/password', [AuthController::class, 'updatePassword']);
            Route::post('/avatar', [AuthController::class, 'updateAvatar']);
        });
    });

    // Styles & Discovery
    Route::get('/categories', [\App\Http\Controllers\Api\V1\CategoryController::class, 'index']);
    Route::get('/collections', [\App\Http\Controllers\Api\V1\CollectionController::class, 'index']);
    Route::get('/styles', [\App\Http\Controllers\Api\V1\StyleController::class, 'index']);
    Route::get('/styles/{slug}', [\App\Http\Controllers\Api\V1\StyleController::class, 'show']);
    Route::get('/materials', [\App\Http\Controllers\Api\V1\MaterialController::class, 'index']);
    Route::get('/materials/{id}', [\App\Http\Controllers\Api\V1\MaterialController::class, 'show']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/saved-styles', [\App\Http\Controllers\Api\V1\SavedStyleController::class, 'index']);
        Route::post('/styles/{id}/save', [\App\Http\Controllers\Api\V1\SavedStyleController::class, 'toggle']);
        Route::delete('/styles/{id}/save', [\App\Http\Controllers\Api\V1\SavedStyleController::class, 'toggle']);
        
        // Notifications
        Route::get('/notifications', [\App\Http\Controllers\Api\V1\NotificationController::class, 'index']);
        Route::patch('/notifications/{id}/read', [\App\Http\Controllers\Api\V1\NotificationController::class, 'markAsRead']);
        Route::post('/notifications/read-all', [\App\Http\Controllers\Api\V1\NotificationController::class, 'markAllAsRead']);

        // Phase 3: Attachments, Style Requests, Conversations
        Route::post('/attachments', [\App\Http\Controllers\Api\V1\AttachmentController::class, 'store']);
        
        Route::get('/style-requests', [\App\Http\Controllers\Api\V1\StyleRequestController::class, 'index']);
        Route::post('/style-requests', [\App\Http\Controllers\Api\V1\StyleRequestController::class, 'store']);
        Route::get('/style-requests/{id}', [\App\Http\Controllers\Api\V1\StyleRequestController::class, 'show']);
        Route::patch('/style-requests/{id}/status', [\App\Http\Controllers\Api\V1\StyleRequestController::class, 'updateStatus']);
        Route::delete('/style-requests/{id}', [\App\Http\Controllers\Api\V1\StyleRequestController::class, 'destroy']);
        
        Route::get('/conversations', [\App\Http\Controllers\Api\V1\ConversationController::class, 'index']);
        Route::post('/conversations', [\App\Http\Controllers\Api\V1\ConversationController::class, 'store']);
        Route::get('/conversations/{id}', [\App\Http\Controllers\Api\V1\ConversationController::class, 'show']);
        Route::patch('/conversations/{id}/read', [\App\Http\Controllers\Api\V1\ConversationController::class, 'markAsRead']);
        
        Route::get('/conversations/{id}/messages', [\App\Http\Controllers\Api\V1\MessageController::class, 'index']);
        Route::post('/conversations/{id}/messages', [\App\Http\Controllers\Api\V1\MessageController::class, 'store']);

        // Phase 4: Measurements, Quotes & Order Generation
        Route::get('/measurement-profiles', [\App\Http\Controllers\Api\V1\MeasurementProfileController::class, 'index']);
        Route::post('/measurement-profiles', [\App\Http\Controllers\Api\V1\MeasurementProfileController::class, 'store']);
        Route::post('/measurement-profiles/{id}/sets', [\App\Http\Controllers\Api\V1\MeasurementSetController::class, 'store']);
        Route::post('/measurement-sets/{id}/approve', [\App\Http\Controllers\Api\V1\MeasurementSetController::class, 'approve']);

        Route::get('/quotes', [\App\Http\Controllers\Api\V1\QuoteController::class, 'index']);
        Route::get('/quotes/{id}', [\App\Http\Controllers\Api\V1\QuoteController::class, 'show']);
        Route::post('/quotes', [\App\Http\Controllers\Api\V1\QuoteController::class, 'store']);
        Route::put('/quotes/{id}', [\App\Http\Controllers\Api\V1\QuoteController::class, 'update']);
        Route::delete('/quotes/{id}', [\App\Http\Controllers\Api\V1\QuoteController::class, 'destroy']);
        Route::post('/quotes/{id}/send', [\App\Http\Controllers\Api\V1\QuoteController::class, 'send']);
        Route::post('/quotes/{id}/accept', [\App\Http\Controllers\Api\V1\QuoteController::class, 'accept']);

        // Phase 5: Payments
        Route::post('/orders/{id}/payments', [\App\Http\Controllers\Api\V1\PaymentController::class, 'initialize']);
        Route::post('/payments/{id}/verify', [\App\Http\Controllers\Api\V1\PaymentController::class, 'verify']);
        Route::get('/orders/{id}/payments', [\App\Http\Controllers\Api\V1\PaymentController::class, 'index']);

        // Phase 6: Orders & Production Tracking
        Route::get('/orders', [\App\Http\Controllers\Api\V1\OrderController::class, 'index']);
        Route::get('/orders/{id}', [\App\Http\Controllers\Api\V1\OrderController::class, 'show']);
        
        Route::get('/orders/{id}/production-updates', [\App\Http\Controllers\Api\V1\ProductionUpdateController::class, 'index']);
        Route::post('/orders/{orderId}/production-updates', [\App\Http\Controllers\Api\V1\ProductionUpdateController::class, 'store']);

        // Phase 4B: Admin extensions
        Route::get('/customers', [\App\Http\Controllers\Api\V1\CustomerController::class, 'index']);
        Route::get('/customers/{id}', [\App\Http\Controllers\Api\V1\CustomerController::class, 'show']);

        Route::post('/styles', [\App\Http\Controllers\Api\V1\StyleController::class, 'store']);
        Route::put('/styles/{id}', [\App\Http\Controllers\Api\V1\StyleController::class, 'update']);
        Route::delete('/styles/{id}', [\App\Http\Controllers\Api\V1\StyleController::class, 'destroy']);

        Route::post('/materials', [\App\Http\Controllers\Api\V1\MaterialController::class, 'store']);
        Route::put('/materials/{id}', [\App\Http\Controllers\Api\V1\MaterialController::class, 'update']);
        Route::delete('/materials/{id}', [\App\Http\Controllers\Api\V1\MaterialController::class, 'destroy']);

        Route::get('/orders/{orderId}/fulfillment', [\App\Http\Controllers\Api\V1\FulfillmentController::class, 'show']);
        Route::post('/orders/{orderId}/fulfillment', [\App\Http\Controllers\Api\V1\FulfillmentController::class, 'store']);
    });

    // Public webhook route (not protected by sanctum auth middleware)
    Route::post('/payments/webhook/{provider}', [\App\Http\Controllers\Api\V1\PaymentController::class, 'webhook']);
});
