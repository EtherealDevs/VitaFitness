<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Plan::create([
            'name' => 'Basic Plan',
            'description' => 'Fierro y bici nada mas',
            'status' => 'activo'
        ]);
        Plan::create([
            'name' => 'Yoga Plan',
            'description' => 'Fierro, bici y yoga para los trolos',
            'status' => 'inactivo'
        ]);
        Plan::create([
            'name' => 'Crossfit Plan',
            'description' => 'Fierro, bici y crossfit para los transexuales',
            'status' => 'activo'
        ]);
    }
}
