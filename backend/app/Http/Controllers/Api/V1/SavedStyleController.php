<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Styles\SavedStyle;
use App\Models\Styles\Style;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SavedStyleController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Style::whereHas('savedByUsers', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })
        ->with(['category', 'collection', 'images' => function ($q) {
            $q->where('is_primary', true);
        }])
        ->withExists(['savedByUsers as is_saved' => function ($q) use ($user) {
            $q->where('user_id', $user->id); // Will always be true, but ensures consistency
        }]);

        if ($user->role !== 'admin') {
            $query->where('is_published', true);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                  ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        $sort = $request->input('sort', 'created_at');
        $direction = $request->input('direction', 'desc');
        $query->orderBy($sort, $direction);

        $perPage = min((int) $request->input('per_page', 15), 100);
        $styles = $query->paginate($perPage);

        return $this->success(\App\Http\Resources\StyleResource::collection($styles)->response()->getData(true));
    }

    public function toggle(Request $request, string $id): JsonResponse
    {
        $style = Style::findOrFail($id);

        $saved = SavedStyle::where('user_id', $request->user()->id)
            ->where('style_id', $style->id)
            ->first();

        if ($saved) {
            $saved->delete();
            return $this->success(null, 'Style unsaved successfully.');
        }

        SavedStyle::create([
            'user_id' => $request->user()->id,
            'style_id' => $style->id,
        ]);

        return $this->success(null, 'Style saved successfully.');
    }
}
