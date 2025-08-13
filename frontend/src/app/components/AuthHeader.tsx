import Link from 'next/link';
import Image from 'next/image';

export const AuthHeader = () => {
  return (
    <header className="w-full max-w-5xl flex justify-between items-center p-5">
      <Link href="/">
        <Image
          src="/images/logo.png"
          alt="SHARE Logo"
          width={120} // この値は画像の元々の縦横比の計算に使われます
          height={40}  // この値は画像の元々の縦横比の計算に使われます
          priority
          className="w-32 h-auto" // このクラスで実際の表示サイズを指定します
        />
      </Link>
      <div className="flex items-center space-x-5 text-white">
        <Link href="/register" className="hover:underline">
          新規登録
        </Link>
        <Link href="/login" className="hover:underline">
          ログイン
        </Link>
      </div>
    </header>
  );
};