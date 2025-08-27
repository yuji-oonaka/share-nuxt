export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();

  // 未ログイン状態で、ログイン/登録ページ以外にアクセスしようとした場合
  if (
    !userStore.isLoggedIn &&
    to.path !== "/login" &&
    to.path !== "/register"
  ) {
    // ログインページへ強制的にリダイレクト
    return navigateTo("/login");
  }

  // ログイン済み状態で、ログイン/登録ページにアクセスしようとした場合
  if (
    userStore.isLoggedIn &&
    (to.path === "/login" || to.path === "/register")
  ) {
    // ホームページへ強制的にリダイレクト
    return navigateTo("/");
  }
});
