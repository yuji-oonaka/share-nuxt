<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class PostController extends Controller
{
    /**
     * 投稿の一覧を取得する
     */
    public function index()
    {
        // ユーザー情報も一緒に、新しい順で全件取得
        $posts = Post::with('user', 'likes')->withCount('likes', 'comments')->latest()->get();
        return response()->json($posts);
    }

    /**
     * 新しい投稿を保存する
     */
    public function store(Request $request)
    {
        try {
            // バリデーション
            $validated = $request->validate([
                'content' => 'required|string|max:120',
            ]);

            // 投稿を作成
            // ログインしているユーザーのIDをuser_idとして保存
            $post = $request->user()->posts()->create([
                'content' => $validated['content'],
            ]);

            return response()->json($post, 201);

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => '投稿に失敗しました。'], 500);
        }
    }

    public function destroy(Post $post)
    {
        // 認可チェック（PostPolicy@deleteが呼ばれる）
        $this->authorize('delete', $post);

        $post->delete();

        // 成功したら204 No Contentを返す
        return response()->noContent();
    }

    public function show(Post $post) // ◀◀◀ このメソッドを追加
    {
        // 投稿に紐づく全ての情報をEager Loadして返す
        $post->load(['user', 'likes', 'comments.user']);
        return response()->json($post);
    }
}