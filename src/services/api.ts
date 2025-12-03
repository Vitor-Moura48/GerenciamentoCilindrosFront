
import { getSession, signOut } from "next-auth/react";

const api = async <T = any>(url: string, options: RequestInit = {}): Promise<T> => {
  console.log(`[API] Making request to: ${url}`);
  let session = await getSession();

  if (!session) {
    console.log("[API] No active session found. Signing out.");
    signOut({ callbackUrl: '/' });
    throw new Error("Não autenticado");
  }
  
  if (session.error === "RefreshAccessTokenError") {
    console.log("[API] Session has RefreshAccessTokenError. Signing out.");
    signOut({ callbackUrl: '/' });
    throw new Error("Sessão expirada. Por favor, faça o login novamente.");
  }

  const makeRequest = async (token: string | undefined, attempt: number = 1) => {
    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    console.log(`[API] Attempt ${attempt}: Fetching ${url} with token: ${token ? 'present' : 'missing'}`);
    return fetch(url, { ...options, headers });
  };

  let response = await makeRequest(session.accessToken, 1);

  if (response.status === 401) {
    console.log(`[API] Initial request to ${url} returned 401. Attempting to refresh session.`);
    const newSession = await getSession(); 

    if (newSession?.error === "RefreshAccessTokenError" || !newSession?.accessToken) {
      console.log("[API] Session refresh failed or no new token. Signing out.");
      await signOut({ callbackUrl: '/' });
      throw new Error("Sessão expirada. Por favor, faça o login novamente.");
    }

    console.log("[API] Session refreshed successfully. Retrying original request.");
    response = await makeRequest(newSession.accessToken, 2); // Retried request
  }

  if (!response.ok) {
    let errorMessage = `Erro: ${response.status} ${response.statusText}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.detail || JSON.stringify(errorBody);
    } catch (e) {
      
    }
    console.error(`[API] Request to ${url} failed after retry (or initial if no 401):`, errorMessage);
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    console.log(`[API] Request to ${url} successful with 204 No Content.`);
    return {} as T;
  }

  console.log(`[API] Request to ${url} successful.`);
  return response.json() as Promise<T>;
};

export default api;
