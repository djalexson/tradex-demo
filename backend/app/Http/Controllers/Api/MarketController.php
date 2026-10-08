<?php

namespace App\Http\Controllers\Api;

use App\Domain\Market\Services\MarketDataService;
use App\Http\Controllers\Controller;
use App\Http\Resources\AssetResource;
use App\Models\Asset;
use Illuminate\Http\JsonResponse;

class MarketController extends Controller
{
    public function __construct(private readonly MarketDataService $marketData)
    {
    }

    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => AssetResource::collection($this->marketData->getAssets()),
        ]);
    }

    public function show(Asset $asset): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new AssetResource($asset->load('latestQuote')),
        ]);
    }

    public function quote(Asset $asset): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->marketData->getLatestQuote($asset),
        ]);
    }
}
