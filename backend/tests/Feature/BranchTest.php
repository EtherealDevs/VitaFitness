<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class BranchTest extends TestCase
{
    public function test_get_branches(): void{
        $user = User::factory()->create();
        $branch = Branch::create([
            'name' => 'Test Branch',
            'address' => 'Test Address'
        ]);
        $response = $this->actingAs($user)->get('/api/branches');

        $response->assertStatus(200);
    }
    public function test_get_branch_by_id(): void
    {
        $user = User::first();
        $branch = Branch::first();
        $response = $this->actingAs($user)->get('/api/branches/'.$branch->id);

        $response->assertStatus(200);
    }
    public function test_add_branch():void{
        $user = User::first();
        $response = $this->actingAs($user)->post('/api/branches', [
            'name' => 'Second Testing Branch',
            'address' => 'Second Testing Address'
        ]);

        $response->assertStatus(201);
    }
    public function test_update_branch():void
    {
        $user = User::first();
        $branch = Branch::first();
        $response = $this->actingAs($user)->put('/api/branches/'.$branch->id, [
            'name' => 'Updated Testing Branch',
            'address' => 'Updated Testing Address'
        ]);
        $response->assertStatus(200);
    }
    public function test_delete_branch():void
    {
        $user = User::first();
        $branch = Branch::where('name', '=', 'Second Testing Branch')->first();
        $response = $this->actingAs($user)->delete('/api/branches/'.$branch->id);

        $response->assertStatus(204);
    }
}
