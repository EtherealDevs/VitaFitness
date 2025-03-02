<?php

namespace App\Http\Controllers;

use App\Http\Resources\TeacherResource;
use App\Models\Teacher;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    public function index()
    {
        // Retrieve all teachers from the database
        // Return the retrieved teachers as a JSON response
        try {
            $teachers = Teacher::all();
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $teachers = TeacherResource::collection($teachers);

        $data = [
            'teachers' => $teachers,
            'message' => 'All teachers retreived successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
    public function show(int $id)
    {
        // Retrieve a teacher by its ID from the database
        // Return the retrieved teacher as a JSON response
        try {
            $teacher = Teacher::find($id);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $teacher = new TeacherResource($teacher);

        $data = [
            'teacher' => $teacher,
            'message' => 'Teacher of ID ' . $id. ' retrieved successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
    public function store(Request $request)
    {
        // Create a new teacher in the database
        // Return the created teacher as a JSON response
        $request->validate([
            'name' =>'required|string',
            'last_name' =>'required|string',
            'email' => 'email|unique:teachers,email|nullable',
            'phone' =>'required|string|max:12',
            'dni' =>'required|string|unique:teachers,dni',
            'branch_id' =>'required|integer',
        ]);
        try {
            $teacher = Teacher::create($request->all());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $teacher = new TeacherResource($teacher);

        $data = [
            'teacher' => $teacher,
            'message' => 'Teacher created successfully',
            'status' => 'success, resource created (201)'
        ];
        return response()->json($data, 201);
    }
    public function update(Request $request, int $id)
    {
        // Update an existing teacher in the database
        // Return the updated teacher as a JSON response
        $request->validate([
            'name' =>'required|string',
            'last_name' =>'required|string',
            'email' => 'email|nullable|unique:teachers,email,' . $id,
            'phone' =>'required|string|max:12',
            'dni' =>'required|string|unique:teachers,dni,' . $id,
            'branch_id' =>'required|integer',
        ]);
        try {
            $teacher = Teacher::find($id);
            $teacher->update($request->all());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $teacher = new TeacherResource($teacher);

        $data = [
            'teacher' => $teacher,
            'message' => 'Teacher updated successfully',
            'status' => 'success, resource modified (204)'
        ];
        return response()->json($data, 204);
    }
    public function destroy(int $id)
    {
        // Delete an existing teacher from the database
        // Return the message indicating the deletion was successful
        try {
            $teacher = Teacher::find($id);
            $teacher->delete();
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $data = [
           'message' => 'Teacher deleted successfully',
           'status' => 'success, resource deleted (204)'
        ];
        return response()->json($data, 204);
    }
}
