'use client'; // インタラクティブな機能のため、先頭にこの行が必要です

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import apiClient from '@/app/lib/apiClient'; // ★ axiosの代わりにapiClientをインポート
import { AuthHeader } from '@/app/components/AuthHeader';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      // ステップ1: Firebaseにユーザーを作成
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // ステップ2: バックエンドAPIを呼び出し、DBにユーザーを保存
      // ★ apiClientを使い、emailも送信データに含める
      await apiClient.post('/users', {
        firebase_uid: firebaseUser.uid,
        name: name,
        email: email,
      });

      router.push('/');
    } catch (err: any) {
      console.error("登録エラーの詳細:", err); // デバッグ用にエラーをコンソールに出力
      setError('登録に失敗しました。入力内容を確認してください。');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <AuthHeader />

      {/* フォーム部分 */}
      <main className="w-full max-w-md bg-white text-gray-800 p-10 rounded-lg mt-12 mx-4">
        <h1 className="text-2xl font-bold text-center mb-8">新規登録</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ユーザーネーム"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレス"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              className="bg-[#7B61FF] text-white font-bold py-3 px-5 rounded-full hover:opacity-90 transition-opacity"
            >
              新規登録
            </button>
          </div>

          {error && (
            <p className="text-red-600 text-center mt-4">{error}</p>
          )}
        </form>
      </main>
    </div>
  );
}