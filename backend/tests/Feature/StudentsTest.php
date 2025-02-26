<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class StudentsTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_get_students(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/api/students');
        $response->assertStatus(200);
    }
    public function test_get_student_by_id(): void
    {
        $branch_id = Branch::create([
            'name' => 'Branch Name',
            'address' => 'Branch Address',
        ])->id;
        $id = Student::create([
            'name' => 'Student name',
            'last_name' => 'Student last name',
            'registration_date' => now(),
            'email' => 'student@example.com',
            'dni' => '123456789',
            'phone' => '123456789',
            'branches_id' => $branch_id,
        ])->id;
        $user = User::factory()->create();
        $response = $this->actingAs($user)->get('/api/students/'.$id);
        $response->assertStatus(200);
    }
    public function test_add_student(): void
    {
        $user = User::first();
        $branch = Branch::first();
        $response = $this->actingAs($user)->post('/api/students', [
            'name' => 'John',
            'last_name' => 'Doe',
            'registration_date' => now(),
            'email' => 'john@example.com',
            'dni' => '123456781',
            'phone' => '123456789',
            'branches_id' => $branch->id,
        ]);
        $response->assertStatus(201);
    }
    public function test_update_student(): void
    {
        $user = User::first();
        $student = Student::find(2);
        $response = $this->actingAs($user)->patch('/api/students/'.$student->id, [
            'name' => 'Jane',
            'last_name' => 'Doe',
            'registration_date' => '2025-02-13',
            'email' => 'jane@example.com',
            'dni' => '987654321',
            'phone' => '987654321',
            'branches_id' => 1,
        ]);
        $response->assertStatus(204);
    }
    public function test_delete_student(): void
    {
        $user = User::first();
        $student = Student::find(2);
        $response = $this->actingAs($user)->delete('/api/students/'.$student->id);
        $response->assertStatus(204);
    }
}
