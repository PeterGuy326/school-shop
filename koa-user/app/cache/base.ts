import { Redis } from 'ioredis'
import { redis } from '../index'
import { CacheKeyExpire, REDIS_PREFIX } from '../constant/cache'
import { accessLogger } from '../logger'
import { Context } from 'koa'
import { RedisLock } from '../lib/redis_lock'
import { sleep } from '../../utils/timer'

export class BaseCache<Req, Res> {
    protected _prefix!: string
    protected ioredis: Redis | undefined
    protected _lock_key!: string
    protected expireTime!: CacheKeyExpire
    protected lock_expire_time!: CacheKeyExpire
    protected ctx: Context

    protected get prefix() {
        if (this._prefix.startsWith(`${REDIS_PREFIX}`)) {
            return this._prefix
        }
        return `${REDIS_PREFIX}:${this._prefix}`
    }

    protected set prefix(_value) {
        this._prefix = _value
    }

    protected get lock_key() {
        if (this._lock_key.startsWith(`${REDIS_PREFIX}`)) {
            return this._lock_key
        }
        return `${REDIS_PREFIX}:${this._lock_key}`
    }

    protected set lock_key(_value) {
        this._lock_key = _value
    }

    constructor(ctx: Context) {
        this.ctx = ctx
        redis
            .then(item => {
                this.ioredis = item
            })
            .catch(error => {
                console.log(`[err] There is no redis connection instance.`)
            })
    }

    /**
     * 获取缓存数据
     */
    async getData(params: Req, fn: (p: Req) => Promise<Res>): Promise<Res> {
        const cache = await this.getCache(params)
        if (cache) {
            return JSON.parse(cache)
        }
        // 锁
        const redisLock = new RedisLock(this.ctx).setLockKey(this.getLockKey(params))
        try {
            const lockSuccess = await redisLock.setLock(this.lock_expire_time)
            // null 表示设置失败，已存在锁在查询数据
            if (lockSuccess === null) {
                // 最大等到 2 min
                const waitCache = await this.waitGetCache(params, 2 * 60 * 1000, redisLock)
                if (waitCache !== null) {
                    return JSON.parse(waitCache)
                }
            }
            const data = await this.loadData(params, fn)
            await this.setCache(params, data)
            return data
        } catch (err) {
            accessLogger.error(err)
            throw err
        } finally {
            redisLock.delLock().catch(err => accessLogger.error(err))
        }
    }

    getCache(params: Req, page?: number) {
        let key = this.buildKey(params)
        if (page) {
            key = key + `.${page}`
        }
        accessLogger.info(`${(this.ctx.zipkinTraceId || {}).traceId}|${this.prefix} cache hit: ${key}`)
        return this.ioredis?.get(key)
    }
    
    async setCache(params: Req, data: Res) {
        const key = this.buildKey(params)
        accessLogger.info(`${(this.ctx.zipkinTraceId || {}).traceId}|${this.prefix} cache set: ${key}`)
        await this.ioredis?.setex(key, this.expireTime, JSON.stringify(data))
    }

    async loadData(params: Req, fn: (v: Req) => Promise<Res>): Promise<Res> {
        return await fn.call(this, params)
    }

    /**
     * 等待获取缓存结果
     * @param params 
     * @param maxWaitTime 
     * @param redisLock 
     * @returns 
     */
    private async waitGetCache(params: Req, maxWaitTime: number, redisLock: RedisLock) {
        // 最大等待 5 秒
        maxWaitTime = maxWaitTime || 300000
        let intervalTime = 20
        let totalTime = intervalTime
        while (totalTime <= maxWaitTime) {
            // 睡眠
            accessLogger.info(`${(this.ctx.zipkinTraceId || {}).traceId}|${this.prefix} wait cache: ${totalTime}ms`)
            const lockExist = await redisLock.getLock()
            // 如果锁不存在，则获取数据
            if (!lockExist) {
                const result_cache = await this.getCache(params)
                return result_cache || null
            } else {
                await sleep(intervalTime)
            }

            // 最大 500 ms
            intervalTime = intervalTime * 2
            intervalTime = intervalTime > 500 ? 500 : intervalTime
            totalTime += intervalTime
        }
        return null
    }

    /**
     * 生成缓存的 key 值
     */
    protected buildKey(params: Req): string {
        throw new Error('please override this method')
    }

    /**
     * 生成锁的 key 值
     */
    protected getLockKey(params: Req): string {
        throw new Error('please override this method')
    }
}