import { describe, it, expect, vi, beforeEach } from "vitest";
import { useApiFetch } from "./useApiFetch";

// ----- 依存関係のモック -----
// このコンポーザブルが依存するNuxtの機能をすべてモックします

// $fetch: Nuxtのグローバルなfetch関数
const $fetch = vi.fn();
vi.stubGlobal("$fetch", $fetch);

// navigateTo: Nuxtのグローバルなページ遷移関数
const navigateTo = vi.fn();
vi.stubGlobal("navigateTo", navigateTo);

// useRuntimeConfig: nuxt.config.ts の設定値を取得
const useRuntimeConfig = vi.fn(() => ({
  public: {
    apiBaseUrl: "http://localhost:8000/api",
  },
}));
vi.stubGlobal("useRuntimeConfig", useRuntimeConfig);

// useAuth: 認証関連のコンポーザブル
const mockUser = {
  getIdToken: vi.fn(),
};
const getCurrentUser = vi.fn();
const useAuth = vi.fn(() => ({ getCurrentUser }));
vi.stubGlobal("useAuth", useAuth);

// -------------------------

describe("useApiFetch Composable", () => {
  beforeEach(() => {
    // 各テストの前にすべてのモックをリセット
    vi.clearAllMocks();
  });

  describe("認証ヘッダーのテスト", () => {
    it("ユーザーがログインしている場合、Authorizationヘッダーにトークンを追加してAPIを呼び出す", async () => {
      // 準備：ユーザーがログインしており、トークンを返す状態をシミュレート
      const fakeToken = "fake-jwt-token";
      mockUser.getIdToken.mockResolvedValue(fakeToken);
      getCurrentUser.mockResolvedValue(mockUser);
      $fetch.mockResolvedValue({ data: "success" }); // APIは成功

      // 実行：
      await useApiFetch("/test-endpoint");

      // 確認：
      const fetchOptions = $fetch.mock.calls[0][1]; // $fetchの第2引数（options）を取得
      expect(fetchOptions.headers.Authorization).toBe(`Bearer ${fakeToken}`);
      expect(fetchOptions.baseURL).toBe("http://localhost:8000/api");
    });

    it("ユーザーがログインしていない場合、AuthorizationヘッダーなしでAPIを呼び出す", async () => {
      // 準備：ユーザーがログインしていない状態をシミュレート
      getCurrentUser.mockResolvedValue(null);
      $fetch.mockResolvedValue({ data: "success" });

      // 実行：
      await useApiFetch("/test-endpoint");

      // 確認：
      const fetchOptions = $fetch.mock.calls[0][1];
      expect(fetchOptions.headers).not.toHaveProperty("Authorization");
    });
  });

  describe("エラーハンドリングのテスト", () => {
    it("APIが401エラーを返した場合、/loginにリダイレクトする", async () => {
      // 準備：APIが401エラーを返す状態をシミュレート
      const error = { response: { status: 401 } };
      $fetch.mockRejectedValue(error);
      getCurrentUser.mockResolvedValue(null);

      // 実行と確認：useApiFetchがエラーをスローすることを期待
      await expect(useApiFetch("/unauthorized")).rejects.toThrow();

      // 確認：navigateToが正しく呼ばれたか
      expect(navigateTo).toHaveBeenCalledWith("/login");
    });

    it("APIが401以外のエラーを返した場合、リダイレクトせずにエラーをスローする", async () => {
      // 準備：APIが500エラーを返す状態をシミュレート
      const error = { response: { status: 500 } };
      $fetch.mockRejectedValue(error);
      getCurrentUser.mockResolvedValue(null);

      // 実行と確認：
      await expect(useApiFetch("/server-error")).rejects.toThrow();

      // 確認：navigateToが呼ばれていないこと
      expect(navigateTo).not.toHaveBeenCalled();
    });
  });
});
