import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useUserStore } from "./user";
import type { User } from "~/app/types";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
const useApiFetch = vi.fn();
vi.stubGlobal("useApiFetch", useApiFetch);

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("User Store", () => {
  let store: ReturnType<typeof useUserStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useUserStore();
    vi.clearAllMocks();
  });

  it("初期状態", () => {
    expect(store.user).toBeNull();
    expect(store.isLoggedIn).toBe(false);
    expect(store.isAuthReady).toBe(false);
  });

  const mockUser: User = {
    id: 1,
    name: "テストユーザー",
    email: "test@example.com",
  };

  it("setUser アクション", () => {
    store.setUser(mockUser);
    expect(store.user).toEqual(mockUser);
    expect(store.isLoggedIn).toBe(true);
  });

  it("setAuthReady アクション", () => {
    store.setAuthReady(true);
    expect(store.isAuthReady).toBe(true);
  });

  describe("fetchUser アクション", () => {
    it("成功時", async () => {
      useApiFetch.mockResolvedValue(mockUser);
      await store.fetchUser();
      expect(useApiFetch).toHaveBeenCalledWith("/me");
      expect(store.user).toEqual(mockUser);
      expect(store.isAuthReady).toBe(true);
    });

    it("失敗時", async () => {
      useApiFetch.mockRejectedValue(new Error("API Error"));
      await store.fetchUser();
      expect(store.user).toBeNull();
      expect(store.isAuthReady).toBe(true);
    });
  });
});
