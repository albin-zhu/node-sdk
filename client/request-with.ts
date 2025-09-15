// Simple deep merge function to replace lodash.merge
function merge(target: any, ...sources: any[]): any {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                merge(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return merge(target, ...sources);
}

function isObject(item: any): item is object {
    return item && typeof item === 'object' && !Array.isArray(item);
}
import {
    CTenantKey,
    CWithHelpdeskAuthorization,
    CWithUserAccessToken,
} from './consts.ts';
import { IRequestOptions } from './types.ts';

export const withAll = (withList: IRequestOptions[]): IRequestOptions =>
    withList.reduce((acc, cur) => merge(acc, cur), {} as IRequestOptions);

export const withTenantKey = (tenantKey: string): IRequestOptions => ({
    lark: {
        [CTenantKey]: tenantKey,
    },
});

export const withHelpDeskCredential = (): IRequestOptions => ({
    lark: {
        [CWithHelpdeskAuthorization]: true,
    },
});

export const withTenantToken = (
    tenantAccessToken: string
): IRequestOptions => ({
    headers: {
        Authorization: `Bearer ${tenantAccessToken}`,
    },
});

export const withUserAccessToken = (
    userAccessToken: string
): IRequestOptions => ({
    lark: {
        [CWithUserAccessToken]: userAccessToken,
    },
});
