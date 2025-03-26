<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $hashedPassword = Hash::make(env('ADMIN_PASS'));
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
        User::factory()->create([
            'name' => env('ADMIN_NAME'),
            'email' => env('ADMIN_EMAIL'),
            'password' => $hashedPassword,
        ]);
        $this->call(RolePermissionSeeder::class);

        //branch
        $this->call(BranchSeeder::class);
        //plans
        $this->call(PlanSeeder::class);
        //student
        $this->call(StudentSeeder::class);
        //teacher
        $this->call(TeacherSeeder::class);
        //schedule
        $this->call(ScheduleSeeder::class);
        //timeslot
        $this->call(TimeSlotSeeder::class);
        //class
        $this->call(ClassSeeder::class);
        //payment
        $this->call(PaymentSeeder::class);
        // //attendance
        $this->call(AttendanceSeeder::class);
    }
}
