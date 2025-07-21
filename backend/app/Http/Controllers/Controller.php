<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User; // ◀◀◀ Userモデルをuse
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // ◀◀◀ ログ出力用にuse

class UserController extends Controller
{
    /**
     * ユーザー情報をDBに登録する (Store a newly created resource in storage.)
     */
    public function store(Request $request)
    {
        // バリデーションを実行
        $validated = $request->validate([
            'name' => 'required|string|max:20',
        ]);

        // Firebaseから渡されるはずのUIDをRequestから取得
        // この時点ではまだFirebaseとの連携部分がないため、ダミーのUIDやテスト用のUIDを使います。
        // 実際のUIDはフロントエンドからのリクエストに含まれる想定です。
        $firebaseUid = $request->input('firebase_uid'); // ここは後でFirebase連携時に本物の値が入ります

        // firebase_uidが渡されていない場合はエラーを返す
        if (!$firebaseUid) {
            return response()->json(['message' => 'Firebase UID is required.'], 400);
        }

        try {
            $user = User::create([
                'firebase_uid' => $firebaseUid,
                'name' => $validated['name'],
            ]);

            // 成功したら、作成されたユーザー情報を201ステータスで返す
            return response()->json($user, 201);

        } catch (\Exception $e) {
            // エラーログを出力
            Log::error($e->getMessage());
            // エラーレスポンスを返す
            return response()->json(['message' => 'ユーザーの作成に失敗しました。'], 500);
        }
    }

    // index, show, update, destroy メソッドは今は空のままでOK
}