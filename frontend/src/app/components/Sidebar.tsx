'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/lib/firebase';
import { signOut } from 'firebase/auth';
import { useState } from 'react';
import apiClient from '@/app/lib/apiClient';
import toast from 'react-hot-toast';

type SidebarProps = {
  onPostSuccess: () => void;
};

export const Sidebar = ({ onPostSuccess }: SidebarProps) => {
  const router = useRouter();
  const [content, setContent] = useState('');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('ログアウトエラー', error);
      toast.error('ログアウトに失敗しました。');
    }
  };

  const handlePost = async () => {
    if (!content.trim()) {
      toast.error('投稿内容を入力してください。');
      return;
    }

    const postPromise = apiClient.post('/posts', {
      content: content,
    });

    toast.promise(postPromise, {
      loading: '投稿中...',
      success: '投稿しました！',
      error: '投稿に失敗しました。',
    });

    try {
      await postPromise;
      setContent('');
      onPostSuccess();
    } catch (err) {
      console.error('投稿エラー:', err);
    }
  };

  return (
    <aside className="w-64 p-5 flex flex-col">
      {/* ロゴ */}
      <Link href="/">
        <Image
          src="/images/logo.png"
          alt="SHARE Logo"
          width={120}
          height={40}
          priority
          className="w-32 h-auto"
        />
      </Link>

      {/* ナビゲーションリンク */}
      <nav className="mt-10">
        <ul>
          <li className="mb-4">
            <Link
              href="/"
              className="flex items-center text-lg text-white hover:text-gray-300"
            >
              <Image
                src="/images/home.png"
                alt="ホーム"
                width={24}
                height={24}
                className="mr-3"
              />
              ホーム
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center text-lg text-white hover:text-gray-300 w-full"
            >
              <Image
                src="/images/logout.png"
                alt="ログアウト"
                width={24}
                height={24}
                className="mr-3"
              />
              ログアウト
            </button>
          </li>
        </ul>
      </nav>

      {/* 投稿フォーム */}
      <div className="mt-6">
        <textarea
          placeholder=""
          rows={4}
          className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {/* ボタンを右寄せにするためのコンテナ */}
        <div className="mt-3 flex justify-end">
          <button
            // w-fullを削除し、padding(px)で横幅を調整。角をさらに丸くする。
            className="bg-[#7B61FF] text-white font-bold py-2 px-5 rounded-full hover:opacity-90 transition-opacity"
            onClick={handlePost}
          >
            シェアする
          </button>
        </div>
      </div>
    </aside>
  );
};