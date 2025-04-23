<?php

namespace App\Http\Controllers;

use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $payments = Payment::with(['student', 'classSchedule'])->get();
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $payments = PaymentResource::collection($payments);
        $data = [
            'payments' => $payments,
            'message' => 'Payments retrieved successfully',
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
            'classSchedule_id' => 'required|exists:class_schedules,id',
            'student_id' => 'required|exists:students,id',
            'date_start' => 'required|date',
            'amount' => 'required|numeric',
            'status' => 'required|string',
            'payment_date' => 'required|date',
            'expiration_date' => 'required|date',
        ]);
        try {
            $payment = Payment::create($request->all());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $payment = new PaymentResource($payment);
        $data = [
            'payment' => $payment,
            'message' => 'Payment created successfully',
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
            $payment = Payment::with(['student', 'classSchedule'])->find($id);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $payment = new PaymentResource($payment);
        $data = [
            'payment' => $payment,
            'message' => 'Payment retrieved successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }

    public function student(string $id)
    {
        try {
            $payments = Payment::with(['student', 'classSchedule'])->where('student_id', $id)->get();
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $payments = PaymentResource::collection($payments);
        $data = [
            'payment' => $payments,
            'message' => 'Payment retrieved successfully',
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
            'classSchedule_id' => 'exists:class_schedules,id',
            'student_id' => 'exists:students,id',
            'date_start' => 'date',
            'amount' => 'numeric',
            'status' => 'string',
            'payment_date' => 'date',
            'expiration_date' => 'date',
        ]);
        try {
            $payment = Payment::find($id);
            $payment->update($request->all());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $payment = new PaymentResource($payment);
        $data = [
            'payment' => $payment,
            'message' => 'Payment updated successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
    public function updateStudent(Request $request, string $id)
    {
        $request->validate([
            'student_id' => 'integer',
            'plan_id' => 'integer',
            'date_start' => 'date',
            'amount' => 'numeric',
            'status' => 'string',
            'payment_date' => 'date',
            'expiration_date' => 'date',
        ]);
        try {
            $payment = Payment::where('student_id', $id)->first();
            $payment->update($request->all());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $payment = new PaymentResource($payment);
        $data = [
            'payment' => $payment,
            'message' => 'Payment updated successfully',
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
            $payment = Payment::find($id);
            $payment->delete();
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $data = [
            'message' => 'Payment deleted successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
}
