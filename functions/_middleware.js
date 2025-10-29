export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  // 로그인 페이지와 auth API는 항상 통과
  if (url.pathname === '/login.html' || url.pathname === '/auth') {
    return await next();
  }

  // 쿠키 확인
  const cookieHeader = request.headers.get('Cookie') || '';
  const isAuthenticated = cookieHeader.includes('authenticated=true');

  if (isAuthenticated) {
    return await next();
  }

  // 인증 안된 경우 로그인 페이지로
  return Response.redirect(new URL('/login.html', request.url), 302);
}
