export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // 정적 파일은 그냥 통과
  if (url.pathname.includes('.') && !url.pathname.endsWith('.html')) {
    return next();
  }

  // 쿠키 확인
  const cookies = request.headers.get('Cookie') || '';
  const hasAuth = cookies.includes('siteauth=ok');

  // POST 요청 - 암호 확인
  if (request.method === 'POST') {
    try {
      const formData = await request.formData();
      const password = formData.get('password');

      if (password === env.PASSWORD) {
        // 원래 요청한 페이지로 리다이렉트
        const response = Response.redirect(url.origin + '/', 302);
        response.headers.set('Set-Cookie', 'siteauth=ok; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800');
        return response;
      }
    } catch (e) {}
  }

  // 인증된 경우 원래 페이지 보여주기
  if (hasAuth) {
    return next();
  }

  // 인증 안된 경우 로그인 폼 표시
  return new Response(`
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>로그인 - 트렌드쇼2026</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }
        .login-container {
            background: white;
            padding: 50px 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            width: 100%;
            text-align: center;
        }
        h1 {
            font-size: 28px;
            color: #333;
            margin-bottom: 10px;
            font-weight: 700;
        }
        .subtitle {
            color: #666;
            margin-bottom: 40px;
            font-size: 14px;
        }
        .input-group {
            margin-bottom: 30px;
            text-align: left;
        }
        label {
            display: block;
            margin-bottom: 10px;
            color: #555;
            font-weight: 600;
            font-size: 14px;
        }
        input[type="password"] {
            width: 100%;
            padding: 15px;
            border: 2px solid #e0e0e0;
            border-radius: 10px;
            font-size: 16px;
            transition: all 0.3s ease;
        }
        input[type="password"]:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        button {
            width: 100%;
            padding: 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }
        .lock-icon {
            font-size: 48px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="lock-icon">🔒</div>
        <h1>트렌드쇼2026</h1>
        <p class="subtitle">AI와의 경쟁</p>
        <form method="POST">
            <div class="input-group">
                <label for="password">비밀번호를 입력하세요</label>
                <input type="password" name="password" id="password" placeholder="비밀번호" required autofocus>
            </div>
            <button type="submit">입장하기</button>
        </form>
    </div>
</body>
</html>
  `, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
