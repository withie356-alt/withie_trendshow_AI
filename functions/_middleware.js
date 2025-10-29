export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // 로그인 페이지와 정적 파일은 통과
  if (url.pathname === '/login.html' ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg')) {
    return next();
  }

  // 쿠키 확인
  const cookies = request.headers.get('Cookie') || '';
  const authToken = cookies.split(';')
    .find(c => c.trim().startsWith('auth='))
    ?.split('=')[1];

  // 이미 인증된 경우
  if (authToken === env.AUTH_TOKEN) {
    return next();
  }

  // POST 요청 - 로그인 시도
  if (request.method === 'POST' && url.pathname === '/api/login') {
    const body = await request.json();

    if (body.password === env.PASSWORD) {
      const response = new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });

      // 쿠키 설정
      response.headers.set('Set-Cookie',
        `auth=${env.AUTH_TOKEN}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`
      );

      return response;
    }

    return new Response(JSON.stringify({ success: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  return Response.redirect(new URL('/login.html', request.url), 302);
}
