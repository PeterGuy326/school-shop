import { Redis } from 'ioredis'
import { redis } from '../index'
import { Context } from 'koa'
import { accessLogger } from '../logger'
import { v4 } from 'uuid'

export class RedisLock {
	private ioredis: Redis | undefined
	private lockKey!: string
	private lockValue!: string
	private ctx: Context
    
	constructor(ctx: Context) {
		this.ctx = ctx
		redis
			.then((item) => {
				this.ioredis = item
			})
			.catch((error) => {
				console.log(`[err] There is no redis connection instance.`)
			})
	}

	setLockKey(key: string) {
		accessLogger.info(`${(this.ctx.zipkinTraceId || {}).traceId}|setLock: ${key}`)
		this.lockKey = key
		this.lockValue = v4()
		return this
	}

	/**
	 * 设置锁 NULL 表示已存在锁
	 * @param params
	 */
	async setLock(expire_time: number) {
		if (!this.lockKey) throw new Error('must set lockKey')
		return await this.ioredis?.set(this.lockKey, this.lockValue, 'EX', expire_time, 'NX')
	}

	/**
	 * 获取锁
	 * @param params
	 */
	async getLock() {
		if (!this.lockKey) throw new Error('must set lockKey')
		return await this.ioredis?.get(this.lockKey)
	}

	/**
	 * 删除释放锁
	 * @param params
	 */
	async delLock() {
		if (!this.lockKey) throw new Error('must set lockKey')
		accessLogger.info(`${(this.ctx.zipkinTraceId || {}).traceId}|delLock: ${this.lockKey}`)
		return this.ioredis?.eval(
			`
            -- avoid delete other's lock
            if redis.call("get", KEYS[1]) == ARGV[1] then
                return redis.call("del", KEYS[1])
            else
                return 0
            end
            `,
			1,
			this.lockKey,
			this.lockValue
		)
	}
}
