<?php

namespace Tests\Feature;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TeacherSchedulesTest extends TestCase
{
    public function test_get_teacher_schedules(): void
    {
        $user = User::factory()->create();
        $teacher = Teacher::create([
            'name' => 'Test Teacher',
            'last_name' => 'Test Teacher',
            'email' => 'test@test.com',
            'phone' => '1234567890',
            'dni' => '1234567890',
            'branch_id' => 1,
        ]);
        $teacher->schedules()->create([
            'teacher_id' => $teacher->id,
            'start_time' => now(),
            'end_time' => now(),
            'day' => 'tuesday',
        ]);
        $response = $this->actingAs($user)->get('/api/teacherSchedules/');
        $response->assertStatus(200);
    }
    public function test_get_teacher_schedule_by_id(): void
    {
        $user = User::first();
        $teacher = Teacher::first();
        $schedule = $teacher->schedules()->first();
        $response = $this->actingAs($user)->get('/api/teacherSchedules/'.$schedule->id);
        $response->assertStatus(200);
    }
    public function test_add_teacher_schedule(): void
    {
        $user = User::first();
        $teacher = Teacher::first();
        $response = $this->actingAs($user)->post('/api/teacherSchedules', [
            'teacher_id' => $teacher->id,
            'start_time' => now()->format('H:i:s'),
            'end_time' => now()->format('H:i:s'),
            'day' => 'tuesday',
        ]);
        $response->assertStatus(201);
    }
    public function test_update_teacher_schedule(): void
    {
        $user = User::first();
        $teacher = Teacher::first();
        $schedule = $teacher->schedules()->first();
        $response = $this->actingAs($user)->put('/api/teacherSchedules/'.$schedule->id, [
            'teacher_id' => $teacher->id,
            'start_time' => now()->format('H:i:s'),
            'end_time' => now()->format('H:i:s'),
            'day' => 'tuesday',
        ]);
        $response->assertStatus(204);
    }
    public function test_delete_teacher_schedule(): void
    {
        $user = User::first();
        $teacher = Teacher::first();
        $schedule = $teacher->schedules()->create([
            'teacher_id' => $teacher->id,
            'start_time' => now()->format('H:i:s'),
            'end_time' => now()->format('H:i:s'),
            'day' => 'tuesday',
        ]);
        $response = $this->actingAs($user)->delete('/api/teacherSchedules/'.$schedule->id);
        $response->assertStatus(204);
    }
}
