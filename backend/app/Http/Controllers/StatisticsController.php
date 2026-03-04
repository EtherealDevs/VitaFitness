<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Plan;
use App\Models\Teacher;
use App\Models\Classe;
use App\Models\Payment;
use App\Models\Student;
use Illuminate\Http\JsonResponse;

class StatisticsController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'students_per_plan' => $this->studentsPerPlan(),
            'students_per_teacher' => $this->studentsPerTeacher(),
            'students_per_class' => $this->studentsPerClass(),
            'students_per_week' => $this->studentsPerWeek(),
            'payments_per_month' => $this->paymentsPerMonth(),
            'total_students' => $this->totalStudents(),
            'classes_today' => $this->classesToday(),
            'total_income' => $this->totalIncomeThisMonth(),
        ]);
    }

    protected function totalStudents(): int
    {
        return Student::count();
    }
    protected function studentsPerPlan(): array
{
    return Plan::with(['classes.students'])
        ->get()
        ->mapWithKeys(function ($plan) {
            $studentsCount = $plan->classes
                ->flatMap->students
                ->pluck('id')
                ->unique()
                ->count();

            return [$plan->name => $studentsCount];
        })
        ->toArray();
    }

    protected function studentsPerTeacher(): array
{
    return Teacher::query()
        ->selectRaw("CONCAT(teachers.name, ' ', teachers.last_name) as full_name")
        ->selectRaw('COUNT(DISTINCT class_students.student_id) as total')
        ->join('class_teachers', 'class_teachers.teacher_id', '=', 'teachers.id')
        ->join('classes', 'classes.id', '=', 'class_teachers.class_id')
        ->join('class_students', 'class_students.class_id', '=', 'classes.id')
        ->groupBy('teachers.id', 'teachers.name', 'teachers.last_name')
        ->pluck('total', 'full_name')
        ->toArray();
}

    public function studentsPerClass()
{
    $rows = Classe::query()
        ->select('plans.name as plan')
        ->selectRaw('COUNT(DISTINCT class_students.student_id) as students_count')
        ->join('plans', 'plans.id', '=', 'classes.plan_id')
        ->leftJoin('class_students', 'class_students.class_id', '=', 'classes.id')
        ->groupBy('plans.id', 'plans.name')
        ->get();

    return [
        'classes' => $rows->map(function ($row) {
            return [
                'plan' => $row->plan,
                'students_count' => $row->students_count,
            ];
        })
    ];
}
    protected function studentsPerWeek(): array
{
    $diasOrdenados = ['Mon','Tue','Wed','Thu','Fri','Sat']; 
    // change to ['Lun','Mar','Mie','Jue','Vie','Sab'] if Spanish

    $asistencia = Attendance::query()
        ->join('class_students', 'attendances.class_student_id', '=', 'class_students.id')
        ->join('classes', 'classes.id', '=', 'class_students.class_id')
        ->join('schedules', 'schedules.id', '=', 'classes.schedule_id')
        ->select('schedules.day')
        ->selectRaw('COUNT(DISTINCT class_students.student_id) as total')
        ->groupBy('schedules.day')
        ->pluck('total', 'schedules.day');

    $resultado = [];

    foreach ($diasOrdenados as $dia) {
        $resultado[] = [
            'name' => $dia,
            'total' => $asistencia->get($dia, 0),
        ];
    }

    return $resultado;
}
    protected function paymentsPerMonth(): array
    {
        $meses = [
            1 => 'Ene',
            2 => 'Feb',
            3 => 'Mar',
            4 => 'Abr',
            5 => 'May',
            6 => 'Jun',
            7 => 'Jul',
            8 => 'Ago',
            9 => 'Sep',
            10 => 'Oct',
            11 => 'Nov',
            12 => 'Dic',
        ];

        $pagos = Payment::selectRaw('MONTH(payment_date) as mes, SUM(amount) as total')
            ->whereYear('payment_date', now()->year) // solo pagos del año actual
            ->groupBy('mes')
            ->get()
            ->mapWithKeys(function ($item) use ($meses) {
                return [$meses[$item->mes] => $item->total];
            });

        // Asegurar todos los meses, aunque no haya pagos
        $resultado = [];
        foreach (range(1, 12) as $mes) {
            $nombreMes = $meses[$mes];
            $resultado[] = [
                'name' => $nombreMes,
                'total' => $pagos->get($nombreMes, 0),
            ];
        }

        return $resultado;
    }
    protected function totalIncomeThisMonth(): int
    {
        return Payment::whereYear('payment_date', now()->year)
            ->whereMonth('payment_date', now()->month)
            ->sum('amount');
    }
    protected function classesToday(): array
{
    $hoy = now()->format('D'); // Or numeric weekday

    $classes = Classe::with([
        'plan',
        'teachers',
        'timeslot',
        'schedule'
    ])
    ->whereHas('schedule', function ($q) use ($hoy) {
        $q->whereJsonContains('day', $hoy);
    })
    ->get();

    $data = $classes->map(function ($class) {
        return [
            'class_id' => $class->id,
            'class_name' => $class->name,
            'plan' => $class->plan?->name ?? 'Sin plan',
            'teacher' => $class->teachers
                ->map(fn($t) => $t->name . ' ' . $t->last_name)
                ->join(', '),
            'hour' => $class->timeslot?->hour,
        ];
    });

    return [
        'day' => $hoy,
        'total_classes' => $data->count(),
        'classes' => $data,
    ];
}
}
