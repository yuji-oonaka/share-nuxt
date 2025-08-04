<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Post; // Postモデルをインポート
use App\Models\User; // Userモデルをインポート
use App\Http\Middleware\FirebaseAuthenticate; 

class PostApiTest extends TestCase
{
    // 各テスト実行後にデータベースをリセットする
    use RefreshDatabase;

    /**
     * 投稿一覧が正しく取得できることをテスト
     */
    public function test_投稿一覧が正しく取得できること(): void
    {
        // 1. 準備 (Arrange)
        // テスト用のユーザーと投稿を3件作成する
        $user = User::factory()->create();
        $posts = Post::factory()->count(3)->create(['user_id' => $user->id]);

        // 2. 実行 (Act)
        // /api/postsエンドポイントにGETリクエストを送る
        $response = $this->getJson('/api/posts');

        // 3. 検証 (Assert)
        // レスポンスが正常（ステータスコード200）であることを確認
        $response->assertStatus(200);
        // 取得した投稿が3件であることを確認
        $response->assertJsonCount(3);
        // レスポンスに、作成した投稿の本文が含まれていることを確認
        $response->assertJsonFragment([
            'content' => $posts[0]->content,
        ]);
    }

    public function test_認証済みユーザーは投稿を作成できる(): void
    {
        // 1. 準備 (Arrange)
        $user = User::factory()->create();
        $postData = ['content' => 'これは新しい投稿です。'];

        // 2. 実行 (Act)
        // ★ FirebaseAuthenticateミドルウェアを一時的に無効化する
        $response = $this->withoutMiddleware(FirebaseAuthenticate::class)
                         ->actingAs($user)
                         ->postJson('/api/posts', $postData);

        // 3. 検証 (Assert)
        $response->assertStatus(201);
        $this->assertDatabaseHas('posts', $postData);
    }

    /**
     * 認証されていないユーザーが投稿を作成できないことをテスト
     */
    public function test_未認証ユーザーは投稿を作成できない(): void
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