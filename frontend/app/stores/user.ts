import { defineStore } from "pinia";
import type { User } from "~/app/types";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
  actions: {
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
      }
    },
    async registerUser(userData: { name: string }) {
      try {
        const user = await useApiFetch<User>("/users", {
          method: "POST",
          body: userData,
        });
        this.setUser(user);
      } catch (error) {
        console.error("ユーザー登録に失敗しました", error);
        alert("ユーザー登録に失敗しました。");
      }
    },
    logout() {
      this.user = null;
    },
  },
});
