<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Measurements\MeasurementProfile;
use App\Models\Measurements\MeasurementSet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class MeasurementSetController extends Controller
{
    use ApiResponse;

    public function store(Request $request, string $profileId): JsonResponse
    {
        $profile = MeasurementProfile::findOrFail($profileId);

        if ($request->user()->role !== 'admin' && $profile->user_id !== $request->user()->id) {
            return $this->error('Unauthorized.', 403);
        }

        $validated = $request->validate([
            'measurements' => ['required', 'array'],
        ]);

        $set = DB::transaction(function () use ($profile, $validated, $request) {
            $lastVersion = MeasurementSet::where('profile_id', $profile->id)
                ->max('version') ?? 0;

            $newSet = MeasurementSet::create([
                'id' => Str::uuid(),
                'profile_id' => $profile->id,
                'version' => $lastVersion + 1,
                'is_approved' => $request->user()->role === 'admin',
            ]);

            foreach ($validated['measurements'] as $key => $value) {
                \DB::table('measurement_values')->insert([
                    'id' => Str::uuid(),
                    'measurement_set_id' => $newSet->id,
                    'key' => $key,
                    'value' => $value,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            return $newSet;
        });

        return $this->success($set, 'Measurement set recorded.', 201);
    }

    public function approve(Request $request, string $setId): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return $this->error('Unauthorized.', 403);
        }

        $set = MeasurementSet::findOrFail($setId);
        
        $set->update(['is_approved' => true]);

        return $this->success($set, 'Measurement set approved.');
    }
}
