export default defineNuxtPlugin(async (nuxtApp) => {
  const userStore = useUserStore();

  // isHydratingは、クライアントサイドでの最初の読み込み時のみtrueになる
  if (process.client && nuxtApp.isHydrating && !userStore.isLoggedIn) {
    const { getCurrentUser } = useAuth();

    try {
      // Firebaseの認証状態が復元されるのを待つ
      const firebaseUser = await getCurrentUser();

      if (firebaseUser) {
        // Firebaseユーザーがいれば、バックエンドからDBユーザー情報を取得
        // これにより、userStore.isLoggedIn が true に設定される
        await userStore.fetchUser();
      }
    } catch (error) {
      console.error("認証状態の復元に失敗しました:", error);
      // エラーが発生した場合は、念のためストアをクリア
      userStore.setUser(null);
    }
  }
});
