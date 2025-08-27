import type { FetchOptions } from "ofetch";

export const useApiFetch = async <T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> => {
  const { getCurrentUser } = useAuth();
  const config = useRuntimeConfig();

  const headers: Record<string, string> = { ...options.headers };

  const user = await getCurrentUser();
  if (user) {
    const token = await user.getIdToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  try {
    return await $fetch<T>(url, {
      baseURL: config.public.apiBaseUrl,
      ...options,
      headers,
    });
  } catch (error: any) {
    if (error?.response?.status === 401) {
      navigateTo("/login");
    }
    throw error;
  }
};
