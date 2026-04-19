
import { getSession, signOut } from "next-auth/react";

const api = async <T = unknown>(url: string, options: RequestInit = {}): Promise<T> => {
  // Converte URLs do backend para usar o proxy
  const session = await getSession();

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
      'ngrok-skip-browser-warning': '69420',  // 🔧 Valor correto do ngrok (não é true, é um número mágico)
      'User-Agent': 'PostmanRuntime/7.32.3', // 🔧 Identifica como cliente confiável
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
    console.log(`[API] Attempt ${attempt}: Fetching ${url}`);
    console.log(`[API] Token present: ${token ? 'yes' : 'no'}`);
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
    
    // 🔴 DEBUG: Pega a resposta COMPLETA em texto
    const responseText = await response.text();
    
    console.error('[API] ❌ ERRO DETECTADO');
    console.error('[API] URL:', url);
    console.error('[API] Status:', response.status);
    console.error('[API] Content-Type:', response.headers.get('content-type'));
    console.error('[API] Resposta (primeiros 500 chars):', responseText.substring(0, 500));
    
    // Se é HTML (error page do backend ou navegador), mostra aviso
    if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
      console.error('[API] ⚠️ Backend retornou HTML em vez de JSON!');
      console.error('[API] Possíveis causas:');
      console.error('[API]   1. Endpoint não existe');
      console.error('[API]   2. Backend quebrou (erro 500)');
      console.error('[API]   3. CORS bloqueado pelo navegador');
      errorMessage = `Erro do backend: ${response.status}. Verifique os logs do servidor.`;
    } else {
      // Tenta parsear como JSON para dar uma mensagem melhor
      try {
        const errorBody = JSON.parse(responseText);
        errorMessage = errorBody.detail || JSON.stringify(errorBody);
      } catch {
        errorMessage = responseText.substring(0, 200);
      }
    }
    
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    console.log(`[API] Request to ${url} successful with 204 No Content.`);
    return {} as T;
  }

  console.log(`[API] Request to ${url} successful.`);
  
  // 🔴 ADICIONAR LOGS AQUI
  const responseText = await response.text();
  console.log('[API] Response Content-Type:', response.headers.get('content-type'));
  console.log('[API] Response length:', responseText.length);
  console.log('[API] Response (primeiros 300 chars):', responseText.substring(0, 300));
  
  // ⚠️ DETECTOR: Status 200 mas retornou HTML!
  if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
    console.error('[API] ❌ ALERTA: Status 200 mas conteúdo é HTML!');
    console.error('[API] URL:', url);
    console.error('[API] HTML:', responseText.substring(0, 500));
    throw new Error('Backend retornou HTML em vez de JSON (Status 200)');
  }
  
  try {
    return JSON.parse(responseText) as Promise<T>;
  } catch (e) {
    console.error('[API] Erro ao fazer parse do JSON:', e);
    console.error('[API] Response:', responseText);
    throw new Error('Resposta inválida do servidor');
  }
};

export default api;

