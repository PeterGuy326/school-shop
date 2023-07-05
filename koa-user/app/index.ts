import dotenv from 'dotenv'
dotenv.config()
import { db, ioredis } from './db'
db()
export const redis = ioredis()
import Koa from 'koa'
import router from './router'
import { Server } from 'http'
import AccessLogMiddleware from './middleware/AccessLogMiddleware'
import koaBody from 'koa-body'
import koaStatic from 'koa-static'
import path from 'path'
import cors from 'koa2-cors'

const app = new Koa

app.use(cors());
app.use(koaBody({multipart: true, formidable: { maxFileSize: 200 * 1024 * 1024 }}))
app.use(koaStatic(path.join(__dirname, '..', 'statics')))
app.use(AccessLogMiddleware)
app.use(router.routes())

const run = (port: any): Server => {
    return app.listen(port)
}

export default run