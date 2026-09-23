<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    /**
     * Return a success JSON response.
     *
     * @param  mixed  $data
     * @param  string  $message
     * @param  int  $code
     * @return JsonResponse
     */
    protected function success(mixed $data = null, string $message = 'Resource retrieved successfully.', int $code = 200): JsonResponse
    {
        if (is_array($data) && array_key_exists('data', $data) && array_key_exists('meta', $data)) {
            return response()->json([
                'data' => $data['data'],
                'meta' => $data['meta'],
                'message' => $message,
            ], $code);
        }

        return response()->json([
            'data' => $data,
            'message' => $message,
        ], $code);
    }

    /**
     * Return an error JSON response.
     *
     * @param  string  $message
     * @param  int  $code
     * @param  array  $errors
     * @return JsonResponse
     */
    protected function error(string $message, int $code = 400, array $errors = []): JsonResponse
    {
        $response = [
            'message' => $message,
        ];

        if (!empty($errors)) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }
}
