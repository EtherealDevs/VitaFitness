<?php

namespace App\Http\Controllers;

use App\Http\Resources\PlanResource;
use App\Models\Plan;
use Illuminate\Http\Request;

class PlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $plans = Plan::all();
        } catch (\Throwable $e) {
            throw $e;
        }
        $plans = PlanResource::collection($plans);
        $data = [
            'plans' => $plans,
            'message' => 'Succesfully retrieved plans',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'status' => 'require|string'
        ]);
        try {
            $plan = Plan::create($request->all());
        } catch (\Throwable $e) {
            throw $e;
        }
        $plan = new PlanResource($plan);
        $data = [
            'plan' => $plan,
            'message' => 'Succesfully created plan',
            'status' => 'success (201)'
        ];
        return response()->json($data, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $plan = Plan::find($id);
        } catch (\Throwable $e) {
            throw $e;
        }
        $plan = new PlanResource($plan);
        $data = [
            'plan' => $plan,
            'message' => 'Succesfully retrieved plan',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'string',
            'description' => 'string',
            'status' => 'string',
        ]);
        try {
            $plan = Plan::find($id);
            $plan->update($request->all());
        } catch (\Throwable $e) {
            throw $e;
        }
        $plan = new PlanResource($plan);
        $data = [
            'plan' => $plan,
            'message' => 'Succesfully updated plan',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $plan = Plan::find($id);
            $plan->delete();
        } catch (\Throwable $e) {
            throw $e;
        }
        $data = [
            'message' => 'Succesfully deleted plan',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
}
