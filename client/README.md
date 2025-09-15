# Larksuite/Feishu Node SDK - Deno Client

这是 `@larksuiteoapi/node-sdk` 的 Deno 兼容版本，专注于 client 功能。

## 特性

- ✅ 使用 Deno 原生 `fetch` 替代 axios
- ✅ 移除了所有 Node.js 特定依赖 (Buffer, lodash, etc.)
- ✅ 完整的类型支持
- ✅ 支持飞书和 Lark 域名
- ✅ 内置缓存和日志系统
- ✅ 自动 Token 管理
- ✅ 支持企业自建应用和应用商店应用

## 快速开始

### 基本用法

```typescript
import { Client, AppType, Domain } from './mod.ts';

const client = new Client({
    appId: 'your_app_id',
    appSecret: 'your_app_secret',
    domain: Domain.Feishu, // 或 Domain.Lark
    appType: AppType.SelfBuild
});

// 调用 API
const response = await client.request({
    method: 'GET',
    url: '/open-apis/application/v6/applications/self'
});
```

### 发送消息

```typescript
const message = await client.request({
    method: 'POST',
    url: '/open-apis/im/v1/messages',
    params: {
        receive_id_type: 'chat_id'
    },
    data: {
        receive_id: 'your_chat_id',
        msg_type: 'text',
        content: JSON.stringify({
            text: 'Hello from Deno! 🦕'
        })
    }
});
```

### 操作表格

```typescript
// 获取表格信息
const sheetInfo = await client.request({
    method: 'GET',
    url: '/open-apis/sheets/v3/spreadsheets/your_token/sheets/sheet_id'
});

// 读取表格数据
const sheetData = await client.request({
    method: 'GET',
    url: '/open-apis/sheets/v2/spreadsheets/your_token/values/Sheet1!A1:C10'
});
```

### 使用用户访问令牌

```typescript
import { withUserAccessToken } from './mod.ts';

const response = await client.request({
    method: 'GET',
    url: '/open-apis/authen/v1/user_info'
}, withUserAccessToken('user_access_token_here'));
```

### 应用商店应用

```typescript
import { withTenantKey } from './mod.ts';

const client = new Client({
    appId: 'your_app_id',
    appSecret: 'your_app_secret',
    domain: Domain.Feishu,
    appType: AppType.ISV // 应用商店应用
});

const response = await client.request({
    method: 'GET',
    url: '/open-apis/contact/v3/users/me'
}, withTenantKey('your_tenant_key'));
```

## 运行示例

```bash
# 运行基本测试
deno run --allow-net test-client.ts

# 运行完整示例
deno run --allow-net example.ts
```

## 架构

- `client.ts` - 主要的客户端类
- `token-manager.ts` - Token 管理
- `http-client.ts` - 基于 fetch 的 HTTP 客户端
- `typings.ts` - 类型定义
- `utils.ts` - 工具函数
- `logger.ts` - 日志系统
- `consts.ts` - 常量定义
- `request-with.ts` - 请求辅助函数

## 与原版差异

1. **HTTP 客户端**: 使用 `fetch` 替代 `axios`
2. **工具函数**: 使用原生方法替代 `lodash`
3. **编码**: 使用 `btoa` 替代 Node.js `Buffer` 进行 base64 编码
4. **API 方法**: 移除了代码生成的 API 方法，使用通用的 `request` 方法
5. **模块系统**: 使用 ES 模块和 `.ts` 扩展名

## API 参考

### Client 类

```typescript
class Client {
    constructor(params: IClientParams)
    request<T>(config: RequestConfig, options?: IRequestOptions): Promise<T>
    formatPayload(payload?: IPayload, options?: IRequestOptions): Promise<Required<IPayload>>
}
```

### 辅助函数

- `withTenantKey(key: string)` - 指定租户密钥
- `withUserAccessToken(token: string)` - 使用用户访问令牌
- `withTenantToken(token: string)` - 使用应用访问令牌
- `withHelpDeskCredential()` - 使用服务台凭证
- `withAll(options: IRequestOptions[])` - 合并多个选项

## 注意事项

1. 这个版本只包含基础的 client 功能，没有自动生成的 API 方法
2. 需要手动构建 API 调用路径和参数
3. 建议参考官方 API 文档来构建请求