<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\StyleResource;
use App\Http\Responses\ApiResponse;
use App\Models\Styles\Style;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StyleController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Style::with(['category', 'collection', 'images' => function ($q) {
            $q->where('is_primary', true);
        }]);

        $user = auth('sanctum')->user();
        if (!$user || $user->role !== 'admin') {
            $query->where('is_published', true);
        }

        if ($user) {
            $query->withExists(['savedByUsers as is_saved' => function ($q) use ($user) {
                $q->where('user_id', $user->id);
            }]);
        }

        if ($request->filled('category_slug')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category_slug);
            });
        }

        if ($request->filled('collection_slug')) {
            $query->whereHas('collection', function ($q) use ($request) {
                $q->where('slug', $request->collection_slug);
            });
        }

        if ($request->filled('is_featured')) {
            $query->where('is_featured', filter_var($request->is_featured, FILTER_VALIDATE_BOOLEAN));
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

        return $this->success(StyleResource::collection($styles)->response()->getData(true));
    }

    public function show(Request $request, string $identifier): JsonResponse
    {
        $query = Style::with(['category', 'collection', 'images']);
        
        if (\Illuminate\Support\Str::isUuid($identifier)) {
            $query->where('id', $identifier);
        } else {
            $query->where('slug', $identifier);
        }

        $user = auth('sanctum')->user();
        if (!$user || $user->role !== 'admin') {
            $query->where('is_published', true);
        }

        if ($user) {
            $query->withExists(['savedByUsers as is_saved' => function ($q) use ($user) {
                $q->where('user_id', $user->id);
            }]);
        }

        $style = $query->firstOrFail();

        return $this->success(new StyleResource($style));
    }

    public function store(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return $this->error('Unauthorized.', 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:styles,slug',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'collection_id' => 'nullable|exists:collections,id',
            'is_published' => 'boolean',
        ]);

        $style = \App\Models\Styles\Style::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'description' => $validated['description'],
            'category_id' => $validated['category_id'],
            'collection_id' => $validated['collection_id'] ?? null,
            'is_published' => $validated['is_published'] ?? false,
        ]);

        return $this->success(new StyleResource($style), 'Style created.', 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return $this->error('Unauthorized.', 403);
        }

        $style = \App\Models\Styles\Style::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:styles,slug,' . $style->id,
            'description' => 'sometimes|required|string',
            'category_id' => 'sometimes|required|exists:categories,id',
            'collection_id' => 'nullable|exists:collections,id',
            'is_published' => 'boolean',
        ]);

        $style->update($validated);

        return $this->success(new StyleResource($style), 'Style updated.');
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return $this->error('Unauthorized.', 403);
        }

        $style = \App\Models\Styles\Style::findOrFail($id);
        $style->delete();

        return response()->json(null, 204);
    }
}
