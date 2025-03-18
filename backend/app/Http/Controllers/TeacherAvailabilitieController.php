<?php

namespace App\Http\Controllers;

use App\Http\Resources\TeacherAvailabilitieResource;
use App\Models\TeacherAvailabilitie;
use Illuminate\Http\Request;

class TeacherAvailabilitieController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'schedule_id' => 'required|exists:schedules,id',
            'branch_id' => 'required|exists:branchs,id'
        ]);
        try {
            $teacherAvailability = TeacherAvailabilitie::create($request->all());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
        $teacherAvailability = new TeacherAvailabilitieResource($teacherAvailability);
        $data = [
            'message' => 'Teacher Availability created successfully',
            'data' => $teacherAvailability,
            'status' => 201
        ];
        return response()->json($data, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $teacherAvailabilitie = TeacherAvailabilitie::with(['branch', 'teacher', 'schedule'])->findOrFail($id);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Teacher Availabilitie not found',
                'error' => $e->getMessage()
            ], 404);
        }
        $teacherAvailabilitie = new TeacherAvailabilitieResource($teacherAvailabilitie);
        $data = [
            'status' => 200,
            'message' => 'Teacher Availabilitie retrieved successfully',
            'data' => $teacherAvailabilitie
        ];
        return response()->json($data, 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'teacher_id' => 'exists:teachers,id',
            'schedule_id' => 'exists:schedules,id',
            'branch_id' => 'exists:branchs,id'
        ]);
        try {
            $teacherAvailability = TeacherAvailabilitie::findOrFail($id);
            $teacherAvailability->update($request->all());
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
        $teacherAvailability = new TeacherAvailabilitieResource($teacherAvailability);
        $data = [
            'message' => 'Teacher Availability updated successfully',
            'data' => $teacherAvailability,
            'status' => 201
        ];
        return response()->json($data, 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $teacherAvailability = TeacherAvailabilitie::findOrFail($id);
            $teacherAvailability->delete();
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
        $data = [
            'message' => 'Teacher Availability deleted successfully',
            'status' => 200
        ];
        return response()->json($data, 200);
    }
}
