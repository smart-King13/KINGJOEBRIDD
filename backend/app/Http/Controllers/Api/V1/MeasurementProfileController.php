<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Measurements\MeasurementProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MeasurementProfileController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = MeasurementProfile::with('measurementSets.values');

        if ($request->user()->role !== 'admin') {
            $query->where('user_id', $request->user()->id);
        }

        $profiles = $query->get();

        return $this->success($profiles);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $profile = MeasurementProfile::create([
            'id' => Str::uuid(),
            'user_id' => $request->user()->id,
            'name' => $validated['name'],
        ]);

        return $this->success($profile, 'Profile created successfully.', 201);
    }
}
