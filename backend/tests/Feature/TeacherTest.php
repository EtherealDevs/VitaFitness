<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TeacherTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_get_teachers(): void
    {
        $user = User::factory()->create();
        $branch_id = Branch::create([
            'name' => 'Teacher Branch',
            'address' => 'Branch Address',
        ])->id;
        Teacher::create([
            'name' => 'Teacher name',
            'last_name' => 'Teacher last name',
            'email' => 'teacher@example.com',
            'phone' => '123456789',
            'dni' => '123456789',
            'branch_id' => $branch_id,
        ]);

        $response = $this->actingAs($user)->get('/api/teachers');
        $response->assertStatus(200);
    }
    public function test_get_teacher_by_id(): void
    {
        $branch_id = Branch::first()->id;
        $id = Teacher::first()->id;
        $user = User::first();
        $response = $this->actingAs($user)->get('/api/teachers/'.$id);
        $response->assertStatus(200);
    }
    public function test_add_teacher(): void
    {
        $user = User::first();
        $branch = Branch::where('name', '=', 'Teacher Branch')->first();
        $response = $this->actingAs($user)->post('/api/teachers', [
            'name' => 'New Teacher name',
            'last_name' => 'New Teacher last name',
            'email' => 'anotherteacher@example.com',
            'phone' => '123456789',
            'dni' => '123455432',
            'branch_id' => $branch->id,
        ]);

        $response->assertStatus(201);
    }
    public function test_update_teacher(): void
    {
        $user = User::first();
        $branch = Branch::where('name', '=', 'Teacher Branch')->first();
        $teacher = Teacher::where('name', '=', 'New Teacher name')->first();
        $response = $this->actingAs($user)->put('/api/teachers/'.$teacher->id, [
            'name' => 'Updated Teacher name',
            'last_name' => 'Updated Teacher last name',
            'email' => 'anotherteacher@example.com',
            'phone' => '123456789',
            'dni' => '123455432',
            'branch_id' => $branch->id,
        ]);
        $response->assertStatus(204);
    }
    public function test_delete_teacher(): void
    {
        $user = User::first();
        $teacher = Teacher::where('name', '=', 'Updated Teacher name')->first();
        $response = $this->actingAs($user)->delete('/api/teachers/'.$teacher->id);
        $response->assertStatus(204);
    }
    public function test_get_all_teachers_with_related(): void
    {
        $user = User::first();
        $response = $this->actingAs($user)->get('/api/teachers');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            "teachers" => [
                [
                    'id',
                    'name',
                    'last_name' ,
                    'email',
                    'phone',
                    'dni',
                    "branch" => [
                        "id",
                        "name",
                        "address",
                    ],
                ],
            ]
        ]);
    }
}
