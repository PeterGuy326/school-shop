import ioredis from 'ioredis'

export class Redis {
    private instance: ioredis
    constructor(port: number, host: string) {
        this.instance = new ioredis(port as number, host as string)
    }

    async setKey(key: string, value: string, expireTime: number) {
        const redis = this.getInstance()
        await redis.set(key, value, 'EX', expireTime)
    }

    async getValue(key: string): Promise<string> {
        const redis = this.getInstance()
        return await redis.get(key) || ''
    }

    getInstance() {
        return this.instance as ioredis
    }
}
