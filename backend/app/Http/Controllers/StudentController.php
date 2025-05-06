<?php

namespace App\Http\Controllers;

use App\Http\Resources\StudentResource;
use App\Models\Branch;
use App\Models\Student;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    public function index()
    {
        // Retrieve all students from the database
        // Return the retrieved students as a JSON response
        try {
            $students = Student::all();
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $students->load('branch', 'payments', 'attendances', 'classes');
        $students = StudentResource::collection($students);
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
        $student->load('branch');
        // $student->load('plans');
        $student->load('attendances');
        $student->load('classes');

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
            'name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'email|unique:students,email|nullable',
            'phone' => 'required|string|max:12',
            'dni' => 'required|string|unique:students,dni',
            'status' => 'required|string|in:activo,inactivo,pendiente',
        ]);
        try {
            $student = Student::create([
                'name' => $request->name,
                'last_name' => $request->last_name,
                'registration_date' => now(),
                'email' => $request->email,
                'phone' => $request->phone,
                'dni' => $request->dni,
                'status' => $request->status,
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
            'name' => 'required|string',
            'last_name' => 'required|string',
            'email' => 'email|nullable|unique:students,email,' . $id,
            'phone' => 'required|string|max:12',
            'dni' => 'required|string|unique:students,dni,' . $id,
            'status' => 'required|string|in:activo,inactivo,pendiente',
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
    public function search(Request $request)
    {
        $searchTerm = $request->search;
        $field = $request->field;
        $students = Student::search($searchTerm, $field)->get();
        $students->load('branch');
        $students->load('attendances');
        $students->load('classes');
        $students->load('payments');
        $students = StudentResource::collection($students);
        $data = [
            'students' => $students,
            'message' => 'Succesfully retrieved students',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
    public function getClassStatus($id)
    {
        $student = Student::with([
            'classScheduleTimeSlots.classSchedule.schedule',
            'classScheduleTimeSlots.timeslot',
            'classScheduleTimeSlots.classSchedule.class',
            'payments'
        ])->findOrFail($id);
        $now = Carbon::now('America/Argentina/Buenos_Aires');
        $currentDay = strtolower($now->format('l'));


        // $hasClassNow = false;
        // $currentClassScheduleId = null;
        $validPayment = null;
        $dayMap = [
            'monday' => 'lunes',
            'tuesday' => 'martes',
            'wednesday' => 'miercoles',
            'thursday' => 'jueves',
            'friday' => 'viernes',
            'saturday' => 'sabado',
            'sunday' => 'domingo',
        ];
        // Buscar si tiene clase ahora
        // foreach ($student->classScheduleTimeSlots as $timeSlot) {
        //     $days = $timeSlot->classSchedule->schedule->days ?? [];


        //     $slotBase = Carbon::createFromFormat('H:i:s', $timeSlot->timeslot->hour, 'America/Argentina/Buenos_Aires')
        //         ->setDate($now->year, $now->month, $now->day);

        //     $slotStart = $slotBase->copy()->subMinutes(5);
        //     $slotEnd = $slotBase->copy()->addHour(1);
        //     if (in_array($dayMap[$currentDay], $days) && $now->between($slotStart, $slotEnd)) {
        //         $hasClassNow = true;
        //         $currentClassScheduleId = $timeSlot->classSchedule->id;
        //         break;
        //     }
        // }

        // Buscar si hay un pago válido para esa clase

        // if ($hasClassNow && $currentClassScheduleId) {

        //     $validPayment = $student->payments
        //         ->where('classSchedule_id', $currentClassScheduleId)
        //         ->where('status', 'pagado')
        //         ->where('date_start', '<=', $now)
        //         ->where('expiration_date', '>=', $now)
        //         ->first();
        // }
        $validPayment = $student->payments
            ->where('status', 'pagado')
            ->where('expiration_date', '>=', $now)
            ->first();

        // return response()->json([
        //     'student_id' => $student->id,
        //     'has_class_now' => $hasClassNow,
        //     'is_payment_valid' => (bool) $validPayment,
        //     'payment_date' => $validPayment?->payment_date,
        //     'expiration_date' => $validPayment?->expiration_date,
        //     'access_granted' => $hasClassNow && $validPayment !== null,
        // ]);
        return response()->json([
            'student_id' => $student->id,
            'is_payment_valid' => (bool) $validPayment,
            'payment_date' => $validPayment?->payment_date,
            'expiration_date' => $validPayment?->expiration_date,
            'access_granted' => $validPayment !== null,
        ]);
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
