# Todo 数据库实现方案

## 1. 系统架构

### 1.1 整体架构图
```
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|  React Frontend  | <-> |   Express API    | <-> |   PostgreSQL    |
|                  |     |                  |     |                  |
+------------------+     +------------------+     +------------------+
         ^                       ^                        ^
         |                       |                        |
         v                       v                        v
+------------------+     +------------------+     +------------------+
|     Redux /      |     |   Middleware &   |     |      Data       |
|  React Query     |     |    Services      |     |    Models       |
+------------------+     +------------------+     +------------------+
```

### 1.2 数据流图
```
用户操作 -> Redux Action -> API 请求 -> 服务层处理 -> 数据库操作 -> 响应返回 -> 状态更新 -> UI 更新
```

## 2. 技术选型

### 2.1 前端技术栈
- React (现有)
- Redux Toolkit (状态管理)
- React Query (数据获取和缓存)
- Axios (HTTP 客户端)
- Framer Motion (动画，现有)

### 2.2 后端技术栈
- Node.js + Express (API 服务器)
- TypeORM (ORM 框架)
- PostgreSQL (关系型数据库)
- JWT (身份认证)
- Winston (日志管理)

### 2.3 部署技术
- Docker (容器化)
- Docker Compose (服务编排)
- Nginx (反向代理)
- PM2 (Node.js 进程管理)

## 3. 数据库设计

### 3.1 用户表 (users)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3.2 待办事项表 (todos)
```sql
CREATE TABLE todos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    priority VARCHAR(20) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3.3 标签表 (tags)
```sql
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3.4 待办事项标签关联表 (todo_tags)
```sql
CREATE TABLE todo_tags (
    todo_id UUID REFERENCES todos(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (todo_id, tag_id)
);
```

## 4. API 设计

### 4.1 认证相关
- POST /api/auth/register - 用户注册
- POST /api/auth/login - 用户登录
- POST /api/auth/logout - 用户登出
- GET /api/auth/me - 获取当前用户信息

### 4.2 待办事项相关
- GET /api/todos - 获取待办列表
- GET /api/todos/:id - 获取单个待办
- POST /api/todos - 创建待办
- PUT /api/todos/:id - 更新待办
- DELETE /api/todos/:id - 删除待办
- PATCH /api/todos/:id/complete - 标记完成/未完成

### 4.3 标签相关
- GET /api/tags - 获取标签列表
- POST /api/tags - 创建标签
- PUT /api/tags/:id - 更新标签
- DELETE /api/tags/:id - 删除标签

## 5. 前端状态管理

### 5.1 Redux Store 结构
```javascript
{
  auth: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  todos: {
    items: [],
    loading: false,
    error: null,
    filters: {
      startDate: null,
      endDate: null,
      priority: null,
      tags: []
    }
  },
  tags: {
    items: [],
    loading: false,
    error: null
  }
}
```

### 5.2 React Query 缓存设计
- 待办事项查询键：['todos', filters]
- 单个待办查询键：['todo', id]
- 标签查询键：['tags']

## 6. 部署方案

### 6.1 开发环境
1. 本地开发
   - 使用 Docker Compose 启动数据库
   - 前端开发服务器（Vite）
   - 后端开发服务器（Nodemon）

2. 环境变量配置
   ```
   # Frontend (.env)
   VITE_API_URL=http://localhost:3000/api

   # Backend (.env)
   NODE_ENV=development
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=todo_dev
   DB_USER=postgres
   DB_PASSWORD=postgres
   JWT_SECRET=your-jwt-secret
   ```

### 6.2 生产环境

1. Docker 容器化
   ```yaml
   # docker-compose.yml
   version: '3.8'
   
   services:
     frontend:
       build: ./frontend
       ports:
         - "80:80"
       depends_on:
         - backend
   
     backend:
       build: ./backend
       ports:
         - "3000:3000"
       depends_on:
         - db
       environment:
         - NODE_ENV=production
         - DB_HOST=db
   
     db:
       image: postgres:14
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
   volumes:
     postgres_data:
   ```

2. Nginx 配置
   ```nginx
   # nginx.conf
   server {
     listen 80;
     
     location /api {
       proxy_pass http://backend:3000;
     }
     
     location / {
       root /usr/share/nginx/html;
       try_files $uri $uri/ /index.html;
     }
   }
   ```

3. 数据库备份策略
   - 每日自动备份
   - 保留最近 7 天的备份
   - 每月一次完整备份存档

### 6.3 CI/CD 流程
1. 代码提交触发 GitHub Actions
2. 运行测试和代码检查
3. 构建 Docker 镜像
4. 推送到容器仓库
5. 部署到服务器

## 7. 安全考虑

1. 数据安全
   - 使用 HTTPS
   - 密码加密存储
   - SQL 注入防护
   - XSS 防护

2. 认证和授权
   - JWT token 认证
   - 请求频率限制
   - CORS 配置

3. 数据验证
   - 输入数据验证
   - 请求参数验证
   - 响应数据清理

## 8. 性能优化

1. 前端优化
   - 组件懒加载
   - 状态管理优化
   - 缓存策略

2. 后端优化
   - 数据库索引
   - 查询优化
   - 响应缓存

3. 数据库优化
   - 合适的索引
   - 查询优化
   - 连接池配置

## 9. 开发计划

### 第一阶段：基础设施搭建（1周）
- 搭建后端项目结构
- 配置数据库
- 设置开发环境

### 第二阶段：核心功能开发（2周）
- 实现用户认证
- 开发待办 CRUD
- 集成前端状态管理

### 第三阶段：功能完善（1周）
- 实现标签系统
- 添加筛选和排序
- 优化用户体验

### 第四阶段：测试和部署（1周）
- 编写测试用例
- 配置部署环境
- 性能优化和调试

## 10. 监控和维护

1. 日志系统
   - 错误日志
   - 访问日志
   - 性能监控

2. 监控指标
   - API 响应时间
   - 数据库性能
   - 系统资源使用

3. 告警机制
   - 错误率监控
   - 性能阈值告警
   - 系统状态通知 