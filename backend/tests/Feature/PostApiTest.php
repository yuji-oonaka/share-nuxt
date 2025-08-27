<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Post;
use App\Models\User;
use App\Http\Middleware\FirebaseAuthenticate; // Middlewareをインポート
use PHPUnit\Framework\Attributes\Test;

class PostApiTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function 投稿一覧が正しく取得できること(): void
    {
        // ... 準備は省略 ...
        $user = User::factory()->create();
        Post::factory()->count(3)->create(['user_id' => $user->id]);

        // ▼▼▼ withoutMiddlewareを追加 ▼▼▼
        $response = $this->withoutMiddleware(FirebaseAuthenticate::class)
                         ->actingAs($user)
                         ->getJson('/api/posts');

        $response->assertStatus(200);
        $response->assertJsonCount(3);
    }

  #[Test]
    public function 認証済みユーザーは投稿を作成できる(): void
    {
        // ... 準備は省略 ...
        $user = User::factory()->create();
        $postData = ['content' => 'これは新しい投稿です。'];

        // ▼▼▼ withoutMiddlewareを追加 ▼▼▼
        $response = $this->withoutMiddleware(FirebaseAuthenticate::class)
                         ->actingAs($user)
                         ->postJson('/api/posts', $postData);

        $response->assertStatus(201);
        $this->assertDatabaseHas('posts', $postData);
    }

    #[Test]
    public function 未認証ユーザーが投稿を作成できないこと(): void
    {
        // 1. 準備 (Arrange)
        $postData = ['content' => '未認証の投稿です。'];

        // 2. 実行 (Act)
        // 認証されていない状態でリクエストを送る
        $response = $this->postJson('/api/posts', $postData);

        // 3. 検証 (Assert)
        // レスポンスが認証エラー（ステータスコード401 Unauthorized）であることを確認
        $response->assertStatus(401);
    }
}