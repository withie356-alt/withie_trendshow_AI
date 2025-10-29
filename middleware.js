export default function middleware(request) {
  const url = new URL(request.url);

  // 로그인 페이지는 통과
  if (url.pathname === '/login.html') {
    return new Response(null, { status: 200 });
  }

  // 쿠키 확인
  const cookies = request.headers.get('cookie') || '';
  const authCookie = cookies.split(';').find(c => c.trim().startsWith('auth='));

  if (authCookie && authCookie.includes('authenticated')) {
    return new Response(null, { status: 200 });
  }

  // 암호 헤더 확인
  const password = request.headers.get('x-password');
  if (password === '356356') {
    const response = new Response(null, { status: 200 });
    response.headers.set('Set-Cookie', 'auth=authenticated; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800');
    return response;
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  return Response.redirect(new URL('/login.html', request.url), 302);
}

export const config = {
  matcher: ['/((?!login.html|_next|favicon.ico|.*\\.png|.*\\.jpg|.*\\.css|.*\\.js).*)']
};
