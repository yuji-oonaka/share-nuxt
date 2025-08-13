'use client'; // useStateやuseRouterを使うため

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/lib/firebase'; // Firebaseのauthインスタンス
import { AuthHeader } from '@/app/components/AuthHeader'; // 共通ヘッダー

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      // Firebaseのメール・パスワード認証でログイン
      await signInWithEmailAndPassword(auth, email, password);
      // ログイン成功後、トップページに移動
      router.push('/');
    } catch (err) {
      console.error('ログインエラー:', err);
      setError('メールアドレスまたはパスワードが間違っています。');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <AuthHeader />

      {/* フォーム部分 */}
      <main className="w-full max-w-md bg-white text-gray-800 p-10 rounded-lg mt-12 mx-4">
        <h1 className="text-2xl font-bold text-center mb-8">ログイン</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              ログイン
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