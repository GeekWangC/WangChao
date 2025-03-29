const handler = async (req, res) => {
  console.log('Auth handler called with query:', req.query);
  console.log('Request method:', req.method);

  // 如果没有 code，重定向到 GitHub 授权页面
  if (!req.query.code) {
    const clientId = process.env.GATSBY_OAUTH_CLIENT_ID;
    const redirectUri = encodeURIComponent(`${process.env.SITE_URL}/api/auth`);
    const scope = 'repo,user';
    
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    
    console.log('Redirecting to GitHub auth page');
    return res.redirect(githubAuthUrl);
  }

  try {
    const code = req.query.code;
    console.log('Starting GitHub OAuth token exchange');
    
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
    console.log('Token response received:', tokenData.error ? 'error' : 'success');

    if (tokenData.error) {
      console.error('Token Error:', tokenData.error);
      return res.redirect('/admin/#error=' + encodeURIComponent(tokenData.error));
    }

    console.log('Getting user information');
    // 获取用户信息
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/json',
      },
    });

    const userData = await userResponse.json();
    console.log('User data received:', userData.login ? 'success' : 'error');

    // 重定向回 CMS，带上访问令牌
    const redirectUrl = `/admin/#access_token=${tokenData.access_token}&token_type=bearer&scope=${tokenData.scope}&user=${userData.login}`;
    console.log('Redirecting to CMS');
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error('Auth Error:', error);
    return res.redirect('/admin/#error=' + encodeURIComponent(error.message));
  }
};

export default handler; 