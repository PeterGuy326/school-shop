import { Context, Next } from 'koa'
import { accessLogger } from '../logger/index'
function AccessLogMiddleware(ctx: Context, next: Next) {
    const logStr = `path:${ctx.path} | method:${ctx.method} | ua:${ctx.headers['user-agent']}`
    accessLogger.info(logStr)
    return next()
}
export default AccessLogMiddleware