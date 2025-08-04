<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

class PostFactory extends Factory
{
    public function definition(): array
    {
        // ダミー投稿の選択肢を配列で用意
        $dummy_posts = [
            '今日のランチはラーメンでした。美味しかったです！',
            '週末に新しい映画を観てきました。とても感動しました。',
            '最近、プログラミングの勉強を始めました。難しいけど楽しいです。',
            '天気が良いので、公園を散歩してきました。気持ちいいですね。',
            '次の休暇はどこに行こうか計画中です。おすすめはありますか？',
        ];

        return [
            'user_id' => User::inRandomOrder()->first()->id,
            // faker->realText() の代わりに、配列からランダムに1つ選ぶ
            'content' => $this->faker->randomElement($dummy_posts),
        ];
    }
}