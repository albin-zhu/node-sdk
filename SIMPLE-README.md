# 飞书 API 基础客户端 (Deno)

一个极简的飞书 API 客户端，专为 Deno 环境设计，只包含核心的鉴权功能。

## 特性

- 🦕 **Deno 原生支持** - 使用 fetch API，无需 Node.js 依赖
- 🔐 **自动鉴权** - 自动获取和管理 tenant_access_token
- 📦 **零依赖** - 纯原生 TypeScript 实现
- ⚡ **轻量级** - 只有一个文件，不到 200 行代码
- 🚀 **简单易用** - 提供便捷的 HTTP 方法

## 快速开始

### 1. 基本用法

```typescript
import { FeishuClient } from './simple-client.ts';

const client = new FeishuClient({
    appId: 'your_app_id',
    appSecret: 'your_app_secret',
    domain: 'feishu'  // 或 'lark'
});

// 调用 API
const response = await client.get('/open-apis/application/v6/applications/self');
console.log(response.data);
```

### 2. HTTP 方法

```typescript
// GET 请求
const result = await client.get('/open-apis/contact/v3/users/me');

// POST 请求
const message = await client.post('/open-apis/im/v1/messages', {
    receive_id: 'chat_id',
    msg_type: 'text',
    content: JSON.stringify({ text: 'Hello!' })
});

// 通用请求方法
const custom = await client.request('/your-api-path', {
    method: 'PUT',
    data: { key: 'value' },
    headers: { 'Custom-Header': 'value' }
});
```

### 3. 运行示例

```bash
# 运行基础示例
deno run --allow-net simple-example.ts

# 或者给予所有权限
deno run -A simple-example.ts
```

## API 参考

### FeishuClient

#### 构造函数

```typescript
new FeishuClient(config: ClientConfig)
```

**ClientConfig:**
- `appId: string` - 应用 ID
- `appSecret: string` - 应用密钥
- `domain?: 'feishu' | 'lark'` - 域名，默认 'feishu'

#### 方法

##### request(url, options)
通用请求方法

```typescript
async request<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>>
```

##### get/post/put/delete
便捷 HTTP 方法

```typescript
async get<T>(url: string, params?: Record<string, string>, headers?: Record<string, string>): Promise<ApiResponse<T>>
async post<T>(url: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>>
async put<T>(url: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>>
async delete<T>(url: string, headers?: Record<string, string>): Promise<ApiResponse<T>>
```

##### clearToken()
清除缓存的 token

```typescript
clearToken(): void
```

## 响应格式

所有 API 响应都遵循飞书标准格式：

```typescript
interface ApiResponse<T> {
    code: number;    // 错误码，0 表示成功
    msg: string;     // 错误信息
    data?: T;        // 响应数据
}
```

## 常用 API 示例

### 发送消息

```typescript
const response = await client.post('/open-apis/im/v1/messages', {
    receive_id: 'chat_id_or_user_id',
    msg_type: 'text',
    content: JSON.stringify({
        text: '你的消息内容'
    })
}, {
    'receive_id_type': 'chat_id'  // 或 'user_id', 'email' 等
});
```

### 操作表格

```typescript
// 读取表格数据
const data = await client.get('/open-apis/sheets/v2/spreadsheets/SHEET_TOKEN/values/RANGE');

// 写入表格数据
const result = await client.put('/open-apis/sheets/v2/spreadsheets/SHEET_TOKEN/values', {
    valueRange: {
        range: 'Sheet1!A1:B2',
        values: [['A1', 'B1'], ['A2', 'B2']]
    }
});
```

### 获取用户信息

```typescript
const users = await client.get('/open-apis/contact/v3/users', {
    page_size: '50'
});
```

## 错误处理

```typescript
try {
    const response = await client.get('/open-apis/some/api');
    if (response.code === 0) {
        // 成功
        console.log(response.data);
    } else {
        // API 返回错误
        console.error('API 错误:', response.msg);
    }
} catch (error) {
    // 网络或其他错误
    console.error('请求失败:', error.message);
}
```

## 注意事项

1. **权限配置** - 确保应用具有相应的 API 权限
2. **域名选择** - 根据你的飞书/Lark 环境选择正确的域名
3. **Token 缓存** - 客户端会自动缓存和刷新 access token
4. **错误处理** - 建议总是检查 response.code 确认 API 调用是否成功

## 与完整版 SDK 的区别

- ✅ 保留：核心鉴权、HTTP 请求、错误处理
- ❌ 移除：自动生成的 API 方法、复杂的类型定义、事件处理等
- 🎯 专注：简单、直接的 API 调用体验