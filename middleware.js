import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();

  // 로그인 페이지와 API는 통과
  if (url.pathname === '/login.html' || url.pathname === '/api/login') {
    return NextResponse.next();
  }

  // 쿠키 확인
  const authCookie = request.cookies.get('auth');

  if (authCookie?.value === process.env.AUTH_TOKEN) {
    return NextResponse.next();
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  url.pathname = '/login.html';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!login.html|api|_next|favicon.ico|.*\\.png|.*\\.jpg).*)']
};
