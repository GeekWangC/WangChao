const handler = async (req, res) => {
  // 确保只处理 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const code = req.query.code;
    
    if (!code) {
      return res.status(400).json({ message: 'No code provided' });
    }

    // GitHub OAuth token 交换
    const tokenResponse = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.GATSBY_OAUTH_CLIENT_ID,
          client_secret: process.env.GATSBY_OAUTH_CLIENT_SECRET,
          code: code,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('Token Error:', tokenData.error);
      return res.redirect('/admin/#error=token_error');
    }

    // 获取用户信息
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/json',
      },
    });

    const userData = await userResponse.json();

    // 重定向回 CMS，带上访问令牌
    const redirectUrl = `/admin/#access_token=${tokenData.access_token}&token_type=bearer&scope=${tokenData.scope}&user=${userData.login}`;
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error('Auth Error:', error);
    return res.redirect('/admin/#error=auth_error');
  }
};

export default handler; 