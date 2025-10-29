// 로그인 API
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const password = body.password;

    // 환경변수에서 암호 확인
    if (password === env.PASSWORD) {
      // 성공 - 쿠키 설정
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `authenticated=true; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`
        }
      });
    }

    // 실패
    return new Response(JSON.stringify({ success: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
