export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // /api/login 경로는 별도 함수로 처리
  if (url.pathname === '/api/login') {
    return next();
  }

  // 로그인 페이지는 통과
  if (url.pathname === '/login.html') {
    return next();
  }

  // 쿠키 확인
  const cookies = request.headers.get('Cookie') || '';
  const authToken = cookies.split(';')
    .find(c => c.trim().startsWith('auth='))
    ?.split('=')[1];

  // 환경변수가 설정되지 않은 경우 (개발 중) - 통과
  if (!env || !env.AUTH_TOKEN) {
    return next();
  }

  // 이미 인증된 경우
  if (authToken === env.AUTH_TOKEN) {
    return next();
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  return Response.redirect(new URL('/login.html', request.url), 302);
}
