<?php

namespace App\Http\Controllers;

use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $payments = Payment::with(['student', 'classSchedule', 'comprobante'])->get();
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
            // Check if payment already exists. If it does, create new payment taking into account the expiration date of previous payment, adding the leftover days to the new payment
            // $previousPayment = Payment::where('student_id', $request->student_id)
            //     ->where('classSchedule_id', $request->classSchedule_id)
            //     ->where('expiration_date', '>=', now())
            //     ->latest('expiration_date')
            //     ->first();
            //     if ($previousPayment) {
            //         $oldExpiration = Carbon::parse($previousPayment->expiration_date);

            //         // New expiration = old expiration + 1 month
            //         $newExpiration = $oldExpiration->copy()->addMonth();

            //         $newPayment = Payment::create([
            //             'student_id' => $request->student_id,
            //             'class_schedule_id' => $request->classSchedule_id,
            //             'date_start' => $request->date_start,
            //             'amount' => $request->amount,
            //             'status' => $request->status,
            //             'payment_date' => $request->payment_date,
            //             'expiration_date' => $newExpiration->toDateString(),
            //         ]);
            //     } else {
            //         // No previous payment, use the requested expiration_date as-is
            //         $newPayment = Payment::create([
            //             'student_id' => $request->student_id,
            //             'class_schedule_id' => $request->classSchedule_id,
            //             'date_start' => $request->date_start,
            //             'amount' => $request->amount,
            //             'status' => $request->status,
            //             'payment_date' => $request->payment_date,
            //             'expiration_date' => $request->expiration_date,
            //         ]);
            //     }
            $newPayment = Payment::create($request->all());
            $payment = $newPayment;
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
            $payment = Payment::with(['student', 'classSchedule', 'comprobante'])->find($id);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $payment->load('comprobante');
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
     * Update the specified resource in storage.
     */
    public function storeComprobante(Request $request)
    {
        $request->validate([
            'comprobante' => 'required',
            'payment_id' => 'required|exists:payments,id',
        ]);
        try {
            $payment = Payment::find($request->payment_id);
            $comprobante = $request->file('comprobante');
            $name = $payment->student->id . '_' . $payment->expiration_date . '.' . $comprobante->getClientOriginalExtension();
            $path = Storage::putFileAs('comprobantes', $comprobante, $name);
            $payment->comprobante()->create([
                'url' => $path,
                'imageable_id' => $payment->id,
                'imageable_type' => 'App\Models\Payment',
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $payment = new PaymentResource($payment);
        $data = [
            'payment' => $payment,
            'message' => 'Comprobante subido correctamente',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
    public function downloadComprobante($filename)
    {


        if (!Storage::disk('public')->exists($filename)) {
            abort(404);
        }

        return response()->download(storage_path("app/public/{$filename}"));
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
