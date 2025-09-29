const AUTH_TOKEN_KEY = "authToken";

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const saveAuthToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const fetchWithAuth = (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();
  const newOptions = { ...options };

  if (token) {
    newOptions.headers = {
      ...newOptions.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  if (newOptions.body && !(newOptions.body instanceof FormData)) {
    newOptions.headers = {
      ...newOptions.headers,
      "Content-Type": "application/json",
    };
  }
  return fetch(url, newOptions);
};
