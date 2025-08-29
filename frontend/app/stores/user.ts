import { defineStore } from "pinia";
import type { User } from "~/app/types";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
    isAuthReady: false, // 👈 状態フラグを追加 (初期値はfalse)
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
  actions: {
    setAuthReady(status: boolean) {
      // 👈 このアクションを追加
      this.isAuthReady = status;
    },
    setUser(newUser: User | null) {
      this.user = newUser;
    },
    async fetchUser() {
      try {
        const user = await useApiFetch<User>("/me");
        this.setUser(user);
      } catch (error) {
        this.setUser(null);
        console.error("Failed to fetch user", error);
      } finally {
        this.setAuthReady(true); // 👈 処理の最後に必ずフラグをtrueにする
      }
    },
  },
});
