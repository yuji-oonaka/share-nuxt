<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 外部キー制約を一時的に無効にする
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // データを投入する前に、既存のテーブルを空にする
        // 依存関係の逆順（子テーブルから）でtruncateしていく
        DB::table('likes')->truncate();
        DB::table('comments')->truncate();
        DB::table('posts')->truncate();
        DB::table('users')->truncate();

        // Seederを正しい順番で呼び出す
        $this->call([
            UserSeeder::class,
            PostSeeder::class,
            CommentSeeder::class,
            LikeSeeder::class,
        ]);

        // 外部キー制約を再度有効にする
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}