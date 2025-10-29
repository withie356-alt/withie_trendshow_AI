import { NextResponse } from 'next/server';

export function middleware(request) {
  // 쿠키에서 인증 상태 확인
  const authCookie = request.cookies.get('auth');

  // 이미 인증된 경우
  if (authCookie?.value === 'authenticated') {
    return NextResponse.next();
  }

  // 암호 확인 요청인 경우
  const password = request.headers.get('x-password');
  if (password === '356356') {
    const response = NextResponse.next();
    response.cookies.set('auth', 'authenticated', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7일
    });
    return response;
  }

  // 로그인 페이지로 리다이렉트
  const url = request.nextUrl.clone();
  if (url.pathname !== '/login.html') {
    url.pathname = '/login.html';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!login.html|_next|favicon.ico).*)']
};
