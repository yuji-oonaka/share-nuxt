<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str; // <-- Add this line

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // This part is now correct
        User::create([
            'firebase_uid'    => 'test_user_firebase_uid_01',
            'name'            => 'テストユーザー',
            'email'           => 'test@example.com',
            'email_verified_at' => now(),
            'password'        => Hash::make('password'),
            'remember_token'  => Str::random(10),
        ]);

        User::factory()->count(9)->create();
    }
}