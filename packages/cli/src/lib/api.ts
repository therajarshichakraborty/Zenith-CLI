import { getStoredToken } from "../commands/auth/login.js";

export async function apiRequest(path: string, options: RequestInit = {}) {
  const token = await getStoredToken();
  const serverUrl = token?.serverUrl || "https://zenith-cli.onrender.com";
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token?.access_token ? { Authorization: `Bearer ${token.access_token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${serverUrl}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    let errMsg = `Request failed: ${response.status} ${response.statusText}`;
    try {
      const errJson = JSON.parse(text);
      if (errJson.error) errMsg = errJson.error;
    } catch {}
    throw new Error(errMsg);
  }

  return response.json();
}
