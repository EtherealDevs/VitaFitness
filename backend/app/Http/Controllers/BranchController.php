<?php

namespace App\Http\Controllers;

use App\Http\Resources\BranchResource;
use App\Models\Branch;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    public function index()
    {
        // Retrieve all branches from the database
        // Return the retrieved branches as a JSON response
        try {
            $branches = Branch::all();
        } catch (\Throwable $th) {
            throw $th;
        }
        $branches = BranchResource::collection($branches);
        $data = [
            'data' => $branches,
           'message' => 'Branches retrieved successfully',
           'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
    public function show(int $id)
    {
        // Retrieve a branch by its ID from the database
        // Return the retrieved branch as a JSON response
        try {
            $branch = Branch::find($id);
        } catch (\Throwable $th) {
            throw $th;
        }
        $branch = new BranchResource($branch);
        $data = [
            'data' => $branch,
           'message' => 'Branch retrieved successfully',
           'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
    public function store(Request $request)
    {
        // Create a new branch in the database
        // Return the created branch as a JSON response
        $request->validate([
            'name' =>'required|string',
            'address' => 'required|string',
        ]);
        try {
            $branch = Branch::create($request->all());
        } catch (\Throwable $th) {
            throw $th;
        }
        $branch = new BranchResource($branch);
        $data = [
            'data' => $branch,
           'message' => 'Branch created successfully',
           'status' => 'success, resource created (201)'
        ];
        return response()->json($data, 201);
    }
    public function update(Request $request, int $id)
    {
        // Update an existing branch in the database
        // Return the updated branch as a JSON response
        $request->validate([
            'name' =>'required|string',
            'address' => 'required|string',
        ]);
        try {
            $branch = Branch::find($id);
            $branch->update($request->all());
        } catch (\Throwable $th) {
            throw $th;
        }
        $branch = new BranchResource($branch);
        $data = [
            'data' => $branch,
           'message' => 'Branch updated successfully',
           'status' => 'success, resource modified (204)'
        ];
        return response()->json($data, 200);
    }
    public function destroy(Branch $branch)
    {
        // Delete an existing branch from the database
        // Return a success message as a JSON response
        try {
            $branch = Branch::find($branch->id);
            $branch->delete();
        } catch (\Throwable $th) {
            throw $th;
        }
        $data = [
           'message' => 'Branch deleted successfully',
           'status' => 'success, resource deleted (204)'
        ];
        return response()->json($data, 204);
    }
}
