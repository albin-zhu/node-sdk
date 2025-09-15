// Utility functions for client module
import { Cache, Domain } from './typings.ts';

// Base64 encoding for Deno (replaces Node.js Buffer)
export const string2Base64 = (content: string): string => {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    return btoa(String.fromCharCode(...data));
};

// Domain formatting
export const formatDomain = (domain: Domain | string): string => {
    switch (domain) {
        case Domain.Feishu:
            return 'https://open.feishu.cn';
        case Domain.Lark:
            return 'https://open.larksuite.com';
        default:
            return domain;
    }
};

// Assert utility
export const assert = async (
    predication: boolean | (() => boolean),
    callback: () => any | Promise<any>
) => {
    const isInvoke =
        typeof predication === 'function' ? predication() : predication;

    if (isInvoke) {
        await callback();
    }
};

// URL formatting
export const formatUrl = (url?: string) => (url ? url.replace(/^\//, '') : '');

// Default cache implementation
export class DefaultCache implements Cache {
    private values: Map<
        string | Symbol,
        {
            value: any;
            expiredTime?: number;
        }
    >;

    constructor() {
        this.values = new Map();
    }

    // When there is a namespace, splice the namespace and key to form a new key
    private getCacheKey(key: string | Symbol, namespace?: string) {
        if (namespace) {
            return `${namespace}/${key.toString()}`;
        }
        return key;
    }

    async get(key: string | Symbol, options?: {
        namespace?: string
    }) {
        const cacheKey = this.getCacheKey(key, options?.namespace);
        const data = this.values.get(cacheKey);

        if (data) {
            const { value, expiredTime } = data;
            if (!expiredTime || expiredTime - new Date().getTime() > 0) {
                return value;
            }
        }

        return undefined;
    }

    async set(key: string | Symbol, value: string, expiredTime?: number, options?: {
        namespace?: string
    }) {
        const cacheKey = this.getCacheKey(key, options?.namespace);
        this.values.set(cacheKey, {
            value,
            expiredTime,
        });
        return true;
    }
}

export const internalCache = new DefaultCache();

// Merge objects utility
export const mergeObject = (obj1: Record<string, any>, obj2: Record<string, any>) => {
    const mergedObject = { ...obj1 };

    for (let [key, value] of Object.entries(obj2)) {
        if (value !== undefined) {
            mergedObject[key] = value;
        }
    }

    return mergedObject;
};