<?php

namespace App\Http\Controllers;

use App\Http\Resources\TeacherSchedulesResource;
use App\Models\TeacherSchedules;
use Illuminate\Http\Request;

class TeacherSchedulesController extends Controller
{
    public function index()
    {
        // Retrieve all teacher schedules from the database
        // Return the retrieved teacher schedules as a JSON response
        try {
            $schedules = TeacherSchedules::all();
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $schedules->load('teacher', 'classes');
        $schedules = TeacherSchedulesResource::collection($schedules);
        $data = [
            'teacher_schedules' => $schedules,
            'message' => 'Teacher schedules retrieved successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
    public function show(string $id)
    {
        try {
            $schedule = TeacherSchedules::find($id);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $schedule->load('teacher', 'classes');
        $schedule = new TeacherSchedulesResource($schedule);
        $data = [
            'teacher_schedule' => $schedule,
            'message' => 'Teacher schedule retrieved successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
    public function store(Request $request)
    {
        // Create a new teacher schedule in the database
        // Return the created teacher schedule as a JSON response
        $request->validate([
            'teacher_id' => 'required|integer',
            'day' => 'required|string',
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => 'required|date_format:H:i:s',
        ]);
        try {
            $schedule = TeacherSchedules::create($request->all());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $schedule->load('teacher', 'classes');
        $schedule = new TeacherSchedulesResource($schedule);
        $data = [
            'teacher_schedule' => $schedule,
            'message' => 'Teacher schedule created successfully',
            'status' => 'success, resource created (201)'
        ];
        return response()->json($data, 201);
    }
    public function update(Request $request, string $id)
    {
        // Update an existing teacher schedule in the database
        // Return the updated teacher schedule as a JSON response
        $request->validate([
            'teacher_id' => 'integer|required',
            'day' => 'string|required',
            'start_time' => 'required|date_format:H:i:s',
            'end_time' => 'required|date_format:H:i:s',
        ]);
        try {
            $schedule = TeacherSchedules::find($id);
            $schedule->update($request->all());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $schedule->load('teacher', 'classes');
        $schedule = new TeacherSchedulesResource($schedule);
        $data = [
            'teacher_schedule' => $schedule,
            'message' => 'Teacher schedule updated successfully',
            'status' => 'success, resource modified (204)'
        ];
        return response()->json($data, 204);
    }
    public function destroy(string $id)
    {
        // Delete an existing teacher schedule from the database
        // Return the message indicating the deletion was successful
        try {
            $schedule = TeacherSchedules::find($id);
            $schedule->delete();
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $data = [
           'message' => 'Teacher schedule deleted successfully',
           'status' => 'success, resource deleted (204)'
        ];
        return response()->json($data, 204);
    }
}
