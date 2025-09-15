# Larksuite/Feishu Node SDK - Deno Client

这是 `@larksuiteoapi/node-sdk` 的 Deno 兼容版本，专注于 client 功能。

## 特性

- ✅ 使用 Deno 原生 `fetch` 替代 axios
- ✅ 移除了所有 Node.js 特定依赖 (Buffer, lodash, etc.)
- ✅ 完整的类型支持
- ✅ 支持飞书和 Lark 域名
- ✅ 内置缓存和日志系统

## 使用方法

```typescript
import { Client, AppType, Domain } from './mod.ts';

const client = new Client({
    appId: 'your_app_id',
    appSecret: 'your_app_secret',
    domain: Domain.Feishu, // 或 Domain.Lark
    appType: AppType.SelfBuild
});

// 使用 client 发送请求
const response = await client.request({
    method: 'GET',
    url: '/open-apis/auth/v3/tenant_access_token/internal'
});
```

## 架构

- `client.ts` - 主要的客户端类
- `token-manager.ts` - Token 管理
- `http-client.ts` - 基于 fetch 的 HTTP 客户端
- `typings.ts` - 类型定义
- `utils.ts` - 工具函数
- `logger.ts` - 日志系统
- `consts.ts` - 常量定义

## 测试

```bash
deno run --allow-net test-client.ts
```

## 与原版差异

1. 使用 `fetch` 替代 `axios`
2. 使用原生方法替代 `lodash`
3. 使用 `btoa` 替代 Node.js `Buffer` 进行 base64 编码
4. 移除了代码生成的 API 方法（需要单独实现）