<?php

namespace Database\Seeders;

use App\Models\Teacher;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Teacher::create([
            'name' => 'First Teacher Name',
            'last_name' => 'First Teacher Last Name',
            'email' => 'firstteacher@example.com',
            'phone' => '+573123456789',
            'dni' => 'First Teacher DNI (123456789)'
        ]);
        Teacher::create([
            'name' => 'Second Teacher Name',
            'last_name' => 'Second Teacher Last Name',
            'email' => 'secondteacher@example.com',
            'phone' => '+573987654321',
            'dni' => 'Second Teacher DNI (987654321)'
        ]);
        Teacher::create([
            'name' => 'Third Teacher Name',
            'last_name' => 'Third Teacher Last Name',
            'email' => 'thirdteacher@example.com',
            'phone' => '+573333333333',
            'dni' => 'Third Teacher DNI (333333333)'
        ]);
    }
}
