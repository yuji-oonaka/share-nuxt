import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useUserStore } from "./user"; // テスト対象のストア
import type { User } from "~/app/types";

// ----- 依存関係のモック -----
const useApiFetch = vi.fn();
vi.stubGlobal("useApiFetch", useApiFetch);
// -------------------------

describe("User Store", () => {
  // 各テストの前にPiniaを初期化し、モックをリセット
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("初期状態ではuserはnullで、isLoggedInはfalseである", () => {
    const store = useUserStore();
    expect(store.user).toBeNull();
    expect(store.isLoggedIn).toBe(false);
  });

  describe("actions", () => {
    const mockUser: User = {
      id: 1,
      name: "テストユーザー",
      email: "test@example.com",
    };

    it("setUser: ユーザー情報を正しくstateにセットし、isLoggedInがtrueになる", () => {
      const store = useUserStore();
      store.setUser(mockUser);
      expect(store.user).toEqual(mockUser);
      expect(store.isLoggedIn).toBe(true);
    });

    it("logout: ユーザー情報をnullに戻し、isLoggedInがfalseになる", () => {
      const store = useUserStore();
      // 事前にログイン状態にしておく
      store.user = mockUser;

      store.logout();
      expect(store.user).toBeNull();
      expect(store.isLoggedIn).toBe(false);
    });

    describe("fetchUser", () => {
      it("API通信が成功した場合、ユーザー情報を取得してstateを更新する", async () => {
        const store = useUserStore();
        // 準備: useApiFetchがユーザー情報を返すように設定
        useApiFetch.mockResolvedValue(mockUser);

        // 実行:
        await store.fetchUser();

        // 確認:
        expect(useApiFetch).toHaveBeenCalledWith("/me");
        expect(store.user).toEqual(mockUser);
        expect(store.isLoggedIn).toBe(true);
      });

      it("API通信が失敗した場合、ユーザー情報をnullにする", async () => {
        const store = useUserStore();
        // 準備: useApiFetchがエラーを投げるように設定
        useApiFetch.mockRejectedValue(new Error("API Error"));

        // 実行:
        await store.fetchUser();

        // 確認:
        expect(store.user).toBeNull();
        expect(store.isLoggedIn).toBe(false);
      });
    });

    describe("registerUser", () => {
      it("API通信が成功した場合、新規登録したユーザー情報でstateを更新する", async () => {
        const store = useUserStore();
        const newUser: User = {
          id: 2,
          name: "新規ユーザー",
          email: "new@example.com",
        };
        const registerData = { name: "新規ユーザー" };
        // 準備: useApiFetchが新規ユーザー情報を返すように設定
        useApiFetch.mockResolvedValue(newUser);

        // 実行:
        await store.registerUser(registerData);

        // 確認:
        expect(useApiFetch).toHaveBeenCalledWith("/users", {
          method: "POST",
          body: registerData,
        });
        expect(store.user).toEqual(newUser);
        expect(store.isLoggedIn).toBe(true);
      });
    });
  });
});
