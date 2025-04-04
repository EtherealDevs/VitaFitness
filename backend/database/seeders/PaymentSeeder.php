<?php

namespace Database\Seeders;

use App\Models\Classe;
use App\Models\Payment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $class1 = Classe::all()[0];
        $class2 = Classe::all()[1];
        Payment::create([
            'class_id' => $class1->id,
            'amount' => 10000,
            'payment_date' => now(),
            'status' => 'pagado',
            'expiration_date' => now()->addDays(30),
            'date_start' => now(),
            'student_id' => 1,
        ]);
        Payment::create([
            'class_id' => $class2->id,
            'amount' => 10000,
            'payment_date' => now(),
            'status' => 'pendiente',
            'expiration_date' => now()->addDays(30),
            'date_start' => now(),
            'student_id' => 2,
        ]);
    }
}
