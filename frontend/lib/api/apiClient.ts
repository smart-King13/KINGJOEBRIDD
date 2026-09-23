import { ApiError } from '@/types/api';

export const API_PROXY_URL = '/api/proxy';
export const API_AUTH_URL = '/api/auth';

interface ApiOptions extends RequestInit {
  data?: any;
}

export async function apiClient<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { data, headers: customHeaders, ...customConfig } = options;

  const isFormData = data instanceof FormData;
  
  const headers = new Headers(customHeaders);
  
  if (!isFormData) {
    headers.set('Content-Type', 'application/json');
  }
  headers.set('Accept', 'application/json');

  // Forward cookies in SSR
  if (typeof window === 'undefined') {
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.getAll().map((c: any) => `${c.name}=${c.value}`).join('; ');
      if (cookieHeader) {
        headers.set('Cookie', cookieHeader);
      }
    } catch (e) {
      // Ignore if next/headers is not available
    }
  }

  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
    headers,
    credentials: 'include',
    cache: 'no-store',
    ...customConfig,
  };

  // Determine if this is an auth route (login/register/logout)
  const authPrefixes = ['/login', '/register', '/logout'];
  const isAuthEndpoint = authPrefixes.some(
    prefix => endpoint === prefix || endpoint.startsWith(`${prefix}/`) || endpoint.startsWith(`${prefix}?`)
  );
  
  const baseUrl = isAuthEndpoint ? API_AUTH_URL : API_PROXY_URL;
  
  // Handle absolute URL for SSR
  const isServer = typeof window === 'undefined';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const fullUrl = isServer ? `${siteUrl}${baseUrl}${endpoint}` : `${baseUrl}${endpoint}`;

  try {
    const response = await fetch(fullUrl, config);
    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw {
        message: responseData.message || 'Something went wrong.',
        errors: responseData.errors,
        status: response.status
      };
    }

    return responseData as T;
  } catch (error: any) {
    // If it's already our structured error, rethrow
    if (error.status) throw error;
    
    // Otherwise it's a network error
    throw {
      message: error.message || 'Network error occurred.',
      status: 0
    };
  }
}
