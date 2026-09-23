<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CollectionResource;
use App\Http\Responses\ApiResponse;
use App\Models\Styles\Collection;
use Illuminate\Http\JsonResponse;

class CollectionController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $collections = Collection::all();
        
        return $this->success(CollectionResource::collection($collections));
    }
}
