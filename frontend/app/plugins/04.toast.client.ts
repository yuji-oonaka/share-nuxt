// plugins/toast.client.ts

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css"; // CSSもインポート

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, {
    // ここで通知の見た目や動作を設定できます
    position: "top-right", // 通知が画面の右下に表示される
    timeout: 3000, // 3秒で自動的に消える
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
  });
});
