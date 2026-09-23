<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\MaterialResource;
use App\Http\Responses\ApiResponse;
use App\Models\Materials\Material;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MaterialController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Material::with(['images']);

        $user = auth('sanctum')->user();
        if (!$user || $user->role !== 'admin') {
            $query->where('is_published', true);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
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
        $materials = $query->paginate($perPage);

        return $this->success(MaterialResource::collection($materials)->response()->getData(true));
    }

    public function show(Request $request, string $id): JsonResponse
    {
        $query = Material::with(['images']);

        $user = auth('sanctum')->user();
        if (!$user || $user->role !== 'admin') {
            $query->where('is_published', true);
        }

        $material = $query->findOrFail($id);

        return $this->success(new MaterialResource($material));
    }

    public function store(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return $this->error('Unauthorized.', 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|string',
            'is_available' => 'boolean',
            'requires_sourcing' => 'boolean',
        ]);

        $material = \App\Models\Materials\Material::create([
            'id' => \Illuminate\Support\Str::uuid(),
            'name' => $validated['name'],
            'description' => $validated['description'],
            'type' => $validated['type'],
            'is_available' => $validated['is_available'] ?? true,
            'requires_sourcing' => $validated['requires_sourcing'] ?? false,
        ]);

        return $this->success(new MaterialResource($material), 'Material created.', 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return $this->error('Unauthorized.', 403);
        }

        $material = \App\Models\Materials\Material::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'type' => 'sometimes|required|string',
            'is_available' => 'boolean',
            'requires_sourcing' => 'boolean',
        ]);

        $material->update($validated);

        return $this->success(new MaterialResource($material), 'Material updated.');
    }

    public function destroy(Request $request, string $id): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return $this->error('Unauthorized.', 403);
        }

        $material = \App\Models\Materials\Material::findOrFail($id);
        $material->delete();

        return response()->json(null, 204);
    }
}
