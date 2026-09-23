import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const LARAVEL_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function handleProxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join('/');
  const url = new URL(req.url);
  const searchParams = url.searchParams.toString();
  
  const targetUrl = `${LARAVEL_API_URL}/api/v1/${path}${searchParams ? `?${searchParams}` : ''}`;
  
  const cookieStore = await cookies();
  const token = cookieStore.get('kb_session')?.value;
  
  const headers = new Headers(req.headers);
  // Remove host to avoid Laravel CORS/Host header issues
  headers.delete('host');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? await req.blob() : undefined,
      // Pass cache control or revalidate if needed, but standard is no-store for mutations
      cache: 'no-store',
    });

    const data = await response.blob();
    
    // Create new headers for the response
    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete('content-encoding');
    
    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error (Proxy)' },
      { status: 500 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
