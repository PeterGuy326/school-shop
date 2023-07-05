import { dbLogger } from '../logger/index'
import path from 'path'
import { Sequelize } from 'sequelize-typescript'
import config from '../config'
import colors from 'colors'
import { Redis } from '../lib/redis'

const { db_name, db_user, db_password, db_host, db_port } = config.db
const { redis_host, redis_port } = config.redis

const sequelize = new Sequelize(db_name as string, db_user as string, db_password, {
    host: db_host,
    port: db_port,
    dialect: 'mysql',
    logging: msg => dbLogger.info(msg),
    define: {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    },
    models: [path.join(__dirname, '..', 'model/**/*.ts'), path.join(__dirname, '..', 'model/**/*.js')]
})

const redis = new Redis(redis_port, redis_host as string)

const db = async () => {
    try {
        await sequelize.authenticate()
        console.log(colors.green('[mysql] Connection has been established successfully.'))
    } catch (error) {
        console.log(colors.red(`[mysql] Unable to connect to the database:${error}`))
    }
}

const ioredis = async () => {
    try {
        const instance = await redis.getInstance()
        await console.log(colors.green('[redis] Connection has been established successfully.'))
        return instance
    } catch (error) {
        console.log(colors.red(`[redis] Unable to connect to the redis:${error}`))
    }
}
export { db, sequelize, ioredis }