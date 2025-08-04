<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Post;

class CommentFactory extends Factory
{
    public function definition(): array
    {
        // ダミーコメントの選択肢を配列で用意
        $dummy_comments = [
            'わかります！',
            'すごいですね！',
            'いいですね！私も行ってみたいです。',
            'なるほど、参考になります。',
            'おめでとうございます！',
        ];

        return [
            'user_id' => User::inRandomOrder()->first()->id,
            'post_id' => Post::inRandomOrder()->first()->id,
            // こちらも同様に、配列からランダムに1つ選ぶ
            'content' => $this->faker->randomElement($dummy_comments),
        ];
    }
}