/**
 * 飞书 API 最基础客户端 - 只包含核心鉴权功能
 * 适用于 Deno 环境
 */

interface ClientConfig {
    appId: string;
    appSecret: string;
    domain?: 'feishu' | 'lark';
}

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    params?: Record<string, string>;
    data?: any;
    timeout?: number;
}

interface ApiResponse<T = any> {
    code: number;
    msg: string;
    data?: T;
}

export class FeishuClient {
    private appId: string;
    private appSecret: string;
    private baseUrl: string;
    private cachedToken: string | null = null;
    private tokenExpireTime: number = 0;

    constructor(config: ClientConfig) {
        this.appId = config.appId;
        this.appSecret = config.appSecret;

        // 设置域名
        const domain = config.domain || 'feishu';
        this.baseUrl = domain === 'feishu'
            ? 'https://open.feishu.cn'
            : 'https://open.larksuite.com';
    }

    /**
     * 获取 tenant_access_token
     */
    private async getTenantAccessToken(): Promise<string> {
        // 检查缓存的 token 是否还有效
        if (this.cachedToken && Date.now() < this.tokenExpireTime) {
            return this.cachedToken;
        }

        const response = await fetch(`${this.baseUrl}/open-apis/auth/v3/tenant_access_token/internal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                app_id: this.appId,
                app_secret: this.appSecret,
            }),
        });

        if (!response.ok) {
            throw new Error(`获取 token 失败: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (result.code !== 0) {
            throw new Error(`获取 token 失败: ${result.msg}`);
        }

        // 缓存 token，提前 3 分钟过期以避免网络延迟
        this.cachedToken = result.tenant_access_token;
        this.tokenExpireTime = Date.now() + (result.expire - 180) * 1000;

        return this.cachedToken;
    }

    /**
     * 发送 API 请求
     */
    async request<T = any>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
        const {
            method = 'GET',
            headers = {},
            params,
            data,
            timeout = 30000
        } = options;

        // 获取 access token
        const token = await this.getTenantAccessToken();

        // 构建完整 URL
        let fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;

        // 添加查询参数
        if (params) {
            const searchParams = new URLSearchParams(params);
            fullUrl += (fullUrl.includes('?') ? '&' : '?') + searchParams.toString();
        }

        // 设置请求头
        const requestHeaders: Record<string, string> = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...headers
        };

        // 设置请求选项
        const fetchOptions: RequestInit = {
            method,
            headers: requestHeaders,
            signal: AbortSignal.timeout(timeout)
        };

        // 添加请求体
        if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
            fetchOptions.body = typeof data === 'string' ? data : JSON.stringify(data);
        }

        try {
            const response = await fetch(fullUrl, fetchOptions);

            const result = await response.json();

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} ${response.statusText} - ${result.msg || 'Unknown error'}`);
            }

            return result;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`API 请求失败: ${error.message}`);
            }
            throw error;
        }
    }

    /**
     * 便捷方法：GET 请求
     */
    async get<T = any>(url: string, params?: Record<string, string>, headers?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.request<T>(url, { method: 'GET', params, headers });
    }

    /**
     * 便捷方法：POST 请求
     */
    async post<T = any>(url: string, data?: any, params?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.request<T>(url, { method: 'POST', data, params });
    }

    /**
     * 便捷方法：PUT 请求
     */
    async put<T = any>(url: string, data?: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.request<T>(url, { method: 'PUT', data, headers });
    }

    /**
     * 便捷方法：DELETE 请求
     */
    async delete<T = any>(url: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
        return this.request<T>(url, { method: 'DELETE', headers });
    }

    /**
     * 清除缓存的 token（强制重新获取）
     */
    clearToken(): void {
        this.cachedToken = null;
        this.tokenExpireTime = 0;
    }
}