export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();

    // 환경변수가 없으면 에러
    if (!env || !env.PASSWORD || !env.AUTH_TOKEN) {
      return new Response(JSON.stringify({
        success: false,
        error: '서버 설정이 완료되지 않았습니다.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: '요청 처리 중 오류가 발생했습니다.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
