// 缓存的 key
export enum CacheKey {
    test = 'user:test:'
}

// 缓存的过期时间
export enum CacheKeyExpire {
    test = 5 * 60
}

export enum RedisLockKey {
    test = 'user:test:lock'
}

export const REDIS_PREFIX = process.env.NAMESPACE