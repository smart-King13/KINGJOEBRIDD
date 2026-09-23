import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const LARAVEL_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const COOKIE_NAME = 'kb_session';

export async function POST(req: NextRequest, { params }: { params: Promise<{ action: string }> }) {
  const resolvedParams = await params;
  const action = resolvedParams.action;
  
  if (!['login', 'register', 'logout'].includes(action)) {
    return NextResponse.json({ message: 'Invalid auth action' }, { status: 404 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  
  const headers = new Headers(req.headers);
  headers.delete('host');
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const targetUrl = `${LARAVEL_API_URL}/api/v1/auth/${action}`;
  let body = undefined;
  
  if (action !== 'logout') {
      try {
          const json = await req.json();
          body = JSON.stringify(json);
      } catch (e) {
          // ignore
      }
  }

  const response = await fetch(targetUrl, {
    method: 'POST',
    headers,
    body,
    cache: 'no-store'
  });

  const data = await response.json().catch(() => ({}));

  // Prevent Next.js from dropping headers on 204 No Content responses
  const finalStatus = response.status === 204 ? 200 : response.status;
  const res = NextResponse.json(data, { status: finalStatus });

  if (response.ok && (action === 'login' || action === 'register')) {
    const authToken = data?.data?.token;
    if (authToken) {
      res.cookies.set(COOKIE_NAME, authToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
      // Strip token before returning to JS
      if (data.data && data.data.token) {
          delete data.data.token;
      }
    }
  } else if (action === 'logout' && (response.ok || response.status === 401)) {
    res.cookies.set(COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0
    });
  }

  return res;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ action: string }> }) {
  const resolvedParams = await params;
  const action = resolvedParams.action;
  
  if (action !== 'me') {
    return NextResponse.json({ message: 'Invalid auth action' }, { status: 404 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  
  if (!token) {
    return NextResponse.json({ message: 'Unauthenticated.' }, { status: 401 });
  }

  const targetUrl = `${LARAVEL_API_URL}/api/v1/auth/me`;
  
  const response = await fetch(targetUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    cache: 'no-store'
  });

  const data = await response.json().catch(() => ({}));
  
  const res = NextResponse.json(data, { status: response.status });
  
  if (response.status === 401) {
    res.cookies.set(COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0
    });
  }

  return res;
}
