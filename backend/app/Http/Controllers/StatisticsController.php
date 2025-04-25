<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Plan;
use App\Models\Teacher;
use App\Models\Classe;
use App\Models\ClassScheduleTimeslot;
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
        return Plan::withCount(['classes as students_count' => function ($query) {
            $query->withCount(['classSchedules as schedules_count' => function ($q) {
                $q->withCount('classScheduleTimeslots as timeslot_count');
            }]);
        }])->get()->mapWithKeys(function ($plan) {
            $studentsCount = $plan->classes->flatMap(function ($class) {
                return $class->classSchedules->flatMap(function ($schedule) {
                    return $schedule->classScheduleTimeslots->flatMap(function ($timeslot) {
                        return $timeslot->students->pluck('id');
                    });
                });
            })->unique()->count();

            return [$plan->name => $studentsCount];
        })->toArray();
    }

    protected function studentsPerTeacher(): array
    {
        return Teacher::with('timeslots.students')->get()->mapWithKeys(function ($teacher) {
            $students = $teacher->timeslots->flatMap(function ($slot) {
                return $slot->students->pluck('id');
            })->unique();

            return [$teacher->name . ' ' . $teacher->last_name => $students->count()];
        })->toArray();
    }

    public function studentsPerClass()
    {
        $classes = Classe::with([
            'plan:id,name',
            'classSchedules.classScheduleTimeslots.students',
            'schedules.timeslots' => function ($query) {
                $query->select('timeslots.id', 'hour');
            },
        ])->get();

        $data = $classes->map(function ($class) {
            $studentsCount = $class->classSchedules
                ->flatMap(fn($schedule) => $schedule->classScheduleTimeslots)
                ->flatMap(fn($timeslot) => $timeslot->students)
                ->unique('id')
                ->count();

            // Recolectar horarios
            $days = $class->schedules->pluck('days')->flatten()->unique();
            $times = $class->schedules->flatMap->timeslots->map(function ($slot) {
                return $slot->hour;
            })->unique();

            return [
                'class_id' => $class->id,
                'plan' => $class->plan?->name,
                'students_count' => $studentsCount,
                'days' => $days,
                'times' => $times,
            ];
        });

        return [
            'classes' => $data,
        ];
    }
    protected function studentsPerWeek(): array
    {
        $dias = [
            1 => 'Lun',
            2 => 'Mar',
            3 => 'Mie',
            4 => 'Jue',
            5 => 'Vie',
            6 => 'Sab',
            7 => 'Dom',
        ];

        // Obtenemos la cantidad de estudiantes únicos por día de la semana (1 = Lunes, ..., 7 = Domingo)
        $asistencia = Attendance::join('class_schedule_timeslot_students', 'attendances.c_sch_ts_student_id', '=', 'class_schedule_timeslot_students.id')
            ->selectRaw('WEEKDAY(attendances.date) + 1 as weekday, COUNT(DISTINCT class_schedule_timeslot_students.student_id) as total')
            ->groupBy('weekday')
            ->get()
            ->mapWithKeys(function ($item) use ($dias) {
                return [$dias[$item->weekday] => $item->total];
            });

        // Aseguramos que todos los días estén presentes, aunque sea con total = 0
        $resultado = [];
        foreach ([1, 2, 3, 4, 5, 6] as $i) { // Solo Lunes a Sábado
            $nombre = $dias[$i];
            $resultado[] = [
                'name' => $nombre,
                'total' => $asistencia->get($nombre, 0),
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
        $hoy = now()->format('D'); // 'Mon', 'Tue', etc.

        // Buscar timeslots donde el día actual esté incluido en el array 'days' del schedule
        $timeslots = ClassScheduleTimeslot::with([
            'classSchedule.classe.plan',
            'classSchedule.schedule',
            'teachers',
            'timeslot'
        ])
            ->whereHas('classSchedule.schedule', function ($q) use ($hoy) {
                $q->whereJsonContains('days', $hoy);
            })
            ->get();

        $data = $timeslots->map(function ($ts) {
            return [
                'class_id' => $ts->classSchedule->class_id,
                'class_name' => $ts->classSchedule->classe->name ?? 'Clase sin nombre',
                'plan' => $ts->classSchedule->classe->plan->name ?? 'Sin plan',
                'teacher' => $ts->teachers->map(fn($t) => $t->name . ' ' . $t->last_name)->join(', '),
                'hour' => $ts->timeslot->hour,
            ];
        });

        return [
            'day' => $hoy,
            'total_classes' => $data->count(),
            'classes' => $data,
        ];
    }
}
