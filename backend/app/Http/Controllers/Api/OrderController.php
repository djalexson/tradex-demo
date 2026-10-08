<?php

namespace App\Http\Controllers\Api;

use App\Actions\Trading\PlaceDemoOrderAction;
use App\DTO\OrderData;
use App\Http\Controllers\Controller;
use App\Http\Requests\Trading\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    public function index(): JsonResponse
    {
        $orders = request()->user()->orders()->with('asset')->latest()->paginate(25);

        return response()->json(['success' => true, 'data' => OrderResource::collection($orders)]);
    }

    public function store(StoreOrderRequest $request, PlaceDemoOrderAction $action): JsonResponse
    {
        $result = $action->execute(request()->user(), new OrderData(
            assetId: (int) $request->integer('asset_id'),
            side: $request->string('side')->toString(),
            type: $request->string('type')->toString(),
            quantity: $request->string('quantity')->toString(),
        ));

        return response()->json([
            'success' => true,
            'data' => new OrderResource($result->order->load('asset')),
        ], 201);
    }

    public function show(Order $order): JsonResponse
    {
        abort_if($order->user_id !== request()->user()->id, 403);

        return response()->json(['success' => true, 'data' => new OrderResource($order->load('asset'))]);
    }

    public function cancel(Order $order): JsonResponse
    {
        abort_if($order->user_id !== request()->user()->id, 403);
        abort_if($order->status !== 'pending', 422, 'Only pending orders can be cancelled.');
        $order->forceFill(['status' => 'cancelled'])->save();

        return response()->json(['success' => true, 'data' => new OrderResource($order->load('asset'))]);
    }

    public function trades(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => request()->user()->trades()->with('asset')->latest('executed_at')->paginate(25),
        ]);
    }
}
