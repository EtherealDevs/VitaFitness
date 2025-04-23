<?php

namespace Database\Seeders;

use App\Models\Classe;
use App\Models\ClassSchedule;
use App\Models\Payment;
use App\Models\Student;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classSchedule = ClassSchedule::first();

        foreach ($classSchedule->students as $student) {
            $student->payments()->create([
                'classSchedule_id' => $classSchedule->id,
                'amount' => 10000,
                'payment_date' => now(),
                'status' => 'pagado',
                'expiration_date' => now()->addMonth(),
                'date_start' => now(),
                'student_id' => 1,
            ]);
        }
    }
}
