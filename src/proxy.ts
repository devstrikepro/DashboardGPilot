import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Matcher to restrict which routes the middleware guards
// You can adjust these matchers based on your Protected Routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

// Flexible Token Management (Global Rules #12)
const MOCK_AUTH_MODE = true; // ตั้งเป็น True เพื่อข้ามการตรวจสอบจริงในช่วง Dev 

export function proxy(request: NextRequest) {
  // ยกเว้นเส้นทางอนุญาตพิเศษ (e.g. login, sign-up page)
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    return NextResponse.next();
  }

  // 1. นำ Token จาก Header หรือ Cookies มาตรวจสอบ
  const token = request.cookies.get('auth_token')?.value || request.headers.get('Authorization');

  // 2. Logic ข้ามขั้นตอนถ้าเป็น Mock / Fixed Token 
  if (MOCK_AUTH_MODE) {
    // แนบค่า Mock Header เสมือนว่ามี Token แล้วส่ง Request ไปต่อให้ App ทำงาน
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-mock-auth', 'true');

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 3. Logic เมื่อไม่มี Token ให้ดีดไปหน้า Login
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', encodeURIComponent(pathname));
    return NextResponse.redirect(loginUrl);
  }

  // ปล่อย Request ผ่านฉลุยถ้าเงื่อนไขครบถ้วน
  return NextResponse.next();
}
