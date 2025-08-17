'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import apiClient from '@/app/lib/apiClient';
import { User as AppUser } from '@/types'; // データベースのUserモデルの型
import { useRouter, usePathname } from 'next/navigation';


// Contextの型定義を更新
type AuthContextType = {
  firebaseUser: FirebaseUser | null;
  appUser: AppUser | null; // データベースのユーザー情報を追加
  loading: boolean;
};

// Contextの作成
const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  appUser: null, // 初期値を追加
  loading: true,
});

// Contextを提供するためのプロバイダーコンポーネント
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null); // データベースユーザー用のstate
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChangedでFirebaseの認証状態の変更を監視
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        // 新規登録直後のトークンの問題を解決するため、トークンを強制的にリフレッシュ
        await user.getIdToken(true);
        // Firebaseにログインしている場合、バックエンドにユーザー情報を問い合わせる
        try {
          const response = await apiClient.get("/me");
          setAppUser(response.data);
        } catch (error) {
          console.error("DBユーザー情報の取得に失敗:", error);
          setAppUser(null);
        }
      } else {
        // ログアウトしている場合はDBユーザー情報もクリア
        setAppUser(null);
      }
      setLoading(false);
    });

    // コンポーネントが不要になったら監視を解除
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ firebaseUser, appUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Contextを簡単に利用するためのカスタムフック
export const useAuth = () => useContext(AuthContext);

// ページを保護するためのコンポーネント (AuthGuardは変更なし)
export const AuthGuard = ({ children }: { children: ReactNode }) => {
  // 🔽 AuthContext.tsxの修正に合わせて、firebaseUserを取得するようにしてください
  const { firebaseUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!firebaseUser && pathname !== '/login' && pathname !== '/register') {
        router.push('/login');
      }
    }
  }, [firebaseUser, loading, router, pathname]);

  if (loading) {
    // 条件1: 読み込み中はローディング表示を返す
    return <p>Loading...</p>;
  }

  if (firebaseUser || pathname === '/login' || pathname === '/register') {
    // 条件2: ログイン済み、またはログイン/登録ページの場合は子要素を返す
    return <>{children}</>;
  }

  // 上記のどの条件にも当てはまらない場合（リダイレクト待ちなど）はnullを返す
  return null; // ◀◀◀ この行が重要
};