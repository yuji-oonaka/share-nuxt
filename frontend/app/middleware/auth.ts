export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();

  // SSR 時は何もしない
  if (process.server) return;

  // 認証状態がまだ確定していなければ何もせず待つ
  if (!userStore.isAuthReady) return;

  // 未ログインでアクセスしてはいけないページ
  if (!userStore.isLoggedIn && !["/login", "/register"].includes(to.path)) {
    return navigateTo("/login");
  }

  // ログイン済みでアクセスできないページ
  if (userStore.isLoggedIn && ["/login", "/register"].includes(to.path)) {
    return navigateTo("/");
  }
});
