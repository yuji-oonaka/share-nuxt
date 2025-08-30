import { describe, it, expect, vi, beforeEach } from "vitest";
// 拡張子 .ts を付けてインポート
import authMiddleware from "./auth.ts";

// ----- Mocks -----
const navigateTo = vi.fn();

// userStoreのモック。テストケースごとに値を変更できるようにする
const mockUserStoreState = {
  isLoggedIn: false,
  isAuthReady: false,
};

vi.stubGlobal("navigateTo", navigateTo);
vi.stubGlobal(
  "useUserStore",
  vi.fn(() => mockUserStoreState)
);
// -----------------

describe("Auth Middleware", () => {
  const from = { path: "/" };

  beforeEach(() => {
    // 各テストの前にモックの状態をリセット
    vi.clearAllMocks();
    mockUserStoreState.isLoggedIn = false;
    mockUserStoreState.isAuthReady = false;
    // process.server の状態もリセット
    global.process = { ...global.process, server: false };
  });

  it("サーバーサイドでは何もしない", () => {
    global.process.server = true; // サーバーサイドの状況をシミュレート
    const to = { path: "/dashboard" };
    authMiddleware(to, from);
    expect(navigateTo).not.toHaveBeenCalled();
  });

  it("認証準備ができていない場合は何もしない", () => {
    mockUserStoreState.isAuthReady = false; // 認証準備ができていない状態
    const to = { path: "/dashboard" };
    authMiddleware(to, from);
    expect(navigateTo).not.toHaveBeenCalled();
  });

  describe("未ログインユーザーの場合 (認証準備完了後)", () => {
    beforeEach(() => {
      mockUserStoreState.isLoggedIn = false;
      mockUserStoreState.isAuthReady = true;
    });

    it("保護されたページにアクセスすると/loginにリダイレクトする", () => {
      const to = { path: "/dashboard" };
      authMiddleware(to, from);
      expect(navigateTo).toHaveBeenCalledWith("/login");
    });

    it("/loginページにアクセスした場合はリダイレクトしない", () => {
      const to = { path: "/login" };
      authMiddleware(to, from);
      expect(navigateTo).not.toHaveBeenCalled();
    });
  });

  describe("ログイン済みユーザーの場合 (認証準備完了後)", () => {
    beforeEach(() => {
      mockUserStoreState.isLoggedIn = true;
      mockUserStoreState.isAuthReady = true;
    });

    it("/loginページにアクセスすると/にリダイレクトする", () => {
      const to = { path: "/login" };
      authMiddleware(to, from);
      expect(navigateTo).toHaveBeenCalledWith("/");
    });

    it("保護されたページにアクセスした場合はリダイレクトしない", () => {
      const to = { path: "/dashboard" };
      authMiddleware(to, from);
      expect(navigateTo).not.toHaveBeenCalled();
    });
  });
});
