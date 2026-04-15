import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://rework-book-antirust.ngrok-free.dev';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log('[AUTH/LOGIN] Iniciando login', { matricula: body.matricula });
    console.log('[AUTH/LOGIN] BACKEND_URL:', BACKEND_URL);

    const backendUrl = `${BACKEND_URL}/auth/login`;
    console.log('[AUTH/LOGIN] Chamando:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify(body),
    });

    console.log('[AUTH/LOGIN] Status:', response.status);
    console.log('[AUTH/LOGIN] Content-Type:', response.headers.get('content-type'));
    
    const text = await response.text();
    console.log('[AUTH/LOGIN] Resposta (primeiros 200 chars):', text.substring(0, 200));
    
    if (!response.ok) {
      console.error('[AUTH/LOGIN] Erro HTTP:', response.status, text.substring(0, 200));
      return NextResponse.json(
        { error: `Backend retornou ${response.status}`, details: text.substring(0, 200) },
        { status: response.status }
      );
    }

    try {
      const data = JSON.parse(text);
      console.log('[AUTH/LOGIN] Sucesso ao fazer login');
      return NextResponse.json(data, { status: 200 });
    } catch (e) {
      console.error('[AUTH/LOGIN] Erro ao parsear JSON:', e);
      return NextResponse.json(
        { error: 'Resposta inválida do backend' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[AUTH/LOGIN] Erro ao fazer login:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer login' },
      { status: 500 }
    );
  }
}}
