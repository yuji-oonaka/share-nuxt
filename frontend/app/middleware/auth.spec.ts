import { describe, it, expect, vi, beforeEach } from "vitest";
// vi.stubGlobalの行を削除

import authMiddleware from "./auth";

// ----- 依存関係のモック -----
const navigateTo = vi.fn();
vi.stubGlobal("navigateTo", navigateTo);

const useUserStore = vi.fn();
vi.stubGlobal("useUserStore", useUserStore);
// -------------------------

describe("Auth Middleware", () => {
  // ... (これ以降のコードは変更ありません) ...
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const from = { path: "/" };

  describe("未ログインユーザーの場合", () => {
    beforeEach(() => {
      useUserStore.mockReturnValue({ isLoggedIn: false });
    });

    it("保護されたページにアクセスしようとすると/loginにリダイレクトする", () => {
      const to = { path: "/dashboard" };
      authMiddleware(to, from);
      expect(navigateTo).toHaveBeenCalledWith("/login");
    });

    it("/loginページにアクセスした場合はリダイレクトしない", () => {
      const to = { path: "/login" };
      authMiddleware(to, from);
      expect(navigateTo).not.toHaveBeenCalled();
    });

    it("/registerページにアクセスした場合はリダイレクトしない", () => {
      const to = { path: "/register" };
      authMiddleware(to, from);
      expect(navigateTo).not.toHaveBeenCalled();
    });
  });

  describe("ログイン済みユーザーの場合", () => {
    beforeEach(() => {
      useUserStore.mockReturnValue({ isLoggedIn: true });
    });

    it("/loginページにアクセスしようとすると/にリダイレクトする", () => {
      const to = { path: "/login" };
      authMiddleware(to, from);
      expect(navigateTo).toHaveBeenCalledWith("/");
    });

    it("/registerページにアクセスしようとすると/にリダイレクトする", () => {
      const to = { path: "/register" };
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
