<?php

namespace App\Http\Controllers;

use App\Http\Resources\StudentResource;
use App\Models\Branch;
use App\Models\Student;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    public function index(){
        // Retrieve all students from the database
        // Return the retrieved students as a JSON response
        try {
            $students = Student::all();
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $students = StudentResource::collection(Student::all());
        $data = [
            'students' => $students,
            'message' => 'Succesfully retrieved students',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
    public function show(int $id)
    {
        // Retrieve a student by its ID from the database
        // Return the retrieved student as a JSON response
        try {
            $student = Student::find($id);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $student = new StudentResource($student);
        $data = [
            'student' => $student,
            'message' => 'Student of ID ' . $id . ' retrieved successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
    public function store(Request $request)
    {
        // Create a new student in the database
        // Return the created student as a JSON response
        $branches_ids = Branch::all()->pluck('id')->toArray();
        $request->validate([
            'name' =>'required|string',
            'last_name' => 'required|string',
            'email' => 'email|unique:students,email|nullable',
            'phone' => 'required|string|max:12',
            'dni' => 'required|string|unique:students,dni',
            'branch_id' => [Rule::in($branches_ids), 'required'],
        ]);
        try {
            $student = Student::create([
                'name' => $request->name,
                'last_name' => $request->last_name,
                'registration_date' => now(),
                'email' => $request->email,
                'phone' => $request->phone,
                'dni' => $request->dni,
                'branch_id' => $request->branch_id,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $student = new StudentResource($student);
        $data = [
            'student' => $student,
            'message' => 'Student created successfully',
            'status' => 'success, resource created (201)'
        ];
        return response()->json($data, 201);
    }
    public function update(Request $request, int $id)
    {
        // Update an existing student in the database
        // Return the updated student as a JSON response
        $branches_ids = Branch::all()->pluck('id')->toArray();
        $request->validate([
            'name' =>'required|string',
            'last_name' => 'required|string',
            'email' => 'email|nullable|unique:students,email,' . $id,
            'phone' => 'required|string|max:12',
            'dni' => 'required|string|unique:students,dni,' . $id,
            'branch_id' => [Rule::in($branches_ids), 'required'],
        ]);
        $student = Student::find($id);
        if ($student != null) {
            $student->update($request->all());
        }
        $student = new StudentResource($student);
        $data = [
            'student' => $student,
            'message' => 'Student updated successfully',
            'status' => 'success, resource modified (204)'
        ];
        return response()->json($data, 204);
    }
    public function destroy(Student $student)
    {
        // Delete an existing student from the database
        // Return the message indicating the deletion was successful
        $student = Student::find($student->id);
        if ($student != null) {
            $student->delete();
        }
        $data = [
           'message' => 'Student deleted successfully',
           'status' => 'success, resource deleted (204)'
        ];
        return response()->json($data, 204);
    }
}
