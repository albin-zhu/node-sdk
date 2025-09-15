// Types and interfaces for client module

export interface Cache {
    set: (
        key: string | Symbol,
        value: any,
        expire?: number,
        options?: {
            namespace?: string
        }
    ) => Promise<boolean>;
    get: (key: string | Symbol, options?: {
        namespace?: string
    }) => Promise<any>;
}

export interface Logger {
    error: (...msg: any[]) => void | Promise<void>;
    warn: (...msg: any[]) => void | Promise<void>;
    info: (...msg: any[]) => void | Promise<void>;
    debug: (...msg: any[]) => void | Promise<void>;
    trace: (...msg: any[]) => void | Promise<void>;
}

export enum AppType {
    SelfBuild,
    ISV,
}

export enum Domain {
    Feishu,
    Lark,
}

export enum LoggerLevel {
    fatal,
    error,
    warn,
    info,
    debug,
    trace,
}

// HTTP client interface
export interface HttpInstance {
    request<T = any>(config: any): Promise<T>;
    post?<T = any>(url: string, data?: any, config?: any): Promise<T>;
    get?<T = any>(url: string, config?: any): Promise<T>;
}