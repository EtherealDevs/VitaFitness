<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    public function index(){
        // Retrieve all students from the database
        // Return the retrieved students as a JSON response
        try {
            $students = Student::all();
        } catch (\Throwable $th) {
            throw $th;
        }
        return response()->json($students);
    }
    public function show(int $id)
    {
        // Retrieve a student by its ID from the database
        // Return the retrieved student as a JSON response
        try {
            $student = Student::find($id);
        } catch (\Throwable $th) {
            throw $th;
        }
        return response()->json($student);
    }
    public function store(Request $request)
    {
        // Create a new student in the database
        // Return the created student as a JSON response
        $branches_ids = [1, 2, 3];
        $request->validate([
            'name' =>'required|string',
            'last_name' => 'required|string',
            'email' => 'email|unique:students|nullable',
            'phone' => 'required|string|max:12',
            'dni' => 'required|string|unique:students',
            'branches_id' => [Rule::in([$branches_ids]), 'required'],
        ]);
        try {
            $student = Student::create($request->all());
        } catch (\Throwable $th) {
            throw $th;
        }
        return response()->json($student, 201);
    }
}
