<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class LikeSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $posts = Post::all();

        foreach ($posts as $post) {
            // この投稿にいいねをするユーザーをランダムに決定 (0人〜最大ユーザー数)
            $likingUsers = $users->random(rand(0, $users->count()));

            foreach ($likingUsers as $user) {
                DB::table('likes')->insert([
                    'user_id' => $user->id,
                    'post_id' => $post->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}