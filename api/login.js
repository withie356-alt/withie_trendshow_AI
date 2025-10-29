export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;

  if (password === process.env.PASSWORD) {
    // 인증 성공
    res.setHeader('Set-Cookie',
      `auth=${process.env.AUTH_TOKEN}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`
    );
    return res.status(200).json({ success: true });
  }

  // 인증 실패
  return res.status(401).json({ success: false });
}
