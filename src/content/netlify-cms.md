---
title: "Netlify CMS 集成指南"
date: "2025-03-29"
category: "技术"
tags: ["Netlify", "CMS", "Gatsby"]
description: "如何在 Gatsby 项目中集成 Netlify CMS，实现可视化内容管理。"
---

好了，现在我们已经完成了 Netlify CMS 的集成，可以在 Vercel 上使用。下面是使用方法：
在 static/admin/config.yml 文件中，你需要将 OWNER/REPO-NAME 替换为你的 GitHub 用户名和仓库名。例如：username/my-gatsby-blog
在 GitHub 上为你的仓库创建一个 OAuth 应用：
前往 GitHub 的 Settings > Developer settings > OAuth Apps
点击 "New OAuth App"
填写表单：
Application name: 你的网站名
Homepage URL: 你的 Vercel 网站 URL
Authorization callback URL: 你的 Vercel 网站 URL + /api/auth
获取 Client ID 和 Client Secret
部署时，你需要在 Vercel 项目设置中添加以下环境变量：
OAUTH_CLIENT_ID: GitHub OAuth App 的 Client ID
OAUTH_CLIENT_SECRET: GitHub OAuth App 的 Client Secret
部署到 Vercel 后，你就可以通过 /admin 路径访问 Netlify CMS 的管理界面
这个 Netlify CMS 集成提供了一个直观的界面来编辑 Markdown 内容：
完整的可视化 Markdown 编辑器
实时预览功能
图片上传和管理
内容的版本控制（通过 Git）
草稿保存功能
与 Vercel 和 GitHub 的完美集成
要注意的是，由于我们是在 Vercel 上使用 Netlify CMS，身份验证部分需要额外配置。在上面的代码中，我们已经添加了必要的前端脚本支持。如果有问题，可能需要创建一个服务端 API 路由来处理身份验证，这需要更多的代码。
最后，重新部署你的项目到 Vercel，然后你就可以使用 /admin 路径访问 CMS 管理界面了。