<?php

namespace App\Http\Controllers;

use App\Http\Resources\ClasseResource;
use App\Models\Classe;
use Illuminate\Http\Request;

class ClasseController extends Controller
{
    public function index()
    {
        try {
            $classes = Classe::all();
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $classes = ClasseResource::collection($classes);
        $data = [
            'classes' => $classes,
            'message' => 'Classes retrieved successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }


    public function show(string $id)
    {
        try {
            $classe = Classe::with(['teacherSchedule', 'branch'])->find($id);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $classe = new ClasseResource($classe);
        $data = [
            'classe' => $classe,
            'message' => 'Classe retrieved successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'max_students' => 'required|integer',
            'teacher_schedules_id' => 'required|integer',
            'branch_id' => 'required|integer',
            'time' => 'required|string',
            'day' => 'required|string',
        ]);
        try {
            $classe = Classe::create($request->all());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $classe = new ClasseResource($classe);
        $data = [
            'classe' => $classe,
            'message' => 'Classe created successfully',
            'status' => 'success (201)'
        ];
        return response()->json($data, 201);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'max_students' => 'integer',
            'teacher_schedules_id' => 'exists:teacher_schedules,id',
            'branch_id' => 'exists:branches,id',
            'time' => 'string',
            'day' => 'string',
        ]);
        try {
            $classe = Classe::find($id);
            $classe->update($request->all());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $classe = new ClasseResource($classe);
        $data = [
            'classe' => $classe,
            'message' => 'Classe updated successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }

    public function availableClasses()
    {
        try {
            $classes = Classe::where('max_students', '>', 0)->get();
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $classes = ClasseResource::collection($classes);
        $data = [
            'classes' => $classes,
            'message' => 'Classes retrieved successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }

    public function destroy(string $id)
    {
        try {
            $classe = Classe::find($id);
            $classe->delete();
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $data = [
            'message' => 'Classe deleted successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
}
