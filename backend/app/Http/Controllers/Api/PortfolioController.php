<?php

namespace App\Http\Controllers\Api;

use App\Domain\Trading\Services\PortfolioService;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class PortfolioController extends Controller
{
    public function __construct(private readonly PortfolioService $portfolio)
    {
    }

    public function summary(): JsonResponse
    {
        return response()->json(['success' => true, 'data' => $this->portfolio->getSummary(request()->user())]);
    }

    public function positions(): JsonResponse
    {
        return response()->json(['success' => true, 'data' => $this->portfolio->getPositions(request()->user())]);
    }
}
