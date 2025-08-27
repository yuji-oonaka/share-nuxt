// frontend/vitest.setup.ts
import { vi } from "vitest";

process.client = true;

vi.stubGlobal(
  "defineNuxtRouteMiddleware",
  vi.fn((middleware) => middleware)
);
