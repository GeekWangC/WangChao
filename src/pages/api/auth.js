export default async function handler(req, res) {
  const { query = {} } = req;

  try {
    if (!query.code) {
      throw new Error('No code provided');
    }

    const resp = await fetch(
      `https://github.com/login/oauth/access_token?client_id=${process.env.OAUTH_CLIENT_ID}&client_secret=${process.env.OAUTH_CLIENT_SECRET}&code=${query.code}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const data = await resp.json();

    if (data.error) {
      throw new Error(data.error);
    }

    const accessToken = data.access_token;

    // 获取用户信息
    const userResp = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    const user = await userResp.json();

    // 重定向回 CMS
    res.redirect(
      `/admin/#access_token=${accessToken}&token_type=bearer&scope=repo,user&user=${user.login}`
    );
  } catch (err) {
    console.error('Auth Error:', err);
    res.redirect('/admin/#error=Auth Failed');
  }
} 