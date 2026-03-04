<?php

namespace App\Http\Controllers;

use App\Models\ClassStudent;
use Illuminate\Http\Request;

class ClassStudentController extends Controller
{
    public function index()
    {
        try {
            $classStudents = ClassStudent::all();
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $data = [
            'classStudents' => ClassStudentResource::collection($classStudents),
            'message' => 'ClassStudents retrieved successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
    public function show(string $id)
    {
        try {
            $classStudent = ClassStudent::find($id);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $classStudent = new ClassStudentResource($classStudent);
        $data = [
            'classStudent' => $classStudent,
            'message' => 'ClassStudent retrieved successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
    public function store(Request $request)
    {
        $request->validate([
            'class_id' => 'required|integer|exists:classes,id',
            'student_id' => 'required|integer|exists:students,id',
        ]);
        try {
            $classStudent = ClassStudent::create($request->all());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $data = [
            'classStudent' => $classStudent,
            'message' => 'ClassStudent created successfully',
            'status' => 'success (201)'
        ];
        return response()->json($data, 201);
    }
    public function update(Request $request, string $id)
    {
        $request->validate([
            'class_id' => 'required|integer|exists:classes,id',
            'student_id' => 'required|integer|exists:students,id',
        ]);
        try {
            $classStudent = ClassStudent::find($id);
            $classStudent->update($request->all());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $data = [
            'classStudent' => $classStudent,
            'message' => 'ClassStudent updated successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
    public function destroy(string $id)
    {
        try {
            $classStudent = ClassStudent::find($id);
            $classStudent->delete();
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $data = [
            'message' => 'ClassStudent deleted successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
}
